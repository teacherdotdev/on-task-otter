import { useState } from "react";
import NoiseScale from "./NoiseScale";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// During a session the sound meter sits in a corner of the otter's room. A
// teacher can fold it away to a single button so the class watches only the otter.
const SoundPanel = ({ noise }) => {
  const { t } = useTranslation();
  const { noiseMessage, noiseTone, expectation, microphone, activity, openMicrophoneSetup } = noise;
  const [showSoundBar, setShowSoundBar] = useState(true);

  if (!showSoundBar) {
    return (
      <div className="scene-sound scene-sound-folded">
        <button
          className="scene-icon-button"
          type="button"
          aria-label={t("noise.showBar")}
          data-tooltip={t("noise.showBar")}
          onClick={() => setShowSoundBar(true)}
        >
          <Icon name="mic" />
        </button>
      </div>
    );
  }

  return (
    <section className="scene-sound" aria-label={t("noise.classroomSound")}>
      <header className="scene-sound-heading">
        <i className={`status-dot ${noiseTone}`} aria-hidden="true" />
        <b>{noiseMessage}</b>
        <button
          className="scene-sound-button"
          type="button"
          aria-label={t("noise.selectMicrophone")}
          title={t("noise.selectMicrophone")}
          onClick={openMicrophoneSetup}
        >
          <Icon name="mic" />
        </button>
        <button
          className="scene-sound-button"
          type="button"
          aria-label={t("noise.hideBar")}
          title={t("noise.hideBar")}
          onClick={() => setShowSoundBar(false)}
        >
          <Icon name="eyeOff" />
        </button>
      </header>

      <p className="scene-sound-goal">
        {t("noise.goal", { activity: t(`activity.${activity}.label`).toLowerCase() })}
        {" "}<b>{t(`activity.${activity}.detail`)}</b>
      </p>
      <NoiseScale microphone={microphone} noiseTone={noiseTone} goal={expectation.threshold} />

      {microphone.status === "denied" && <p className="help-text">{t("noise.denied")}</p>}
      {microphone.status === "missing" && <p className="help-text">{t("noise.missing")} {t("noise.missingFocus")}</p>}
      {microphone.status === "unsupported" && <p className="help-text">{t("noise.unsupported")}</p>}
    </section>
  );
};

export default SoundPanel;
