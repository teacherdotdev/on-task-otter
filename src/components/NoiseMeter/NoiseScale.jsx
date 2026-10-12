import { useTranslation } from "../../i18n";

/** The room's level right now, against the line of the sound limit. */
const NoiseScale = ({ microphone, noiseTone, goal }) => {
  const { t } = useTranslation();
  const level = Math.max(0, Math.min(100, microphone.level));

  return (
    <section>
      <div
        className="meter"
        style={{ background: `linear-gradient(90deg, #cce2d3 0 ${goal}%, #efc0b0 ${goal}% 100%)` }}
        role="meter"
        aria-label={t("noise.scale.label")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(level)}
      >
        <span className={noiseTone} style={{ width: `${level}%` }} />
        <i className="meter-goal" style={{ left: `${goal}%` }} aria-hidden="true" />
      </div>
    </section>
  );
};

export default NoiseScale;
