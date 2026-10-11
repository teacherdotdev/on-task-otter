import { useCallback, useEffect, useRef, useState } from "react";
import { applyCalibration } from "../audio/calibration";

/**
 * The microphone: raw room loudness, ten times a second.
 *
 * Deliberately has no opinion about what "too loud" means — it publishes a
 * level and a status and nothing else. It also never pretends: if the
 * microphone is unavailable the status says so and the level stays at zero.
 *
 * Ported from Shy Safari (class-noise-level/src/lib/audio/microphone.svelte.ts);
 * keep the two behaving the same.
 *
 * Status is one of "off", "starting", "on", "denied" (permission refused),
 * "missing" (the chosen device has gone away, or there is no input at all)
 * or "unsupported" (no getUserMedia or no AudioContext in this browser).
 */

const DEVICE_KEY = "focus-friend-microphone";
const CALIBRATION_KEY = "focus-friend-sound-calibration";

/** How quickly the published level follows the room. */
export const SMOOTHING_MS = 1400;
/** Publishing faster than this only makes the bar jitter. */
const PUBLISH_INTERVAL_MS = 100;

const readSaved = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

const writeSaved = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A teacher browsing privately still gets a working meter, just a
    // forgetful one.
  }
};

export const useMicrophone = () => {
  /** The smoothed level, before calibration. */
  const [rawLevel, setRawLevel] = useState(0);
  const [status, setStatus] = useState("off");
  const [devices, setDevices] = useState([]);
  /**
   * The teacher's choice, where "" means "whatever this computer calls the
   * default". The resolved hardware id is deliberately not saved here: doing
   * so would change the setting on every start — silently discarding the
   * calibration attached to it — and pin the app to an exact device that may
   * not exist next week.
   */
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => readSaved(DEVICE_KEY, ""));
  const [activeDeviceId, setActiveDeviceId] = useState("");
  const [calibration, setCalibrationState] = useState(() => readSaved(CALIBRATION_KEY, null));

  const rawLevelRef = useRef(0);
  /**
   * The plain average of the level over the last publish interval, with no
   * smoothing. Calibration samples this: the smoothed level lags a room that
   * has just gone quiet or started talking by seconds, which would bias a
   * five-second sample. Its long-run average is the same as `rawLevel`'s.
   */
  const unsmoothedLevelRef = useRef(0);
  const calibrationRef = useRef(calibration);
  calibrationRef.current = calibration;
  const selectedDeviceIdRef = useRef(selectedDeviceId);
  selectedDeviceIdRef.current = selectedDeviceId;
  const teardownRef = useRef(() => {});
  /**
   * Bumped by every start() and every stop(). A start that is superseded
   * while it is awaiting getUserMedia — the teacher switching device while
   * the permission prompt is open — finds its generation stale and bows out
   * instead of installing itself over the newer one.
   */
  const generationRef = useRef(0);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const available = await navigator.mediaDevices.enumerateDevices();
    setDevices(available.filter((device) => device.kind === "audioinput"));
  }, []);

  const publish = (smoothed, unsmoothed) => {
    rawLevelRef.current = smoothed;
    unsmoothedLevelRef.current = unsmoothed;
    setRawLevel(smoothed);
  };

  const stop = useCallback(() => {
    generationRef.current += 1;
    teardownRef.current();
    teardownRef.current = () => {};
    publish(0, 0);
    setStatus("off");
  }, []);

  const start = useCallback(async (deviceId = selectedDeviceIdRef.current) => {
    const generation = ++generationRef.current;
    teardownRef.current();
    teardownRef.current = () => {};
    setStatus("starting");

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioContextClass) {
      setStatus("unsupported");
      return false;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      });

      // Someone started or stopped us while the prompt was open. Let go of
      // the stream we were granted rather than running on a device the
      // teacher has already switched away from.
      if (generation !== generationRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return false;
      }

      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      context.createMediaStreamSource(stream).connect(analyser);

      setActiveDeviceId(stream.getAudioTracks()[0]?.getSettings().deviceId ?? deviceId);
      // Device labels are blank until permission is granted, so this second
      // pass is what turns "Microphone 2" into the real device name.
      await refreshDevices();
      setStatus("on");

      const samples = new Uint8Array(analyser.fftSize);
      let frame = 0;
      let smoothed = 0;
      let lastTick = performance.now();
      let lastPublished = 0;
      let windowSum = 0;
      let windowFrames = 0;

      const measure = () => {
        analyser.getByteTimeDomainData(samples);
        let sumSquares = 0;
        for (const sample of samples) sumSquares += (sample - 128) ** 2;
        const rms = Math.sqrt(sumSquares / samples.length);
        const measured = Math.min(100, rms * 7);

        const now = performance.now();
        // Cap the step so a backgrounded tab does not resume with one
        // enormous jump that reads as a sudden noise.
        const elapsed = Math.min(250, now - lastTick);
        smoothed += (measured - smoothed) * (1 - Math.exp(-elapsed / SMOOTHING_MS));
        lastTick = now;
        windowSum += measured;
        windowFrames += 1;

        if (now - lastPublished >= PUBLISH_INTERVAL_MS) {
          publish(smoothed, windowSum / windowFrames);
          windowSum = 0;
          windowFrames = 0;
          lastPublished = now;
        }
        frame = requestAnimationFrame(measure);
      };
      measure();

      const activeStream = stream;
      teardownRef.current = () => {
        cancelAnimationFrame(frame);
        activeStream.getTracks().forEach((track) => track.stop());
        void context.close();
      };
      return true;
    } catch (error) {
      // An AudioContext failure after the stream was granted would otherwise
      // leave the browser's recording indicator lit with nothing to turn it
      // off.
      stream?.getTracks().forEach((track) => track.stop());
      if (generation !== generationRef.current) return false;
      setStatus(error?.name === "NotFoundError" || error?.name === "OverconstrainedError" ? "missing" : "denied");
      return false;
    }
  }, [refreshDevices]);

  const selectDevice = useCallback(async (deviceId) => {
    stop();
    if (deviceId !== selectedDeviceIdRef.current) {
      // A calibration belongs to the microphone it was measured on, so
      // switching device throws it away rather than silently misreading.
      selectedDeviceIdRef.current = deviceId;
      setSelectedDeviceId(deviceId);
      setCalibrationState(null);
      writeSaved(DEVICE_KEY, deviceId);
      writeSaved(CALIBRATION_KEY, null);
    }
    return start(deviceId);
  }, [start, stop]);

  const setCalibration = useCallback((next) => {
    setCalibrationState(next);
    writeSaved(CALIBRATION_KEY, next);
  }, []);

  /** The calibrated 0-100 level right now, without waiting for a render. */
  const readLevel = useCallback(
    () => applyCalibration(rawLevelRef.current, calibrationRef.current),
    [],
  );

  /** The latest unsmoothed, uncalibrated reading, for calibration to sample. */
  const readUnsmoothedLevel = useCallback(() => unsmoothedLevelRef.current, []);

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
  }, [refreshDevices]);

  useEffect(() => () => {
    generationRef.current += 1;
    teardownRef.current();
  }, []);

  return {
    /** The 0-100 level the rest of the app reasons about. */
    level: applyCalibration(rawLevel, calibration),
    rawLevel,
    status,
    devices,
    selectedDeviceId,
    activeDeviceId,
    calibration,
    start,
    stop,
    selectDevice,
    setCalibration,
    readLevel,
    readUnsmoothedLevel,
  };
};
