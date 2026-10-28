import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Boxes, Check, Crosshair, Filter, Gamepad2, Globe2, Heart, RefreshCw, Search, Shield, SlidersHorizontal, Sparkles, Target, Trophy, Users, X } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import SkinCard from "./components/SkinCard.jsx";
import { CategoryBars, PlayerTrendChart, RarityDonut } from "./components/Charts.jsx";
import { fetchPlayerCount, fetchSkins } from "./api/cs2.js";
import { demoTrend, fallbackSkins, rarityPalette } from "./data/fallback.js";
import { makeSearchIndex, normalizeSearch } from "./data/searchAliases.js";
import { useApp } from "./state/AppContext.jsx";

const formatNumber = (n) => Number(n || 0).toLocaleString("ru-RU");
const categories = ["Все категории", "Винтовка", "Пистолет", "Нож", "Перчатки", "Наклейка", "Агент", "Дробовик", "Пулемёт", "Пистолет-пулемёт", "Снайперская винтовка"];

function StatCard({ label, value, change, icon: Icon, tone = "orange", footnote }) {
  return <div className="stat-card">
    <div className="stat-head"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={18} /></div></div>
    <div className="stat-value">{value}</div>
    <div className="stat-foot"><span className={change?.startsWith("-") ? "negative" : "positive"}>{change?.startsWith("-") ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change}</span><span>{footnote}</span></div>
  </div>;
}


function SkinTable({ skins, favorites, onToggleFavorite }) {
  return <div className="table-wrap"><table className="skin-table">
    <thead><tr><th>ПРЕДМЕТ</th><th>РЕДКОСТЬ</th><th>ТИП</th><th>ИЗНОС</th><th>ОСОБЫЙ ТИП</th><th /></tr></thead>
    <tbody>{skins.map((skin) => <tr key={skin.id}>
      <td><div className="table-item">{skin.image ? <img src={skin.image} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /> : <div className="mini-placeholder"><Shield size={14} /></div>}<div><strong>{skin.name}</strong><small>{skin.weapon?.name || skin.category?.name || "Предмет"}</small></div></div></td>
      <td><span className="rarity-label" style={{ "--rarity": skin.rarity?.color || "rgb(139, 149, 165)" }}><i />{skin.rarity?.name || "Не указана"}</span></td>
      <td>{skin.category?.name || "—"}</td><td>{skin.wear?.[0]?.name || "—"}</td>
      <td>{skin.stattrak ? <span className="tag tag-orange">StatTrak™</span> : skin.souvenir ? <span className="tag tag-gold">Souvenir</span> : <span className="muted">Обычный</span>}</td>
      <td><button className={`table-fav ${favorites.includes(skin.id) ? "selected" : ""}`} onClick={() => onToggleFavorite(skin.id)} aria-label="Избранное"><Heart size={15} fill={favorites.includes(skin.id) ? "currentColor" : "none"} /></button></td>
    </tr>)}</tbody>
  </table>{skins.length === 0 && <div className="empty-state"><Search size={24} /><strong>Ничего не найдено</strong><span>Измените поисковый запрос или фильтры.</span></div>}</div>;
}

export default function App() {
  const { state, dispatch } = useApp();
  const [skins, setSkins] = useState(fallbackSkins);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("Все редкости");
  const [category, setCategory] = useState("Все категории");
  const [onlySpecial, setOnlySpecial] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [playerCount, setPlayerCount] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleSkinCount, setVisibleSkinCount] = useState(60);
  const loadMoreRef = useRef(null);
  const rarityNames = useMemo(() => {
    const order = rarityPalette.map((r) => r.name);
    const names = [...new Set(skins.map((skin) => skin.rarity?.name).filter(Boolean))];
    names.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai < 0 && bi < 0) return a.localeCompare(b, "ru");
      if (ai < 0) return 1;
      if (bi < 0) return -1;
      return ai - bi;
    });
    return ["Все редкости", ...names];
  }, [skins]);

  useEffect(() => {
    const controller = new AbortController();
    fetchSkins(controller.signal)
      .then(({ data }) => {
        setSkins(data);
      })
      .catch((error) => {
        if (error.name === "CanceledError" || error.name === "AbortError") return;
        setSkins(fallbackSkins);
      });
    return () => controller.abort();
  }, [refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPlayerCount(controller.signal)
      .then(({ count }) => setPlayerCount(count))
      .catch(() => setPlayerCount(null));
    return () => controller.abort();
  }, [refreshKey]);

  const indexedSkins = useMemo(() => skins.map((skin) => ({ skin, searchIndex: makeSearchIndex(skin) })), [skins]);

  const filteredSkins = useMemo(() => {
    const queryTokens = normalizeSearch(search).split(" ").filter(Boolean);
    return indexedSkins.filter(({ skin, searchIndex }) => {
      const matchesSearch = queryTokens.length === 0 || queryTokens.every((token) => searchIndex.includes(token));
      const matchesRarity = rarity === "Все редкости" || skin.rarity?.name === rarity;
      const categoryName = normalizeSearch(skin.category?.name || "");
      const weaponName = normalizeSearch(skin.weapon?.name || "");
      const selectedCategory = normalizeSearch(category);
      const matchesCategory = category === "Все категории" || categoryName.includes(selectedCategory) || (selectedCategory === "винтовка" && (categoryName.includes("rifle") || categoryName.includes("винтовка"))) || (selectedCategory === "пистолет" && (categoryName.includes("pistol") || categoryName.includes("пистолет"))) || (selectedCategory === "нож" && (categoryName.includes("knife") || categoryName.includes("нож") || weaponName.includes("knife")));
      const matchesSpecial = !onlySpecial || skin.stattrak || skin.souvenir;
      return matchesSearch && matchesRarity && matchesCategory && matchesSpecial;
    }).map(({ skin }) => skin);
  }, [indexedSkins, search, rarity, category, onlySpecial]);

  useEffect(() => {
    setVisibleSkinCount(60);
  }, [search, rarity, category, onlySpecial, state.view, layout]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || state.view !== "catalog" || layout !== "grid" || visibleSkinCount >= filteredSkins.length) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleSkinCount((current) => Math.min(current + 60, filteredSkins.length));
      }
    }, { rootMargin: "250px 0px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [state.view, layout, visibleSkinCount, filteredSkins.length]);

  const favoriteSkins = useMemo(() => skins.filter((skin) => state.favorites.includes(skin.id)), [skins, state.favorites]);
  const toggleFavorite = useCallback((id) => dispatch({ type: "TOGGLE_FAVORITE", id }), [dispatch]);
  const rarityData = useMemo(() => {
    const counts = new Map();
    skins.forEach((skin) => {
      const name = skin.rarity?.name || "Не указана";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()].map(([name, count]) => ({ name, count, color: skins.find((s) => s.rarity?.name === name)?.rarity?.color || rarityPalette.find((r) => r.name === name)?.color }));
  }, [skins]);
  const categoryData = useMemo(() => {
    const counts = new Map();
    skins.forEach((skin) => {
      const name = skin.category?.name || "Другое";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 7);
  }, [skins]);
  const stattrakCount = useMemo(() => skins.filter((skin) => skin.stattrak).length, [skins]);
  const souvenirCount = useMemo(() => skins.filter((skin) => skin.souvenir).length, [skins]);
  const clearFilters = () => { setSearch(""); setRarity("Все редкости"); setCategory("Все категории"); setOnlySpecial(false); };

  const activeTitle = state.view === "catalog" ? "Каталог скинов" : state.view === "analytics" ? "Аналитика предметов" : state.view === "favorites" ? "Избранное" : "Панель аналитики";
  const activeDescription = state.view === "catalog" ? "Исследуйте коллекцию предметов CS2 и находите нужные скины." : state.view === "analytics" ? "Структура каталога, редкости и категории предметов." : state.view === "favorites" ? "Сохранённые предметы для быстрого доступа." : "Обзор рынка предметов и статистики Counter-Strike 2.";

  return <div className={`app-shell ${state.theme === "light" ? "light-theme" : ""}`}>
    <Sidebar />
    <main className="main-area">
      <Header />
      <div className="page-content">
        <div className="welcome-row">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> COUNTER-STRIKE 2 / КОЛЛЕКЦИЯ</div><h1>{activeTitle}<span className="title-period">.</span></h1><p>{activeDescription}</p></div>
          <div className="welcome-actions"><div className="collection-label"><span className="live-pulse" /> Коллекция Counter-Strike 2</div><button className="btn-secondary" onClick={() => setRefreshKey((v) => v + 1)}><RefreshCw size={15} /> Обновить данные</button></div>
        </div>

        {state.view === "overview" && <>
          <section className="stats-grid">
            <StatCard label="ПРЕДМЕТОВ В КАТАЛОГЕ" value={formatNumber(skins.length)} change="КОЛЛЕКЦИЯ" footnote="Все предметы в базе" icon={Boxes} tone="orange" />
            <StatCard label="STATTRAK™" value={formatNumber(stattrakCount)} change={`${skins.length ? Math.round(stattrakCount / skins.length * 100) : 0}%`} footnote="Доля каталога" icon={Target} tone="purple" />
            <StatCard label="SOUVENIR" value={formatNumber(souvenirCount)} change={`${skins.length ? Math.round(souvenirCount / skins.length * 100) : 0}%`} footnote="Памятные предметы" icon={Trophy} tone="blue" />
            <StatCard label="ИГРОКИ В STEAM" value={playerCount !== null ? formatNumber(playerCount) : "—"} change={playerCount !== null ? "СЕЙЧАС" : "НЕДОСТУПНО"} footnote="Игроков в CS2" icon={Users} tone="green" />
          </section>

          <section className="hero-panel">
            <div className="hero-copy"><div className="hero-kicker"><Sparkles size={14} /> CS2 / ARMORY</div><h2>Исследуй скины.<br /><span>Собирай коллекцию.</span></h2><p>Открой редкие предметы, изучи категории и собери собственную подборку скинов Counter-Strike 2.</p><button className="btn-primary" onClick={() => dispatch({ type: "SET_VIEW", view: "catalog" })}>Открыть каталог <ArrowUpRight size={16} /></button><div className="hero-foot"><span><Globe2 size={14} /> Мир предметов CS2</span><span><Check size={14} /> Редкость · износ · типы</span></div></div>
            <div className="hero-visual"><div className="hero-chip chip-top"><span className="chip-dot" /> CS2 ARMORY</div><div className="hero-chip chip-bottom"><span>КОЛЛЕКЦИЯ</span><strong>{formatNumber(skins.length)}</strong><small>ПРЕДМЕТОВ</small></div><div className="hero-index">CS2 / 01</div></div>
          </section>

          <section className="chart-grid">
            <div className="panel chart-panel trend-panel"><div className="panel-heading"><div><div className="eyebrow">АКТИВНОСТЬ СООБЩЕСТВА</div><h3>Активность игроков</h3></div><span className="panel-status"><i />6 МЕСЯЦЕВ</span></div><div className="chart-legend"><span className="legend-line" /> Динамика за период <span className="legend-note">ориентировочные значения</span></div><div className="trend-chart"><PlayerTrendChart data={demoTrend} /></div><div className="chart-bottom"><span>Последние 6 месяцев</span><span className="chart-disclaimer">Иллюстративная динамика</span></div></div>
            <div className="panel chart-panel rarity-panel"><div className="panel-heading"><div><div className="eyebrow">СТРУКТУРА КОЛЛЕКЦИИ</div><h3>Редкость предметов</h3></div><button className="tiny-action" onClick={() => dispatch({ type: "SET_VIEW", view: "analytics" })}>Подробнее <ArrowUpRight size={13} /></button></div><div className="donut-area"><RarityDonut data={rarityData} /><div className="donut-center"><strong>{formatNumber(skins.length)}</strong><span>ПРЕДМЕТОВ</span></div></div><div className="rarity-legend">{rarityData.slice(0, 4).map((r) => <div key={r.name}><span style={{ background: r.color }} />{r.name}<strong>{formatNumber(r.count)}</strong></div>)}</div></div>
          </section>

          <section className="panel recent-panel"><div className="panel-heading"><div><div className="eyebrow">КОЛЛЕКЦИЯ / НОВИНКИ</div><h3>Предметы из каталога</h3></div><button className="btn-text" onClick={() => dispatch({ type: "SET_VIEW", view: "catalog" })}>Весь каталог <ArrowUpRight size={14} /></button></div><SkinTable skins={skins.slice(0, 8)} favorites={state.favorites} onToggleFavorite={toggleFavorite} /></section>
        </>}

        {state.view === "catalog" && <section className="panel catalog-panel">
          <div className="catalog-toolbar"><div><div className="eyebrow">DATABASE / SKINS</div><h3>Все предметы <span className="count-pill">{formatNumber(filteredSkins.length)}</span></h3></div><div className="toolbar-actions"><button className={`btn-secondary ${showFilters ? "is-active" : ""}`} onClick={() => setShowFilters((v) => !v)}><SlidersHorizontal size={15} /> Фильтры</button><div className="layout-toggle"><button className={layout === "grid" ? "selected" : ""} onClick={() => setLayout("grid")} title="Карточки"><Boxes size={16} /></button><button className={layout === "table" ? "selected" : ""} onClick={() => setLayout("table")} title="Таблица"><Filter size={16} /></button></div></div></div>
          <div className="catalog-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по названию, оружию" />{search && <button onClick={() => setSearch("")}><X size={15} /></button>}</div>
          {showFilters && <div className="filters-row"><label>Редкость<select value={rarity} onChange={(e) => setRarity(e.target.value)}>{rarityNames.map((name) => <option key={name}>{name}</option>)}</select></label><label>Категория<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((name) => <option key={name}>{name}</option>)}</select></label><label className="checkbox-filter"><input type="checkbox" checked={onlySpecial} onChange={(e) => setOnlySpecial(e.target.checked)} /> Только StatTrak™ / Souvenir</label><button className="clear-filters" onClick={clearFilters}>Сбросить</button></div>}
          <div className="result-line"><span>Показано <strong>{formatNumber(filteredSkins.length)}</strong> из {formatNumber(skins.length)} предметов</span><span className="source-mini">Коллекция предметов</span></div>
          {layout === "grid" ? <>
            <div className="skin-grid">{filteredSkins.slice(0, visibleSkinCount).map((skin) => <SkinCard key={skin.id} skin={skin} favorite={state.favorites.includes(skin.id)} onToggleFavorite={toggleFavorite} />)}</div>
            {visibleSkinCount < filteredSkins.length && <div className="load-more-sentinel" ref={loadMoreRef} aria-label="Автоматическая загрузка следующих предметов"><span /><span /><span /></div>}
          </> : <SkinTable skins={filteredSkins} favorites={state.favorites} onToggleFavorite={toggleFavorite} />}
          {filteredSkins.length === 0 && <div className="empty-state"><Search size={24} /><strong>Совпадений нет</strong><span>Попробуйте изменить фильтры или запрос.</span><button className="btn-secondary" onClick={clearFilters}>Сбросить фильтры</button></div>}
        </section>}

        {state.view === "analytics" && <>
          <section className="stats-grid analytics-stats">
            <StatCard label="ВСЕ ПРЕДМЕТЫ" value={formatNumber(skins.length)} change="КОЛЛЕКЦИЯ" footnote="Всего предметов" icon={Boxes} tone="orange" />
            <StatCard label="УНИКАЛЬНЫХ РЕДКОСТЕЙ" value={formatNumber(rarityData.length)} change="РЕДКОСТЬ" footnote="Категории качества" icon={Sparkles} tone="purple" />
            <StatCard label="КАТЕГОРИЙ" value={formatNumber(categoryData.length)} change="ТОП 7" footnote="Крупнейшие категории" icon={Gamepad2} tone="blue" />
            <StatCard label="ИЗБРАННОЕ" value={formatNumber(state.favorites.length)} change="СОБРАНО" footnote="Сохранённые предметы" icon={Heart} tone="green" />
          </section>
          <section className="analytics-grid">
            <div className="panel chart-panel analytics-chart"><div className="panel-heading"><div><div className="eyebrow">РЕДКОСТЬ ПРЕДМЕТОВ</div><h3>Распределение по редкости</h3></div></div><div className="big-donut"><RarityDonut data={rarityData} /></div><div className="analytics-legend">{rarityData.map((r) => <div key={r.name}><span style={{ background: r.color }} /> <span>{r.name}</span><strong>{formatNumber(r.count)}</strong></div>)}</div></div>
            <div className="panel chart-panel analytics-chart"><div className="panel-heading"><div><div className="eyebrow">КАТЕГОРИИ ПРЕДМЕТОВ</div><h3>Категории предметов</h3></div></div><div className="category-chart"><CategoryBars data={categoryData} /></div><p className="chart-footnote">Распределение рассчитывается по типам предметов в каталоге.</p></div>
          </section>
          <section className="panel recent-panel"><div className="panel-heading"><div><div className="eyebrow">КОЛЛЕКЦИЯ / СВОДКА</div><h3>Характеристики коллекции</h3></div></div><div className="data-summary"><div><span>Предметы с изображением</span><strong>{formatNumber(skins.filter((skin) => Boolean(skin.image)).length)}</strong></div><div><span>StatTrak™</span><strong>{formatNumber(stattrakCount)} ({skins.length ? Math.round(stattrakCount / skins.length * 100) : 0}%)</strong></div><div><span>Souvenir</span><strong>{formatNumber(souvenirCount)} ({skins.length ? Math.round(souvenirCount / skins.length * 100) : 0}%)</strong></div><div><span>Предметы с диапазоном износа</span><strong>{formatNumber(skins.filter((skin) => skin.min_float !== null && skin.max_float !== null).length)}</strong></div></div></section>
        </>}

        {state.view === "favorites" && <section className="panel catalog-panel"><div className="catalog-toolbar"><div><div className="eyebrow">ЛИЧНАЯ КОЛЛЕКЦИЯ</div><h3>Избранные предметы <span className="count-pill">{favoriteSkins.length}</span></h3></div><button className="btn-secondary" onClick={() => dispatch({ type: "SET_VIEW", view: "catalog" })}>Открыть каталог <ArrowUpRight size={15} /></button></div>{favoriteSkins.length ? <div className="skin-grid">{favoriteSkins.map((skin) => <SkinCard key={skin.id} skin={skin} favorite onToggleFavorite={toggleFavorite} />)}</div> : <div className="empty-state"><Heart size={25} /><strong>Пока ничего нет</strong><span>Добавляйте скины в избранное кнопкой с сердцем в карточке предмета.</span><button className="btn-primary" onClick={() => dispatch({ type: "SET_VIEW", view: "catalog" })}>Перейти в каталог</button></div>}</section>}

        <footer className="page-footer"><div><span className="footer-mark"><Crosshair size={15} /></span><strong>CS2 INSIGHTS</strong><span>Предметы · аналитика · коллекции</span></div><div>Коллекции Counter-Strike 2 · Аналитика предметов</div><div>© 2026 <span className="footer-dot" /> CS2 Item Intelligence</div></footer>
      </div>
    </main>
  </div>;
}
