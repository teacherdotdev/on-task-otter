import edtechathonLogo from "../../assets/edtechathon-logo.svg";
import Link from "../Link/Link";
import { useTranslation } from "../../i18n";

const Footer = () => {
  const { t } = useTranslation();

  return (
  <footer className="site-footer">
    <a
      className="edtechathon-credit"
      href="https://edtechathon.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={edtechathonLogo} alt="" />
      {t("footer.builtBy")}
    </a>
    <Link href="/about">{t("footer.about")}</Link>
    <Link href="/privacy">{t("footer.privacy")}</Link>
  </footer>
  );
};

export default Footer;
