import teacherDevLogo from "../assets/teacher-dev-logo.svg";
import participants from "../assets/edtechathon-2026-participants.jpg";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import RichText from "../components/Text/RichText";
import { useTranslation } from "../i18n";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="app-shell page-shell">
      <Header rightLink={{ href: "/", label: t("header.backToClassroom") }} />

      <main className="page">
        <h1 className="page-title">{t("about.title")}</h1>
        <p className="page-intro">{t("about.intro")}</p>

        <section className="card page-section">
          <div className="page-section-heading">
            <img className="teacher-dev-logo" src={teacherDevLogo} alt="" />
            <h2>{t("about.community.title")}</h2>
          </div>
          <p>
            <RichText
              textKey="about.community.body"
              links={{ teacherdev: "https://teacher.dev" }}
            />
          </p>

          <figure className="participants-photo">
            <img src={participants} alt={t("about.community.photo")} />
            <figcaption className="handwriting">{t("about.community.caption")}</figcaption>
          </figure>
        </section>

        <section className="card page-section">
          <h2>{t("about.promise.title")}</h2>
          <ul className="promise-list">
            <li><b>{t("about.promise.paywalls")}</b></li>
            <li><b>{t("about.promise.ads")}</b></li>
            <li><b>{t("about.promise.tracking")}</b></li>
          </ul>
        </section>

        <section className="card page-section">
          <h2>{t("about.feedback.title")}</h2>
          <p>{t("about.feedback.body")}</p>
          <a
            className="primary page-button"
            href="mailto:support@teacher.dev?subject=On-task%20Otter%20feedback"
          >
            {t("about.feedback.button")}
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
