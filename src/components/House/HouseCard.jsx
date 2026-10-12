import { useEffect, useState } from "react";
import RoomTabs from "./RoomTabs";
import RoomScene from "./RoomScene";
import Modal from "../Modal/Modal";
import { useTranslation } from "../../i18n";

const HouseCard = ({ house, rewards, focusMode = false }) => {
  const { t } = useTranslation();
  const [openShop, setOpenShop] = useState(null);
  const [editingMode, setEditingMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showActions, setShowActions] = useState(true);
  const {
    stars,
    houseRooms,
    activeRoom,
    setActiveRoom,
    activeRoomDetails,
    roomDecorations,
    houseItems,
    houseItemsOwned,
    buyHouseItem,
    unlockedRoomIds,
    equipped,
    isCelebrating,
    isFocusing,
    noiseTone,
    otterName,
    setOtterName,
    isPreviewing,
  } = house;

  const activeRoomItems = houseItems.filter((item) => item.room === activeRoomDetails.id);
  const itemsStillNeeded = activeRoomItems.filter((item) => !houseItemsOwned.includes(item.id)).length;
  const allRoomsUnlocked = unlockedRoomIds.length === houseRooms.length;

  useEffect(() => {
    if (!openShop) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenShop(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openShop]);

  return (
    <section className="house-card" id="dashboard">
      {!focusMode && <div className="house-heading">
        <div>
          <p className="card-label">{t("house.label", { name: otterName || t("otter.default") })}</p>
          <h2>{t("house.title", { name: otterName || t("otter.default") })}</h2>
        </div>
        <div className="house-stats">
          <p className="house-class-points">
            <span aria-hidden="true">★</span> <strong>{stars}</strong> {t("house.classPoints")}
          </p>
          <div className="house-progress">
          <span><b>{activeRoomItems.length - itemsStillNeeded}</b> {t("house.roomItems", { total: activeRoomItems.length })}</span>
          <small>{allRoomsUnlocked ? t("house.allRooms") : t("house.nextRoom")}</small>
          </div>
        </div>
      </div>}

      {!focusMode && <div className={`house-actions ${showActions ? "" : "collapsed"}`}>
        {showActions && (
          <>
            <button className="outline" type="button" onClick={() => setOpenShop("rooms")}>{t("house.chooseRoom")}</button>
            <button className="outline" type="button" onClick={() => { setEditingMode((mode) => mode === "decorations" ? null : "decorations"); setSelectedItem(null); }}>{t("house.decorate")}</button>
            <button className="outline" type="button" onClick={() => { setEditingMode((mode) => mode === "accessories" ? null : "accessories"); setSelectedItem(null); }}>{t("house.dressUp")}</button>
            <button className="outline" type="button" onClick={() => setOpenShop("name")}>{t("house.nameOtter")}</button>
          </>
        )}
        <button
          className="house-actions-toggle"
          type="button"
          aria-expanded={showActions}
          onClick={() => setShowActions((visible) => !visible)}
        >
          {showActions ? t("house.hideActions") : t("house.showActions")}
        </button>
      </div>}

      <RoomScene
        room={activeRoomDetails}
        decorations={roomDecorations}
        availableItems={houseItems.filter((item) => item.room === activeRoomDetails.id)}
        equipped={equipped}
        isCelebrating={isCelebrating}
        isFocusing={isFocusing}
        noiseTone={noiseTone}
        otterName={otterName || t("otter.default")}
        focusMode={focusMode}
        editingMode={focusMode ? null : editingMode}
        accessoryItems={rewards.accessories}
        unlockedAccessories={rewards.unlocked}
        stars={stars}
        isPreviewing={isPreviewing}
        selectedItem={selectedItem}
        onChooseItem={setSelectedItem}
        onCloseEditor={() => { setEditingMode(null); setSelectedItem(null); }}
        onConfirmItem={(item) => {
          if (editingMode === "decorations") buyHouseItem(item);
          else rewards.buyOrEquip(item);
          setSelectedItem(null);
        }}
      />

      {!focusMode && openShop && (
        <Modal
          isOpen={Boolean(openShop)}
          onClose={() => setOpenShop(null)}
          className="shop-modal"
          ariaLabelledBy="shop-title"
          closeLabel={t("house.closeShop")}
        >
            {openShop === "name" ? (
              <form className="otter-name-modal" onSubmit={(event) => {
                event.preventDefault();
                setOpenShop(null);
              }}>
                <p className="card-label">{t("house.yourOtter")}</p>
                <h2 id="shop-title">{t("house.nameTitle")}</h2>
                <label className="otter-name-field">
                  <span>{t("house.nameField")}</span>
                  <input
                    type="text"
                    value={otterName}
                    maxLength="30"
                    autoFocus
                    onChange={(event) => setOtterName(event.target.value)}
                    placeholder={t("otter.default")}
                  />
                </label>
                <button className="outline" type="submit">{t("house.saveName")}</button>
              </form>
            ) : openShop === "rooms" ? (
              <div className="room-picker">
                <p className="card-label">{t("house.otterHouse")}</p>
                <h2 id="shop-title">{t("house.roomTitle")}</h2>
                <RoomTabs
                  rooms={houseRooms}
                  activeRoom={activeRoom}
                  setActiveRoom={(room) => {
                    setActiveRoom(room);
                    setOpenShop(null);
                  }}
                  unlockedRoomIds={unlockedRoomIds}
                  unlockAll={isPreviewing}
                />
              </div>
            ) : null}
        </Modal>
      )}
    </section>
  );
};

export default HouseCard;
