import { useEffect } from "react";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// The teacher's settings slide in from the right edge, behind the gear in the
// page's bottom-right corner: preview mode and the classroom save file.
const SettingsSidebar = ({ settings, onClose }) => {
  const { t } = useTranslation();
  const { isPreviewing, startPreview, stopPreview, openSaveFile } = settings;

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
