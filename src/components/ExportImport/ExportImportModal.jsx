import { useEffect, useRef, useState } from "react";
import { createSaveFile, downloadSaveFile, restoreSaveFile, validateSaveFile } from "../../utils/exportImportUtils";
import Modal from "../Modal/Modal";
import { useTranslation } from "../../i18n";

const ExportImportModal = ({ classroomData, validIds, onClose }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const exportSetup = () => {
    downloadSaveFile(createSaveFile(classroomData));
    setMessage(null);
  }

  const importSetup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const save = validateSaveFile(JSON.parse(await file.text()), validIds);
      restoreSaveFile(save);
      window.location.reload();
    } catch {
      setMessage(t("save.invalid"));
    } finally {
      event.target.value = "";
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      className="export-import-modal"
      ariaLabelledBy="export-import-title"
      closeLabel={t("save.close")}
    >
        <p className="export-import-label">{t("save.label")}</p>
        <h2 id="export-import-title">{t("save.title")}</h2>
        <p className="export-import-copy">{t("save.copy")}</p>

        <div className="export-import-included">
          <h3>{t("save.includedTitle")}</h3>
          <ul>
            <li>{t("save.included1")}</li>
            <li>{t("save.included2")}</li>
            <li>{t("save.included3")}</li>
            <li>{t("save.included4")}</li>
          </ul>
        </div>

        <div className="export-import-actions">
          <button className="export-import-primary" type="button" onClick={exportSetup}>{t("save.create")}</button>
          <button className="export-import-secondary" type="button" onClick={() => fileInputRef.current?.click()}>{t("save.restore")}</button>
          <input ref={fileInputRef} className="export-import-file" type="file" accept="application/json,.json" onChange={importSetup} />
        </div>

        {message && <p className="export-import-message error" role="alert">⚠ {message}. {t("save.invalidNote")}</p>}
    </Modal>
  );
}

export default ExportImportModal;
