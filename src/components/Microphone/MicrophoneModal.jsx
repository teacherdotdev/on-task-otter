import { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import { useTranslation } from "../../i18n";
import { makeCalibration, sampleLevel } from "../../audio/calibration";

/**
 * Calibration is two five-second samples — a silent room, then the class
 * talking normally — turned into the 0-100 scale everything else reasons
 * about. It samples exactly as Shy Safari does.
 */
const SAMPLE_SECONDS = 5;
/** The microphone publishes every 100ms; read at the same pace. */
const READING_MS = 100;

/**
 * The microphone and its calibration belong to this computer, not to a preset
 * or a class, so they are set up here once and used by every session.
 */
const MicrophoneModal = ({ microphone, setCalibrating, onClose }) => {
  const { t } = useTranslation();
  const { readUnsmoothedLevel, setCalibration } = microphone;
  const [calibrationStage, setCalibrationStage] = useState("idle");
  const [secondsLeft, setSecondsLeft] = useState(SAMPLE_SECONDS);
  const [quietSample, setQuietSample] = useState(0);
  const sampling = calibrationStage === "quiet" || calibrationStage === "talking";
  /**
   * Without a running microphone every sample is zero, the two stages come
   * out identical, and the teacher gets told the room was not quiet enough —
   * a confident diagnosis of the wrong thing.
   */
  const microphoneReady = microphone.status === "on";
  const microphoneRef = useRef(microphone);
  microphoneRef.current = microphone;

  // While this window is open the class may be asked to talk on purpose, so
  // the room is not judged. The microphone is switched on to show it working,
  // and off again afterwards if it was off before.
  useEffect(() => {
    const { status, start, stop } = microphoneRef.current;
    const startedHere = status !== "on" && status !== "starting";
    setCalibrating(true);
    if (startedHere) start();
    return () => {
      setCalibrating(false);
      if (startedHere) stop();
    };
  }, [setCalibrating]);

  // This window can open on top of the preset window. Escape is caught on the
  // way down, so it closes only this one.
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [onClose]);

  // The countdown is reset with the stage, so it never shows the last
  // stage's zero.
  const startSampling = (stage) => {
    setSecondsLeft(SAMPLE_SECONDS);
    setCalibrationStage(stage);
  };

  useEffect(() => {
    if (!sampling) return;
    const readings = [];

    // Read on a timer rather than reacting to the level: a silent room can
    // report the same level many times in a row, and skipping those would
    // bias the quiet sample.
    const collect = window.setInterval(() => readings.push(readUnsmoothedLevel()), READING_MS);
    const countdown = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    const finish = window.setTimeout(() => {
      const average = sampleLevel(readings);
      if (calibrationStage === "quiet") {
        setQuietSample(average);
        setCalibrationStage("ready");
        return;
      }
      const result = makeCalibration(quietSample, average);
      if (result) setCalibration(result);
      setCalibrationStage(result ? "done" : "retry");
    }, SAMPLE_SECONDS * 1000);
    return () => {
      window.clearInterval(collect);
      window.clearInterval(countdown);
      window.clearTimeout(finish);
    };
  }, [calibrationStage, quietSample, readUnsmoothedLevel, sampling, setCalibration]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      className="export-import-modal microphone-modal"
      ariaLabelledBy="microphone-title"
      closeLabel={t("mic.close")}
    >
      <h2 id="microphone-title">{t("mic.title")}</h2>
      <p className="export-import-copy">{t("mic.intro")}</p>

      <section className="microphone-section">
        <label htmlFor="microphone-choice">{t("noise.microphone")}</label>
        <div className="microphone-choice-row">
          <select
            id="microphone-choice"
            value={microphone.selectedDeviceId}
            disabled={sampling}
            onChange={(event) => {
              setCalibrationStage("idle");
              microphone.selectDevice(event.target.value);
            }}
          >
            <option value="">{t("noise.defaultMicrophone")}</option>
            {microphone.devices.filter((device) => device.deviceId).map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || t("noise.microphoneNumber", { number: index + 1 })}
              </option>
            ))}
          </select>
          {microphone.status !== "on" && (
            <button className="outline" type="button" disabled={microphone.status === "starting"} onClick={() => microphone.start()}>
              {microphone.status === "starting" ? t("noise.connecting") : t("noise.connect")}
            </button>
          )}
        </div>

        <div className="calibration-level">
          <div className="meter" role="meter" aria-label={t("calibration.hears")} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(microphone.rawLevel)}>
            <span className="neutral" style={{ width: `${Math.min(100, microphone.rawLevel)}%` }} />
          </div>
          <small>{t("calibration.hears")}</small>
        </div>

        {["denied", "missing", "unsupported"].includes(microphone.status) && (
          <p className="microphone-problem" role="alert">
            {microphone.status === "unsupported" ? t("noise.unsupported") : t("noise.unavailable")}
          </p>
        )}
      </section>

      <section className="microphone-section calibration-panel" aria-live="polite">
        <h3>
          {t("calibration.title")}
          <span className={`calibration-status ${microphone.calibration ? "calibrated" : ""}`}>
            {microphone.calibration ? t("mic.calibrated") : t("mic.notCalibrated")}
          </span>
        </h3>
        {calibrationStage === "idle" && <><p>{t("calibration.introBody")}</p><button className="outline" type="button" disabled={!microphoneReady} onClick={() => startSampling("quiet")}>{microphone.calibration ? t("calibration.again") : t("calibration.start")}</button></>}
        {calibrationStage === "quiet" && <p><b>{t("calibration.step1")}</b> {t("calibration.step1Body", { seconds: secondsLeft })}</p>}
        {calibrationStage === "ready" && <><p><b>{t("calibration.step2")}</b> {t("calibration.step2Body")}</p><button className="primary" type="button" disabled={!microphoneReady} onClick={() => startSampling("talking")}>{t("calibration.measure")}</button></>}
        {calibrationStage === "talking" && <p><b>{t("calibration.listening")}</b> {t("calibration.listeningBody", { seconds: secondsLeft })}</p>}
        {/* Calibration changes the scale, never the limits: a limit of 30 means
            the same thing on every calibrated computer. */}
        {calibrationStage === "done" && <p><b>{t("calibration.doneTitle")}</b> {t("calibration.doneBody")}</p>}
        {calibrationStage === "retry" && <><p><b>{t("calibration.retryTitle")}</b> {t("calibration.retryBody")}</p><button className="outline" type="button" onClick={() => setCalibrationStage("idle")}>{t("calibration.restart")}</button></>}
      </section>
    </Modal>
  );
};

export default MicrophoneModal;
