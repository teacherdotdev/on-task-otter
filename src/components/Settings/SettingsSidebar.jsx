import { useEffect } from "react";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";
import { MAX_STARS_PER_MINUTE, MIN_STARS_PER_MINUTE, starsPerMinuteOf } from "../../data/stars";

// The teacher's settings slide in from the right edge, behind the gear in the
// page's bottom-right corner: preview mode, how many stars a minute of focus is
// worth, and the classroom save file.
const SettingsSidebar = ({ settings, onClose }) => {
  const { t } = useTranslation();
  const { isPreviewing, startPreview, stopPreview, starsPerMinute, setStarsPerMinute, sessionMinutes, openSaveFile, openStarAdjustment } = settings;

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  // Preview is something to look at, so the sidebar gets out of the way.
  const togglePreview = () => {
    if (isPreviewing) return stopPreview();
    startPreview();
    onClose();
  };

  const adjustStars = () => {
    onClose();
    openStarAdjustment();
  };

  const saveClassroom = () => {
    onClose();
    openSaveFile();
  };

  return (
    <div
      className="settings-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className="settings-sidebar" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-heading">
          <div>
            <p className="card-label">{t("settings.label")}</p>
            <h2 id="settings-title">{t("settings.title")}</h2>
          </div>
          <button className="settings-close" type="button" aria-label={t("settings.close")} autoFocus onClick={onClose}>
            &times;
          </button>
        </header>

        <section className="settings-section">
          <h3><Icon name="eye" /> {t("settings.preview.title")}</h3>
          <p>{t("settings.preview.body")}</p>
          <button className={isPreviewing ? "outline" : "primary"} type="button" onClick={togglePreview}>
            {isPreviewing ? t("app.preview.exit") : t("app.preview.start")}
          </button>
        </section>

        <section className="settings-section">
          <h3><span aria-hidden="true">★</span> {t("settings.stars.title")}</h3>
          <p>{t("settings.stars.body")}</p>
          <div className="stars-stepper">
            <button
              type="button"
              aria-label={t("settings.stars.fewer")}
              disabled={starsPerMinute <= MIN_STARS_PER_MINUTE}
              onClick={() => setStarsPerMinute(starsPerMinute - 1)}
            >
              <Icon name="minus" />
            </button>
            <label>
              <input
                type="number"
                min={MIN_STARS_PER_MINUTE}
                max={MAX_STARS_PER_MINUTE}
                step="1"
                inputMode="numeric"
                value={starsPerMinute}
                onChange={(event) => setStarsPerMinute(starsPerMinuteOf(Number(event.target.value) || MIN_STARS_PER_MINUTE))}
              />
              <span>{t("settings.stars.unit")}</span>
            </label>
            <button
              type="button"
              aria-label={t("settings.stars.more")}
              disabled={starsPerMinute >= MAX_STARS_PER_MINUTE}
              onClick={() => setStarsPerMinute(starsPerMinute + 1)}
            >
              <Icon name="plus" />
            </button>
          </div>
          <p className="settings-example">
            {t("settings.stars.example", { minutes: sessionMinutes, stars: sessionMinutes * starsPerMinute })}
          </p>
          <button className="outline settings-small-button" type="button" onClick={adjustStars}>
            {t("settings.stars.adjust")}
          </button>
        </section>

        <section className="settings-section">
          <h3><Icon name="bookmark" /> {t("settings.save.title")}</h3>
          <p>{t("settings.save.body")}</p>
          <button className="outline" type="button" onClick={saveClassroom}>
            {t("header.saveClassroom")}
          </button>
        </section>
      </aside>
    </div>
  );
};

export default SettingsSidebar;
