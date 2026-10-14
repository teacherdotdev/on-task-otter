import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// Stands in the tab where the otter's room was while the room floats on top
// of the teacher's other windows.
const FloatingPlaceholder = ({ onReturn }) => {
  const { t } = useTranslation();

  return (
    <section className="floating-placeholder" aria-labelledby="floating-title">
      <Icon name="pictureInPicture" />
      <h2 id="floating-title">{t("app.float.title")}</h2>
      <p>{t("app.float.body")}</p>
      <button className="primary" type="button" onClick={onReturn}>
        {t("app.float.return")}
      </button>
    </section>
  );
};

export default FloatingPlaceholder;
