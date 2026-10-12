import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// Which room the otter is in, one click away in a small menu under the house
// button, the same way Shy Safari switches Scenes. Every room is always open.
const RoomPicker = ({ rooms, activeRoom, setActiveRoom }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsideClick = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [open]);

  const choose = (roomId) => {
    setActiveRoom(roomId);
    setOpen(false);
  };

  return (
    <div className="room-switcher" ref={container}>
      <button
        className="scene-icon-button"
        type="button"
        aria-expanded={open}
        aria-controls="room-menu"
        aria-label={`${t("house.chooseRoom")}: ${t(`room.${activeRoom}.name`)}`}
        data-tooltip={t("house.chooseRoom")}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Icon name="house" />
      </button>

      {open && (
        <div className="room-menu" id="room-menu">
          <ul aria-label={t("rooms.label")}>
            {rooms.map((room) => {
              const current = room.id === activeRoom;
              return (
                <li key={room.id}>
                  <button type="button" aria-current={current} onClick={() => choose(room.id)}>
                    <img className="room-menu-icon" src={room.icon} alt="" />
                    <span className="room-menu-copy">
                      <b>{t(`room.${room.id}.name`)}</b>
                      <small>{t(`room.${room.id}.description`)}</small>
                    </span>
                    {current && <Icon name="check" className="room-menu-check" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoomPicker;
