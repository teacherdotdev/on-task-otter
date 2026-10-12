import Link from "../Link/Link";
import OtterMark from "../Otter/OtterMark";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// The About and Privacy pages share this header, so classroom buttons only
// appear when a classroom was handed to it.
const Header = ({ header, rightLink }) => {
  const { t } = useTranslation();
  const { onOpenExportImport, onOpenMicrophone } = header ?? {};
  return (
    <header className="app-header">
      <Link className="brand" href="/">
        <OtterMark />
        {t("app.name")}
      </Link>

      {header && (
        <>
          <div className="app-header-actions">
            <button
              className="export-import-trigger microphone-trigger"
              type="button"
              aria-label={t("mic.title")}
              onClick={onOpenMicrophone}
            >
              <Icon name="mic" />
              <span className="microphone-trigger-word">{t("mic.title")}</span>
            </button>
            <button className="export-import-trigger" type="button" onClick={onOpenExportImport}>{t("header.saveClassroom")}</button>
          </div>
        </>
      )}

      {rightLink && (
        <Link className="header-link" href={rightLink.href}>{rightLink.label}</Link>
      )}
    </header>

  )
}

export default Header;
