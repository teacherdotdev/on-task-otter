import { useEffect, useLayoutEffect, useRef, useState } from "react";
import RoomFixtures from "./RoomFixtures";
import Otter from "../Otter/Otter";
import WardrobeCard, { NOTHING } from "./WardrobeCard";
import { accessorySlots, slotOf } from "../../data/accessories";
import { hasSupport } from "../../data/houseItems";
import { useTranslation } from "../../i18n";

const RoomScene = ({ room, decorations, availableItems = [], accessoryItems = [], unlockedAccessories = [], equipped, isCelebrating, isFocusing, noiseTone, editingMode, stars, isPreviewing, selectedItem, onChooseItem, onConfirmItem, children }) => {
  const { t } = useTranslation();
  // A piece that sits on another one (the duck in the bath) only shows up to
  // buy once the piece under it is in the room.
  const ownedIds = decorations.map((item) => item.id);
  const visibleItems = editingMode === "decorations"
    ? availableItems.filter((item) => ownedIds.includes(item.id) || hasSupport(item, ownedIds))
    : decorations;
  // While dressing up, the chosen clothing spot is { slot }, and the otter
  // tries on whichever of its accessories was picked last.
  const openSlot = editingMode === "accessories" ? selectedItem?.slot : null;
  const [tryingOn, setTryingOn] = useState(null);
  const shownEquipped = openSlot && tryingOn
    ? [...equipped.filter((id) => slotOf(id) !== openSlot), ...(tryingOn === NOTHING ? [] : [tryingOn])]
    : equipped;
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  // Where the chosen price tag sits, as percentages of the room, so the card
  // stays pinned to it when the room is resized.
  const [anchor, setAnchor] = useState(null);
  const [placement, setPlacement] = useState(null);

  const choose = (item, event) => {
    const tag = event.currentTarget.querySelector(".room-item-price, span") ?? event.currentTarget;
    const stage = stageRef.current.getBoundingClientRect();
    const box = tag.getBoundingClientRect();
    setAnchor({
      x: (box.left + box.width / 2 - stage.left) / stage.width * 100,
      top: (box.top - stage.top) / stage.height * 100,
      bottom: (box.bottom - stage.top) / stage.height * 100,
    });
    if (item.slot) {
      setTryingOn(equipped.find((id) => slotOf(id) === item.slot) ?? NOTHING);
    }
    onChooseItem(item);
  };

  // The card points at its object from above, or from below when the object
  // is too near the top, and slides sideways to stay inside the room.
  useLayoutEffect(() => {
    if (!selectedItem || !anchor || !cardRef.current) {
      setPlacement(null);
      return;
    }
    const place = () => {
      const stage = stageRef.current.getBoundingClientRect();
      const card = cardRef.current.getBoundingClientRect();
      const gap = 12;
      const x = anchor.x / 100 * stage.width;
      const top = anchor.top / 100 * stage.height;
      const bottom = anchor.bottom / 100 * stage.height;
      const roomAbove = top - gap;
      const roomBelow = stage.height - bottom - gap;
      const above = roomAbove >= card.height || roomAbove >= roomBelow;
      const half = card.width / 2;
      const center = Math.min(Math.max(x, half + 8), Math.max(half + 8, stage.width - half - 8));
      setPlacement({ above, left: center - half, top: above ? top - gap - card.height : bottom + gap, arrow: x - center });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [selectedItem, anchor, tryingOn]);

  useEffect(() => {
    if (!selectedItem) return;
    const closeOnOutsideClick = (event) => {
      if (!cardRef.current?.contains(event.target)) onChooseItem(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onChooseItem(null);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedItem, onChooseItem]);

  return (
    <div className="room-stage" ref={stageRef}>
      <section
        className={`room-scene room-${room.id} ${editingMode ? "is-editing" : ""}`}
        aria-label={t("scene.roomLabel", { room: t(`room.${room.id}.name`) })}
      >
        <RoomFixtures room={room.id} />
        <div className="room-window" aria-hidden="true">
          {room.id === "bedroom" ? <svg className="window-moon" viewBox="0 0 60 60"><path d="M39 5A25 25 0 1 0 49 48 27 27 0 0 1 39 5Z" fill="#fff1c7" /></svg> : <span className="window-sun" />}
          <span className="window-cloud cloud-one" />
          <span className="window-cloud cloud-two" />
        </div>
        <div className="room-window-sill" aria-hidden="true" />
        <div
          className={`otter-at-home ${editingMode === "accessories" ? "is-dressing" : ""} ${editingMode === "decorations" ? "is-away" : ""}`}
          aria-hidden={editingMode === "decorations" || undefined}
        >
          <Otter
            equipped={shownEquipped}
            showAccessorySlots={editingMode === "accessories"}
            isCelebrating={isCelebrating}
            isFocusing={isFocusing}
            noiseTone={noiseTone}
          />
          {editingMode === "accessories" && (
            <div className="accessory-price-spots" aria-label={t("scene.clothingChoices")}>
              {accessorySlots.map((slot) => (
                <button
                  className={`accessory-price-spot accessory-slot-${slot}`}
                  key={slot}
                  type="button"
                  aria-expanded={openSlot === slot}
                  onClick={(event) => choose({ slot }, event)}
                >
                  <span>{t(`scene.slot.${slot}`)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {visibleItems.length ? (
          <div
            className="placed-decorations"
            aria-label={t("scene.decorations")}
          >
            {visibleItems.map((item) => {
              const pos = item.roomPosition;
              const isAnchorTop = pos.anchor === "top";
              const owned = decorations.some((decoration) => decoration.id === item.id);
              return (
                <button
                  key={item.id}
                  className={`room-item room-item-${item.id} ${owned ? "" : "room-item-placeholder"}`}
                  style={{
                    left: pos.x + "%",
                    [isAnchorTop ? "top" : "bottom"]: pos.y + "%",
                    width: pos.w + "%",
                    zIndex: pos.z,
                  }}
                  aria-label={t(`item.${item.id}`)}
                  type="button"
                  disabled={editingMode !== "decorations" || owned}
                  onClick={(event) => choose(item, event)}
                >
                  <img
                    src={item.roomImage}
                    alt={t(`item.${item.id}`)}
                    style={{ width: "100%", height: "auto" }}
                    draggable={false}
                  />
                  {!owned && (
                    <span className="room-item-price">
                      <b>+</b>
                      <small>★ {item.cost}</small>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : null}

      </section>

      {selectedItem && (
        <aside
          ref={cardRef}
          className={`scene-purchase-card ${openSlot ? "wardrobe-card" : ""} ${placement?.above === false ? "below" : "above"}`}
          style={placement
            ? { left: placement.left, top: placement.top, "--arrow-shift": `${placement.arrow}px` }
            : { visibility: "hidden" }}
          aria-live="polite"
        >
          {openSlot ? (
            <WardrobeCard
              slot={openSlot}
              items={accessoryItems.filter((item) => item.slot === openSlot)}
              unlocked={unlockedAccessories}
              equipped={equipped}
              tryingOn={tryingOn}
              onTryOn={setTryingOn}
              stars={stars}
              onConfirm={onConfirmItem}
            />
          ) : (
            <>
              <img src={selectedItem.image} alt="" />
              <h3>{t(`item.${selectedItem.id}`)}</h3>
              {isPreviewing ? (
                <button className="scene-purchase-button" type="button" onClick={() => onConfirmItem(selectedItem)}>
                  {t("scene.placeInPreview")}
                </button>
              ) : (
                <button
                  className="scene-purchase-button"
                  type="button"
                  disabled={stars < selectedItem.cost}
                  aria-label={stars < selectedItem.cost ? t("scene.notEnough") : t("scene.buyFor", { cost: selectedItem.cost })}
                  title={stars < selectedItem.cost ? t("scene.notEnough") : undefined}
                  onClick={() => onConfirmItem(selectedItem)}
                >
                  ★ {selectedItem.cost}
                </button>
              )}
            </>
          )}
        </aside>
      )}
      {children}
    </div>
  );
};

export default RoomScene;
