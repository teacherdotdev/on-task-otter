import ModalBackdrop from "./ModalBackdrop";
import ModalBox from "./ModalBox"
import { useTranslation } from "../../i18n";

const Modal = ({
  isOpen,
  onClose,
  className = "",
  ariaLabelledBy,
  closeLabel,
  showCloseButton = true,
  children,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalBox
        className={className}
        onClose={onClose}
        ariaLabelledBy={ariaLabelledBy}
        closeLabel={closeLabel ?? t("modal.close")}
        showCloseButton={showCloseButton}
      >
        {children}
      </ModalBox>
    </ModalBackdrop>
  );
};

export default Modal;
