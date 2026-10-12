import { useState } from "react";
import NoiseScale from "./NoiseScale";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// During a session the sound meter sits in a corner of the otter's room. A
// teacher can fold it away to a single button so the class watches only the otter.
const SoundPanel = ({ noise }) => {
  const { t } = useTranslation();
  const { noiseMessage, noiseTone, expectation, microphone } = noise;
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
          aria-label={t("noise.hideBar")}
          title={t("noise.hideBar")}
          onClick={() => setShowSoundBar(false)}
        >
          <Icon name="eyeOff" />
        </button>
      </header>

      <NoiseScale microphone={microphone} noiseTone={noiseTone} goal={expectation.threshold} />

      {microphone.status === "denied" && <p className="help-text">{t("noise.denied")}</p>}
      {microphone.status === "missing" && <p className="help-text">{t("noise.missing")} {t("noise.missingSetup")}</p>}
      {microphone.status === "unsupported" && <p className="help-text">{t("noise.unsupported")}</p>}
    </section>
  );
};

export default SoundPanel;
