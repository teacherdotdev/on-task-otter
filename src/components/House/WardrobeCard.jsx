import { AccessoryIcon } from "../Otter/AccessoryArt";
import { useTranslation } from "../../i18n";

// The tile for wearing nothing in this spot.
export const NOTHING = "nothing";

// The pop-up for one clothing spot on the otter: every hat (or every pair of
// glasses) as a picture, after a "No hat" (or "No glasses") tile. Choosing one
// tries it on the otter straight away; the button underneath buys it, puts it
// on, or takes it off.
const WardrobeCard = ({ slot, items, unlocked, equipped, tryingOn, onTryOn, stars, onConfirm }) => {
  const { t } = useTranslation();
  const worn = items.find((item) => equipped.includes(item.id));
  const wantsNothing = tryingOn === NOTHING;
  const chosen = wantsNothing ? null : items.find((item) => item.id === tryingOn) ?? items[0];
  const owned = wantsNothing || unlocked.includes(chosen.id);
  const wearing = wantsNothing ? !worn : equipped.includes(chosen.id);
  // In preview mode every accessory counts as owned, so it is free to wear.
  const canAfford = owned || stars >= chosen.cost;

  const tag = (item) =>
    equipped.includes(item.id) ? t("scene.wearing")
      : unlocked.includes(item.id) ? t("scene.ownedShort")
        : `★ ${item.cost}`;

  // A purchase shows just its price; the full wording is for screen readers.
  const buttonLabel = wantsNothing ? (wearing ? t("scene.wearing") : t("scene.takeOff"))
    : wearing ? t("scene.takeOff")
    : owned ? t("scene.wearIt")
      : `★ ${chosen.cost}`;
  const buttonDescription = owned ? undefined
    : canAfford ? t("scene.buyFor", { cost: chosen.cost })
      : t("scene.notEnough");

  return (
    <>
      <h3>{t(`scene.slot.${slot}`)}</h3>
      <div className="wardrobe-choices" role="group" aria-label={t(`scene.slot.${slot}`)}>
        <button
          type="button"
          className={`wardrobe-choice wardrobe-nothing ${worn ? "" : "is-worn"}`}
          aria-pressed={wantsNothing}
          aria-label={worn ? t(`scene.none.${slot}`) : t("scene.accessoryLabel", { name: t(`scene.none.${slot}`), state: t("scene.wearing") })}
          onClick={() => onTryOn(NOTHING)}
        >
          <svg className="accessory-icon" viewBox="0 0 44 34" aria-hidden="true">
            <circle cx="22" cy="17" r="12" />
            <path d="M13.5 25.5 30.5 8.5" />
          </svg>
          <small>{worn ? t("scene.none.short") : t("scene.wearing")}</small>
        </button>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`wardrobe-choice ${equipped.includes(item.id) ? "is-worn" : ""}`}
            aria-pressed={item.id === chosen?.id}
            aria-label={t("scene.accessoryLabel", { name: t(`accessory.${item.id}`), state: tag(item) })}
            onClick={() => onTryOn(item.id)}
          >
            <AccessoryIcon id={item.id} />
            <small>{tag(item)}</small>
          </button>
        ))}
      </div>
      <p className="wardrobe-chosen">
        <b>{wantsNothing ? t(`scene.none.${slot}`) : t(`accessory.${chosen.id}`)}</b>
      </p>
      <button
        className="scene-purchase-button"
        type="button"
        disabled={!canAfford || (wantsNothing && wearing)}
        aria-label={buttonDescription}
        title={canAfford ? undefined : t("scene.notEnough")}
        onClick={() => onConfirm(wantsNothing ? worn : chosen)}
      >
        {buttonLabel}
      </button>
    </>
  );
};

export default WardrobeCard;
