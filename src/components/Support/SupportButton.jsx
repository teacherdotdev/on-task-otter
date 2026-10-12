import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import RichText from "../Text/RichText";
import { useTranslation } from "../../i18n";

// A quiet question mark in the corner of every page, so a teacher who hits
// trouble mid-lesson can always find where to write to us.
const SupportButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <button
        className="support-trigger"
        type="button"
        aria-label={t("support.open")}
        onClick={() => setIsOpen(true)}
      >
        ?
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="support-modal"
        ariaLabelledBy="support-title"
        closeLabel={t("support.close")}
      >
        <p className="card-label">{t("support.label")}</p>
        <h2 id="support-title">{t("support.title")}</h2>
        <p className="support-copy">
          <RichText textKey="support.body" links={{ support: "mailto:support@teacher.dev" }} />
        </p>
      </Modal>
    </>
  );
};

export default SupportButton;
