import { useEffect, useRef, useState } from "react";
import NoiseScale from "./NoiseScale";
import { useTranslation } from "../../i18n";
import { makeCalibration, sampleLevel } from "../../audio/calibration";
import { MAX_SOUND_THRESHOLD, MIN_SOUND_THRESHOLD } from "../../data/activities";

/**
 * Calibration is two five-second samples — a silent room, then the class
 * talking normally — turned into the 0-100 scale everything else reasons
 * about. It samples exactly as Shy Safari does.
 */
const SAMPLE_SECONDS = 5;
/** The microphone publishes every 100ms; read at the same pace. */
const READING_MS = 100;

const NoiseCard = ({ noise, focusMode = false, embedded = false }) => {
  const { t } = useTranslation();
  const { noiseMessage, noiseTone, expectation, microphone, activity, activities, setActivity, soundThresholds, trackSound, setTrackSound, setSoundThreshold, setCalibrating } = noise;
  const { readUnsmoothedLevel, setCalibration } = microphone;
  const dialogRef = useRef(null);
  const [calibrationStage, setCalibrationStage] = useState("idle");
  const [secondsLeft, setSecondsLeft] = useState(SAMPLE_SECONDS);
  const [quietSample, setQuietSample] = useState(0);
  const [showSoundBar, setShowSoundBar] = useState(true);
  const [showMicrophoneControls, setShowMicrophoneControls] = useState(false);
  const isCalibrationOpen = useRef(false);
  /** Whether opening calibration turned the microphone on, so closing it should turn it off. */
  const startedMicrophone = useRef(false);
  const previewThreshold = expectation.threshold;
  const previewLabel = t(`activity.${activity}.label`);
  const sampling = calibrationStage === "quiet" || calibrationStage === "talking";
  /**
   * Without a running microphone every sample is zero, the two stages come
   * out identical, and the teacher gets told the room was not quiet enough —
   * a confident diagnosis of the wrong thing.
   */
  const microphoneReady = microphone.status === "on";

  useEffect(() => {
    if (!sampling) return;
    const readings = [];
    setSecondsLeft(SAMPLE_SECONDS);

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

  // Removing an open <dialog> does not fire `close`, so say so here, or the
  // room would stay unjudged.
  useEffect(() => () => {
    if (isCalibrationOpen.current) setCalibrating?.(false);
  }, [setCalibrating]);

  const openCalibration = async () => {
    dialogRef.current.showModal();
    isCalibrationOpen.current = true;
    setCalibrating(true);
    if (microphone.status !== "on" && microphone.status !== "starting") {
      startedMicrophone.current = true;
      await microphone.start();
    }
  };

  const closedCalibration = () => {
    setCalibrationStage("idle");
    isCalibrationOpen.current = false;
    setCalibrating(false);
    if (startedMicrophone.current) {
      startedMicrophone.current = false;
      microphone.stop();
    }
  };

  return (
    <section className={`${embedded ? "embedded-noise-setup" : "card noise-card"} ${focusMode && !showSoundBar ? "sound-bar-hidden" : ""}`}>
      {focusMode && showSoundBar && <div className="card-heading">
        <div><p className="card-label">{focusMode ? t("noise.classroomSound") : t("noise.setupLabel")}</p><h2>{focusMode ? noiseMessage : t("noise.setupTitle")}</h2></div>
        <i className={`status-dot ${noiseTone}`} aria-hidden="true" />
      </div>}
      {!focusMode && <label className="checkbox-option sound-tracking-option">
        <input type="checkbox" checked={trackSound} onChange={(event) => setTrackSound(event.target.checked)} />
        {t("noise.track")}
      </label>}
      {!focusMode && trackSound && <fieldset className="sound-profile-choice">
        <legend>{t("noise.acceptableVolume")}</legend>
        <div>
          {Object.keys(activities).map((activityId) => (
            <button className={activity === activityId ? "selected" : ""} type="button" key={activityId} onClick={() => setActivity(activityId)}>
              <b>{t(`activity.${activityId}.label`)}</b>
            </button>
          ))}
        </div>
      </fieldset>}
      {(focusMode || trackSound) && <>
      {focusMode && showSoundBar && <><p className="noise-expectation">
        {t("noise.goal", { activity: previewLabel.toLowerCase() })}
        {' '}<b>{t(`activity.${activity}.detail`)}</b>
      </p>
      <NoiseScale
        microphone={microphone}
        noiseTone={noiseTone}
        goal={previewThreshold}
      /></>}

      <div className="noise-actions">
        {focusMode && <label className="checkbox-option">
          <input type="checkbox" checked={showSoundBar} onChange={(event) => setShowSoundBar(event.target.checked)} />
          {t("noise.showBar")}
        </label>}
        {focusMode && <button className="outline microphone-toggle" type="button" aria-expanded={showMicrophoneControls} aria-controls="focus-microphone-controls" onClick={() => setShowMicrophoneControls((visible) => !visible)}>{t("noise.selectMicrophone")}</button>}
        {!focusMode && <button className="outline" type="button" onClick={openCalibration}>{t("noise.openCalibration")}</button>}

      </div>

      {focusMode && <div className="microphone-setup" id="focus-microphone-controls" hidden={!showMicrophoneControls}>
        <label htmlFor="focus-microphone-choice">{t("noise.microphone")}</label>
        <select id="focus-microphone-choice" value={microphone.selectedDeviceId} onChange={(event) => microphone.selectDevice(event.target.value)}>
          <option value="">{t("noise.defaultMicrophone")}</option>
          {microphone.devices.filter((device) => device.deviceId).map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || t("noise.microphoneNumber", { number: index + 1 })}</option>)}
        </select>
        <button className="outline" type="button" disabled={microphone.status === "starting"} onClick={() => microphone.start()}>
          {microphone.status === "starting" ? t("noise.connecting") : microphone.status === "on" ? t("noise.reconnect") : t("noise.connect")}
        </button>
      </div>}

      {!focusMode && (
        <div className="microphone-setup">
          <dialog className="sound-calibration-dialog" aria-labelledby="calibration-title" ref={dialogRef} onClose={closedCalibration}>
            <h2 id="calibration-title">{calibrationStage === "done" ? t("calibration.recommendedTitle") : t("calibration.title")}</h2>
            {calibrationStage !== "done" && <>
            <p className="help-text">{t("calibration.help")}</p>
            <label htmlFor="microphone-choice">{t("noise.microphone")}</label>
            <select id="microphone-choice" value={microphone.selectedDeviceId} onChange={(event) => { setCalibrationStage("idle"); microphone.selectDevice(event.target.value); }}>
              <option value="">{t("noise.defaultMicrophone")}</option>
              {microphone.devices.filter((device) => device.deviceId).map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || t("noise.microphoneNumber", { number: index + 1 })}</option>)}
            </select></>}

          <div className="calibration-panel" aria-live="polite">
            {calibrationStage === "idle" && <><p><b>{t("calibration.introTitle")}</b> {t("calibration.introBody")}</p><button className="outline" type="button" disabled={!microphoneReady} onClick={() => setCalibrationStage("quiet")}>{microphone.calibration ? t("calibration.again") : t("calibration.start")}</button></>}
            {calibrationStage === "quiet" && <p><b>{t("calibration.step1")}</b> {t("calibration.step1Body", { seconds: secondsLeft })}</p>}
            {calibrationStage === "ready" && <><p><b>{t("calibration.step2")}</b> {t("calibration.step2Body")}</p><button className="primary" type="button" disabled={!microphoneReady} onClick={() => setCalibrationStage("talking")}>{t("calibration.measure")}</button></>}
            {calibrationStage === "talking" && <p><b>{t("calibration.listening")}</b> {t("calibration.listeningBody", { seconds: secondsLeft })}</p>}
            {calibrationStage === "done" && <>
              <p>{t("calibration.doneBody")}</p>
              <dl className="calibration-recommendations">
                <div><dt>{t("calibration.individual")}</dt><dd>{activities.independent.threshold}%</dd></div>
                <div><dt>{t("calibration.group")}</dt><dd>{activities.partner.threshold}%</dd></div>
              </dl>
              <p>{t("calibration.doneNote")}</p>
            </>}
            {sampling && <div className="calibration-level">
              <div className="meter" role="meter" aria-label={t("calibration.hears")} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(microphone.rawLevel)}>
                <span className="neutral" style={{ width: `${Math.min(100, microphone.rawLevel)}%` }} />
              </div>
              <small>{t("calibration.hears")}</small>
            </div>}
            {calibrationStage === "retry" && <><p><b>{t("calibration.retryTitle")}</b> {t("calibration.retryBody")}</p><button className="outline" type="button" onClick={() => setCalibrationStage("idle")}>{t("calibration.restart")}</button></>}
          </div>

            <div className="calibration-footer"><button className="outline" type="button" onClick={() => dialogRef.current.close()}>{calibrationStage === "done" ? t("calibration.done") : t("calibration.close")}</button></div>
            {["denied", "missing", "unsupported"].includes(microphone.status) && <p role="alert">{t("noise.unavailable")}</p>}
          </dialog>
          <div className="sound-thresholds">
            <label>
              <span><b>{t("noise.limitTitle")}</b><small>{t("noise.limitDetail", { percent: soundThresholds[activity] })}</small></span>
              <input type="range" min={MIN_SOUND_THRESHOLD} max={MAX_SOUND_THRESHOLD} value={soundThresholds[activity]} onChange={(event) => setSoundThreshold(activity, Number(event.target.value))} />
            </label>

          </div>
        </div>
      )}
      </>}

      {microphone.status === "denied" && <p className="help-text">{t("noise.denied")}</p>}
      {microphone.status === "missing" && <p className="help-text">{t("noise.missing")} {focusMode ? t("noise.missingFocus") : t("noise.missingSetup")}</p>}
      {microphone.status === "unsupported" && <p className="help-text">{t("noise.unsupported")}</p>}
    </section>
  );
};

export default NoiseCard;
