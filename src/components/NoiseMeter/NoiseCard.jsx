import { useState } from "react";
import NoiseScale from "./NoiseScale";
import { useTranslation } from "../../i18n";
import { MAX_SOUND_THRESHOLD, MIN_SOUND_THRESHOLD } from "../../data/activities";

const NoiseCard = ({ noise, focusMode = false, embedded = false }) => {
  const { t } = useTranslation();
  const { noiseMessage, noiseTone, expectation, microphone, activity, activities, setActivity, soundThresholds, trackSound, setTrackSound, setSoundThreshold } = noise;
  const [showSoundBar, setShowSoundBar] = useState(true);
  const [showMicrophoneControls, setShowMicrophoneControls] = useState(false);
  const previewThreshold = expectation.threshold;
  const previewLabel = t(`activity.${activity}.label`);

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
