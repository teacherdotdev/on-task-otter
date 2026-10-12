import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import { useTranslation } from "../../i18n";

// Which class is on screen, one click away in a small menu in the header's
// top-right corner, beside the microphone.
const ClassPicker = ({ list, currentId, select, onEdit }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const className = (classroom) => classroom.name || t("classes.unnamed");
  const current = list.find((classroom) => classroom.id === currentId) ?? list[0];

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

  const choose = (id) => {
    select(id);
    setOpen(false);
  };

  const edit = () => {
    setOpen(false);
    onEdit();
  };

  return (
    <div className="class-picker" ref={container}>
      <button
        className="class-picker-button"
        type="button"
        aria-expanded={open}
        aria-controls="class-menu"
        aria-label={`${t("classes.change")}: ${className(current)}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Icon name="users" />
        <span className="class-picker-name">{className(current)}</span>
        <Icon name="chevronDown" className="class-picker-chevron" />
      </button>

      {open && (
        <div className="room-menu class-menu" id="class-menu">
          <ul aria-label={t("classes.label")}>
            {list.map((classroom) => {
              const isCurrent = classroom.id === current.id;
              return (
                <li key={classroom.id}>
                  <button type="button" aria-current={isCurrent} onClick={() => choose(classroom.id)}>
                    <span className="room-menu-copy">
                      <b>{className(classroom)}</b>
                    </span>
                    {isCurrent && <Icon name="check" className="room-menu-check" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <button className="class-menu-edit" type="button" onClick={edit}>
            <Icon name="pencil" />
            {t("classes.edit")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassPicker;
