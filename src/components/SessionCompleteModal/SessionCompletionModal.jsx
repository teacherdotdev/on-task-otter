import Otter from "../Otter/Otter";
import Modal from "../Modal/Modal";
import RichText from "../Text/RichText";
import { useTranslation } from "../../i18n";

const CompletionModal = ({ equipped, showComplete, duration, isTimerAlertPlaying, onClose, onSilenceAlert }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={showComplete}
      onClose={onClose}
      className="completion-modal"
      ariaLabelledBy="complete-title"
      showCloseButton={false}
    >
        <div className="completion-otter">
          <Otter
            equipped={equipped}
            isCelebrating
            isFocusing={false}
            noiseTone="neutral"
          />
        </div>

        <p className="eyebrow">
          {t("complete.eyebrow")}
        </p>

        <h2 id="complete-title">
          {t("complete.title")}
        </h2>

        <p>
          <RichText textKey="complete.body" values={{ duration }} />
        </p>

        <div className="completion-actions">
          {isTimerAlertPlaying && (
            <button className="outline" type="button" autoFocus onClick={onSilenceAlert}>
              {t("complete.silence")}
            </button>
          )}
          <button className="primary" type="button" autoFocus={!isTimerAlertPlaying} onClick={onClose}>
            {t("complete.done")}
          </button>
        </div>
    </Modal>
  );
};

export default CompletionModal;
