import { useTranslation } from "../../i18n";
import { MAX_SOUND_THRESHOLD, MIN_SOUND_THRESHOLD } from "../../data/activities";

// The sound half of a session preset: how loud the room may get, starting
// from an activity's limit and fine-tuned with the slider. The preset
// form's heading holds the track-sound checkbox, and the microphone is set up
// once for every preset in its own window. During a session the room shows the
// meter itself in SoundPanel.
const NoiseCard = ({ noise, embedded = false }) => {
  const { t } = useTranslation();
  const { microphone, activity, activities, setActivity, soundThresholds, trackSound, setSoundThreshold } = noise;
  const limit = soundThresholds[activity];

  return (
    <section className={embedded ? "embedded-noise-setup" : "card noise-card"}>
      {trackSound && <>
        <fieldset className="sound-profile-choice">
          <legend>{t("noise.acceptableVolume")}</legend>
          {/* Each activity is a starting point for the slider below. */}
          <div>
            {Object.entries(activities).map(([activityId, { threshold }]) => (
              <button
                className={activity === activityId && limit === threshold ? "selected" : ""}
                type="button"
                key={activityId}
                onClick={() => { setActivity(activityId); setSoundThreshold(activityId, threshold); }}
              >
                <b>{t(`activity.${activityId}.label`)}</b> <span>{threshold}%</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="microphone-setup">
          <div className="sound-thresholds">
            <label>
              <span><b>{t("noise.limitTitle")}</b><small>{limit}%</small></span>
              <input type="range" min={MIN_SOUND_THRESHOLD} max={MAX_SOUND_THRESHOLD} value={limit} onChange={(event) => setSoundThreshold(activity, Number(event.target.value))} />
            </label>
          </div>
        </div>
      </>}

      {microphone.status === "denied" && <p className="help-text">{t("noise.denied")}</p>}
      {microphone.status === "missing" && <p className="help-text">{t("noise.missing")} {t("noise.missingSetup")}</p>}
      {microphone.status === "unsupported" && <p className="help-text">{t("noise.unsupported")}</p>}
    </section>
  );
};

export default NoiseCard;
