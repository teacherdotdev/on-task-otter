import teacherDevLogo from "../../assets/teacher-dev-logo.svg";
import Link from "../Link/Link";
import { useTranslation } from "../../i18n";

const Footer = () => {
  const { t } = useTranslation();

  return (
  <footer className="site-footer">
    <a
      className="teacher-dev-credit"
      href="https://teacher.dev"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={teacherDevLogo} alt="" />
      {t("footer.builtBy")}
    </a>
    <Link href="/about">{t("footer.about")}</Link>
    <Link href="/privacy">{t("footer.privacy")}</Link>
  </footer>
  );
};

export default Footer;
