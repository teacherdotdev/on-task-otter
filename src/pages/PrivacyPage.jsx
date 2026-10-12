import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import RichText from "../components/Text/RichText";
import { useTranslation } from "../i18n";

const PrivacyPage = () => {
  const { t } = useTranslation();

  const sections = ["students", "noise", "progress"];

  return (
    <div className="app-shell page-shell">
      <Header rightLink={{ href: "/", label: t("header.backToClassroom") }} />

      <main className="page">
        <h1 className="page-title">{t("privacy.title")}</h1>
        <p className="page-intro">{t("privacy.intro")}</p>

        {sections.map((section) => (
          <section className="card page-section" key={section}>
            <h2>{t(`privacy.${section}.title`)}</h2>
            <p>{t(`privacy.${section}.body`)}</p>
          </section>
        ))}

        <section className="card page-section">
          <h2>{t("privacy.visits.title")}</h2>
          <p>
            <RichText
              textKey="privacy.visits.body"
              links={{ cloudflare: "https://www.cloudflare.com/privacypolicy/" }}
            />
          </p>
        </section>

        <section className="card page-section">
          <h2>{t("privacy.questions.title")}</h2>
          <p>
            <RichText
              textKey="privacy.questions.body"
              links={{ email: "mailto:support@teacher.dev?subject=On-task%20Otter%20privacy" }}
            />
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
