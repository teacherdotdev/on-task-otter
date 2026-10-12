import RoomFixtures from "./RoomFixtures";
import Otter from "../Otter/Otter";
import { useTranslation } from "../../i18n";

const RoomScene = ({ room, decorations, availableItems = [], accessoryItems = [], unlockedAccessories = [], equipped, isCelebrating, isFocusing, noiseTone, otterName, focusMode = false, editingMode, stars, isPreviewing, selectedItem, onChooseItem, onConfirmItem, onCloseEditor }) => {
  const { t } = useTranslation();
  const visibleItems = editingMode === "decorations" ? availableItems : decorations;
  const selectedIsOwned = selectedItem && (
    editingMode === "decorations"
      ? decorations.some((item) => item.id === selectedItem.id)
      : unlockedAccessories.includes(selectedItem.id)
  );
  const selectedX = selectedItem?.roomPosition?.x ?? 40;
  
  return (
    <>
      {editingMode && (
        <div className="scene-shop-toolbar">
          <b>{editingMode === "decorations" ? t("scene.chooseItem") : t("scene.chooseClothing")}</b>
          <span>{isPreviewing ? t("scene.preview") : t("scene.stars", { stars })}</span>
          <button type="button" onClick={onCloseEditor}>{t("scene.done")}</button>
        </div>
      )}
    <section
      className={`room-scene room-${room.id}`}
      aria-label={t("scene.roomLabel", { room: t(`room.${room.id}.name`) })}
    >
      {!focusMode && <div className="room-scene-label">
        <span>
          {room.icon}
        </span>

        <div>
          <b>{t(`room.${room.id}.name`)}</b>
          <small>{t(`room.${room.id}.description`)}</small>
        </div>
      </div>}

      <RoomFixtures room={room.id} />
      <div className="room-window" aria-hidden="true">
        {room.id === "bedroom" ? <svg className="window-moon" viewBox="0 0 60 60"><path d="M39 5A25 25 0 1 0 49 48 27 27 0 0 1 39 5Z" fill="#fff1c7" /></svg> : <span className="window-sun" />}
        <span className="window-cloud cloud-one" />
        <span className="window-cloud cloud-two" />
      </div>
      <div className="room-window-sill" aria-hidden="true" />
      <div className="otter-at-home">
        <Otter
          equipped={equipped}
          showAccessorySlots={editingMode === "accessories"}
          isCelebrating={isCelebrating}
          isFocusing={isFocusing}
          noiseTone={noiseTone}
        />
        {editingMode === "accessories" && (
          <div className="accessory-price-spots" aria-label={t("scene.clothingChoices")}>
            {accessoryItems.filter((item) => !equipped.includes(item.id)).map((item) => (
              <button
                className={`accessory-price-spot accessory-${item.id}`}
                key={item.id}
                type="button"
                aria-label={t("scene.accessoryLabel", {
                  name: t(`accessory.${item.id}`),
                  state: unlockedAccessories.includes(item.id) ? t("scene.owned") : t("scene.costStars", { cost: item.cost }),
                })}
                onClick={() => onChooseItem(item)}
              >
                <span>{unlockedAccessories.includes(item.id) ? t("scene.ownedShort") : `★ ${item.cost}`}</span>
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
                onClick={() => onChooseItem(item)}
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
      ) : !focusMode ? (
        <p className="empty-room">
          {t("scene.emptyRoom", { name: otterName })}
        </p>
      ) : null}

      {selectedItem && (
        <aside className={`scene-purchase-card ${selectedX < 50 ? "side-right" : "side-left"}`} aria-live="polite">
          <button className="scene-purchase-close" type="button" aria-label={t("scene.closeDetails")} onClick={() => onChooseItem(null)}>×</button>
          {selectedItem.image ? (
            <img src={selectedItem.image} alt="" />
          ) : (
            <span className="scene-purchase-icon" aria-hidden="true">{selectedItem.icon}</span>
          )}
          <div>
            <small>{editingMode === "decorations" ? t("scene.roomDecoration") : t("scene.otterClothing")}</small>
            <h3>{editingMode === "decorations" ? t(`item.${selectedItem.id}`) : t(`accessory.${selectedItem.id}`)}</h3>
            <b>{selectedIsOwned ? t("scene.alreadyOwned") : `★ ${selectedItem.cost}`}</b>
            {!isPreviewing && !selectedIsOwned && <p>{t("scene.starsLeft", { stars: Math.max(0, stars - selectedItem.cost) })}</p>}
          </div>
          <button
            className="scene-purchase-button"
            type="button"
            disabled={!isPreviewing && !selectedIsOwned && stars < selectedItem.cost}
            onClick={() => onConfirmItem(selectedItem)}
          >
            {isPreviewing ? t("scene.placeInPreview") : selectedIsOwned ? t("scene.wearIt") : stars < selectedItem.cost ? t("scene.notEnough") : t("scene.buyFor", { cost: selectedItem.cost })}
          </button>
        </aside>
      )}
    </section>
    </>
  );
};

export default RoomScene;
