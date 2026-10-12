import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import { MAX_CLASS_NAME_LENGTH } from "../../utils/classList";
import { useTranslation } from "../../i18n";

// Add, rename and delete classes. Switching happens in the class menu in the
// header; this window only switches when the class on screen is deleted.
const ClassesModal = ({ classes, currentId, onAdd, onRename, onDelete, onClose }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameTo, setRenameTo] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const className = (classroom) => classroom.name || t("classes.unnamed");

  // Escape steps back one thing at a time: the delete question, then the
  // rename, then the window itself.
  useEffect(() => {
    const stepBack = (event) => {
      if (event.key !== "Escape") return;
      if (deletingId) setDeletingId(null);
      else if (renamingId) setRenamingId(null);
      else onClose();
    };
    window.addEventListener("keydown", stepBack);
    return () => window.removeEventListener("keydown", stepBack);
  }, [deletingId, renamingId, onClose]);

  const startRename = (classroom) => {
    setDeletingId(null);
    setRenamingId(classroom.id);
    setRenameTo(classroom.name);
  };

  const saveRename = (event) => {
    event.preventDefault();
    onRename(renamingId, renameTo);
    setRenamingId(null);
  };

  const add = (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName);
    setNewName("");
  };

  const confirmDelete = (id) => {
    onDelete(id);
    setDeletingId(null);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      className="export-import-modal classes-modal"
      ariaLabelledBy="classes-title"
      closeLabel={t("classes.close")}
    >
      <p className="export-import-label">{t("classes.label")}</p>
      <h2 id="classes-title">{t("classes.edit")}</h2>
      <p className="export-import-copy">{t("classes.hint")}</p>

      <ul className="classes-list">
        {classes.map((classroom) => {
          const isCurrent = classroom.id === currentId;
          const name = className(classroom);

          if (deletingId === classroom.id) {
            return (
              <li key={classroom.id} className="classes-row deleting" role="alert">
                <p>
                  <b>{t("classes.deleteTitle", { name })}</b>
                  {t("classes.deleteBody")}
                  {classes.length === 1 && <> {t("classes.deleteOnly")}</>}
                </p>
                <div className="classes-row-actions">
                  {/* Cancel comes first, so a stray Enter keeps the class. */}
                  <button className="clear-data-cancel" type="button" autoFocus onClick={() => setDeletingId(null)}>{t("classes.cancel")}</button>
                  <button className="clear-data-confirm" type="button" onClick={() => confirmDelete(classroom.id)}>{t("classes.deleteYes")}</button>
                </div>
              </li>
            );
          }

          if (renamingId === classroom.id) {
            return (
              <li key={classroom.id} className={`classes-row ${isCurrent ? "current" : ""}`}>
                <form className="classes-rename" onSubmit={saveRename}>
                  <input
                    type="text"
                    aria-label={t("classes.renameLabel", { name })}
                    value={renameTo}
                    maxLength={MAX_CLASS_NAME_LENGTH}
                    autoFocus
                    onChange={(event) => setRenameTo(event.target.value)}
                  />
                  <button className="export-import-primary" type="submit">{t("classes.save")}</button>
                  <button className="clear-data-cancel" type="button" onClick={() => setRenamingId(null)}>{t("classes.cancel")}</button>
                </form>
              </li>
            );
          }

          return (
            <li key={classroom.id} className={`classes-row ${isCurrent ? "current" : ""}`}>
              <span className="classes-row-name">
                <b>{name}</b>
                <small>{t("classes.starCount", { stars: classroom.progress.stars })}</small>
              </span>
              {isCurrent && <span className="classes-row-badge">{t("classes.current")}</span>}
              <button
                className="classes-icon-button"
                type="button"
                aria-label={t("classes.renameLabel", { name })}
                title={t("classes.rename")}
                onClick={() => startRename(classroom)}
              >
                <Icon name="pencil" />
              </button>
              <button
                className="classes-icon-button danger"
                type="button"
                aria-label={t("classes.deleteLabel", { name })}
                title={t("classes.delete")}
                onClick={() => {
                  setRenamingId(null);
                  setDeletingId(classroom.id);
                }}
              >
                <Icon name="trash" />
              </button>
            </li>
          );
        })}
      </ul>

      <form className="classes-add" onSubmit={add}>
        <input
          type="text"
          aria-label={t("classes.addLabel")}
          placeholder={t("classes.addPlaceholder")}
          maxLength={MAX_CLASS_NAME_LENGTH}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <button className="export-import-primary" type="submit" disabled={!newName.trim()}>
          <Icon name="plus" /> {t("classes.add")}
        </button>
      </form>

      <p className="classes-storage-note">{t("classes.storage")}</p>
    </Modal>
  );
};

export default ClassesModal;
