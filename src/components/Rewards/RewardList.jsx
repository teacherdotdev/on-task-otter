import { useTranslation } from "../../i18n";

const RewardList = ({ stars, accessories, unlocked, equipped, buyOrEquip, isPreviewing }) => {
  const { t } = useTranslation();
  const rewardItems = accessories.map((item) => {
    const owned = unlocked.includes(item.id);
    const wearing = equipped.includes(item.id);

    return (
      <article className="reward" key={item.id}>
        <span className="reward-icon" aria-hidden="true">
          {item.icon}
        </span>

        <div>
          <b>{t(`accessory.${item.id}`)}</b>
          <small>
            {owned
              ? wearing
                ? t("shop.wearing")
                : t("shop.unlocked")
              : `★ ${item.cost}`}
          </small>
        </div>

        <button
          type="button"
          disabled={!isPreviewing && !owned && stars < item.cost}
          onClick={() => buyOrEquip(item)}
        >
          {owned
            ? wearing
              ? t("shop.remove")
              : t("shop.wear")
            : t("shop.unlock")}
        </button>
      </article>
    );
  });
  
  return (
    <div className="reward-list">
      {rewardItems}
    </div>
  )
};

export default RewardList;
