import { useState } from "react";
import RoomPicker from "./RoomPicker";
import RoomScene from "./RoomScene";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// A round icon button that sits on top of the room. The label shows as a
// tooltip, so the room itself stays uncluttered.
const SceneButton = ({ icon, label, pressed, onClick }) => (
  <button
    className="scene-icon-button"
    type="button"
    aria-label={label}
    aria-pressed={pressed}
    data-tooltip={label}
    onClick={onClick}
  >
    <Icon name={icon} />
  </button>
);

// In focus mode the session's timer and sound meter come in as children, so
// they sit inside the room instead of under it.
const HouseCard = ({ house, rewards, focusMode = false, fullScreen, floating, children }) => {
  const { t } = useTranslation();
  const [isRenaming, setIsRenaming] = useState(false);
  const [editingMode, setEditingMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const {
    stars,
    houseRooms,
    activeRoom,
    setActiveRoom,
    activeRoomDetails,
    roomDecorations,
    houseItems,
    buyHouseItem,
    equipped,
    isCelebrating,
    isFocusing,
    isAtDesk,
    noiseTone,
    otterName,
    setOtterName,
    isPreviewing,
  } = house;

  const shownName = otterName || t("otter.default");
  const activeRoomItems = houseItems.filter((item) => item.room === activeRoomDetails.id);

  const closeEditor = () => {
    setEditingMode(null);
    setSelectedItem(null);
  };

  const toggleEditing = (mode) => {
    setEditingMode((current) => current === mode ? null : mode);
    setSelectedItem(null);
  };

  const configureOverlay = (
    <>
      <div className="scene-overlay scene-overlay-start">
        {editingMode === "decorations" ? null : isRenaming ? (
          <form className="scene-chip otter-name-tag" onSubmit={(event) => {
            event.preventDefault();
            setIsRenaming(false);
          }}>
            <input
              type="text"
              aria-label={t("house.nameField")}
              value={otterName}
              maxLength="30"
              autoFocus
              placeholder={t("otter.default")}
              onChange={(event) => setOtterName(event.target.value)}
              onBlur={() => setIsRenaming(false)}
              onKeyDown={(event) => event.key === "Escape" && setIsRenaming(false)}
            />
            <button type="submit" aria-label={t("house.saveName")}><Icon name="check" /></button>
          </form>
        ) : (
          <div className="scene-chip otter-name-tag">
            <b>{shownName}</b>
            <button type="button" aria-label={t("house.nameOtter")} title={t("house.nameOtter")} onClick={() => setIsRenaming(true)}>
              <Icon name="pencil" />
            </button>
          </div>
        )}
        <p className="scene-chip" title={t("house.classStarsDetail")}>
          <span className="scene-chip-star" aria-hidden="true">★</span>
          <b>{stars}</b> <span className="scene-chip-word">{t("house.stars")}</span>
        </p>
      </div>

      <div className="scene-overlay scene-overlay-end" role="toolbar" aria-label={t("house.actions")}>
        <RoomPicker rooms={houseRooms} activeRoom={activeRoom} setActiveRoom={setActiveRoom} />
        <SceneButton icon="sofa" label={t("house.decorate")} pressed={editingMode === "decorations"} onClick={() => toggleEditing("decorations")} />
        <SceneButton icon="shirt" label={t("house.dressUp")} pressed={editingMode === "accessories"} onClick={() => toggleEditing("accessories")} />
      </div>

      {editingMode && (
        <div className="scene-overlay scene-overlay-bottom">
          <button className="scene-exit-button" type="button" onClick={closeEditor}>
            <Icon name="check" />
            {editingMode === "decorations" ? t("scene.exitDecorating") : t("scene.exitDressing")}
          </button>
        </div>
      )}
    </>
  );

  // A floating room needs neither button: the floating window carries the
  // browser's own button for going back to the tab.
  const canFloat = floating?.isSupported && !floating.isFloating;
  const canGoFullScreen = fullScreen?.isSupported && !floating?.isFloating;
  const focusOverlay = (canFloat || canGoFullScreen) && (
    <div className="scene-overlay scene-overlay-end">
      {canFloat && (
        <SceneButton icon="pictureInPicture" label={t("app.float.enter")} onClick={floating.open} />
      )}
      {canGoFullScreen && (
        <SceneButton
          icon={fullScreen.isFullScreen ? "minimize" : "maximize"}
          label={fullScreen.isFullScreen ? t("app.fullScreen.exit") : t("app.fullScreen.enter")}
          onClick={fullScreen.isFullScreen ? fullScreen.exit : fullScreen.enter}
        />
      )}
    </div>
  );

  return (
    <section className="house-card" id="dashboard">
      <RoomScene
        room={activeRoomDetails}
        decorations={roomDecorations}
        availableItems={activeRoomItems}
        equipped={equipped}
        isCelebrating={isCelebrating}
        isFocusing={isFocusing}
        isAtDesk={isAtDesk}
        noiseTone={noiseTone}
        editingMode={focusMode ? null : editingMode}
        accessoryItems={rewards.accessories}
        unlockedAccessories={rewards.unlocked}
        stars={stars}
        isPreviewing={isPreviewing}
        selectedItem={focusMode ? null : selectedItem}
        onChooseItem={setSelectedItem}
        onConfirmItem={(item) => {
          if (editingMode === "decorations") buyHouseItem(item);
          else rewards.buyOrEquip(item);
          setSelectedItem(null);
        }}
      >
        {focusMode ? focusOverlay : configureOverlay}
        {focusMode && children}
      </RoomScene>
    </section>
  );
};

export default HouseCard;
