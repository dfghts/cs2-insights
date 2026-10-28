import React from "react";
import { Heart, ArrowUpRight, ShieldCheck } from "lucide-react";

export function getRarityColor(skin) {
  return skin?.rarity?.color || "rgb(139, 149, 165)";
}

export default function SkinCard({ skin, favorite, onToggleFavorite }) {
  const rarityColor = getRarityColor(skin);
  const wear = skin.wear?.[0]?.name || "Износ не указан";
  return (
    <article className="skin-card" style={{ "--rarity": rarityColor }}>
      <div className="skin-art">
        <div className="skin-topline"><span className="rarity-dot" />{skin.rarity?.name || "Предмет"}</div>
        <button className={`favorite-btn ${favorite ? "is-favorite" : ""}`} aria-label={favorite ? "Убрать из избранного" : "Добавить в избранное"} onClick={() => onToggleFavorite(skin.id)}>
          <Heart size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
        {skin.image ? <img src={skin.image} alt={skin.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "grid"; }} /> : null}
        <div className="image-fallback" style={{ display: skin.image ? "none" : "grid" }}><ShieldCheck size={34} /><span>CS2 ITEM</span></div>
        <div className="art-glow" />
      </div>
      <div className="skin-info">
        <div className="skin-weapon">{skin.weapon?.name || skin.category?.name || "Предмет"}</div>
        <h3 title={skin.name}>{skin.name}</h3>
        <div className="skin-meta"><span>{wear}</span><span className="skin-link"><ArrowUpRight size={13} /></span></div>
        <div className="skin-tags">
          {skin.stattrak && <span className="tag tag-orange">StatTrak™</span>}
          {skin.souvenir && <span className="tag tag-gold">Souvenir</span>}
          {skin.min_float !== null && skin.max_float !== null && <span className="tag">Float {skin.min_float.toFixed(2)}–{skin.max_float.toFixed(2)}</span>}
        </div>
      </div>
    </article>
  );
}
