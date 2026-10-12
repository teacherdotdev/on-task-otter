import { useTranslation } from "../../i18n";

const HouseCatalog = ({
  room,
  items,
  ownedItems,
  stars,
  buyHouseItem,
  isPreviewing,
  titleId,
}) => {
  const { t } = useTranslation();
  const catalogItems = items.filter(
    (item) => item.room === room.id
  );

  return (
    <div className="house-catalog">
      <div className="catalog-heading">
        <div>
          <p className="catalog-label">{t("catalog.label")}</p>
          <h2 id={titleId}>{t("catalog.title", { room: t(`room.${room.id}.name`).toLowerCase() })}</h2>
        </div>
        <span className="points-badge">{isPreviewing ? t("scene.preview") : t("scene.stars", { stars })}</span>
      </div>

      <div className="reward-list">
        {catalogItems.map((item) => {
          const owned = ownedItems.includes(item.id);

          return (
            <article className="reward" key={item.id}>
              <img
                className="reward-icon house-item-icon"
                src={item.image}
                alt=""
              />

              <div>
                <b>{t(`item.${item.id}`)}</b>
                <small>
                  {owned ? t("catalog.inRoom") : `★ ${item.cost}`}
                </small>
              </div>

              <button
                type="button"
                disabled={!isPreviewing && (owned || stars < item.cost)}
                onClick={() => buyHouseItem(item)}
              >
                {isPreviewing ? (owned ? t("catalog.takeAway") : t("catalog.place")) : owned ? t("catalog.placed") : t("catalog.buy")}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default HouseCatalog;
