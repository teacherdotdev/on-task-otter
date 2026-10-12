import { useEffect } from "react";
import { createSaveFile, downloadSaveFile } from "../../utils/exportImportUtils";
import Modal from "../Modal/Modal";
import { useTranslation } from "../../i18n";

const ClearDataModal = ({ classroomData, onClose, onConfirm }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const saveBeforeErasing = () => {
    downloadSaveFile(createSaveFile(classroomData));
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      className="clear-data-modal"
      ariaLabelledBy="clear-data-title"
      closeLabel={t("clear.close")}
    >
        <p className="clear-data-label">{t("clear.label")}</p>
        <h2 id="clear-data-title">{t("clear.title")}</h2>
        <p className="clear-data-copy">{t("clear.copy")}</p>

        <button className="clear-data-save" type="button" onClick={saveBeforeErasing}>
          {t("clear.saveFirst")}
        </button>

        <div className="clear-data-actions">
          <button className="clear-data-cancel" type="button" onClick={onClose}>{t("clear.cancel")}</button>
          <button className="clear-data-confirm" type="button" onClick={onConfirm}>{t("clear.confirm")}</button>
        </div>
    </Modal>
  );
};

export default ClearDataModal;
