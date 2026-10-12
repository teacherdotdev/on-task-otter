import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

const MAX_ADJUSTMENT = 999;
const adjustmentOf = (value) => Math.min(MAX_ADJUSTMENT, Math.max(1, Math.round(value) || 1));

// Lets the teacher hand out or take back stars by hand, outside of focus
// sessions. Only the class on screen changes, and it never drops below zero.
const StarAdjustmentModal = ({ className, stars, onAdjust, onClose }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const adjust = (change) => {
    onAdjust(change);
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      className="star-adjustment-modal"
      ariaLabelledBy="star-adjustment-title"
      closeLabel={t("adjust.close")}
    >
      <p className="star-adjustment-label">{t("adjust.label")}</p>
      <h2 id="star-adjustment-title">{t("adjust.title")}</h2>
      <p className="star-adjustment-copy">{t("adjust.current", { className, stars })}</p>

      <div className="stars-stepper">
        <button
          type="button"
          aria-label={t("adjust.fewer")}
          disabled={amount <= 1}
          onClick={() => setAmount(adjustmentOf(amount - 1))}
        >
          <Icon name="minus" />
        </button>
        <label>
          <input
            type="number"
            min="1"
            max={MAX_ADJUSTMENT}
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(adjustmentOf(Number(event.target.value)))}
          />
          <span>{t("adjust.unit")}</span>
        </label>
        <button
          type="button"
          aria-label={t("adjust.more")}
          disabled={amount >= MAX_ADJUSTMENT}
          onClick={() => setAmount(adjustmentOf(amount + 1))}
        >
          <Icon name="plus" />
        </button>
      </div>

      <div className="star-adjustment-actions">
        <button className="outline" type="button" disabled={stars <= 0} onClick={() => adjust(-amount)}>
          {t("adjust.remove", { stars: Math.min(amount, stars) })}
        </button>
        <button className="primary" type="button" onClick={() => adjust(amount)}>
          {t("adjust.add", { stars: amount })}
        </button>
      </div>
    </Modal>
  );
};

export default StarAdjustmentModal;
