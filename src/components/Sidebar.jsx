import React from "react";
import { BarChart3, Boxes, Crosshair, Heart, LayoutDashboard } from "lucide-react";
import { useApp } from "../state/AppContext.jsx";

const navItems = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard },
  { id: "catalog", label: "Каталог скинов", icon: Boxes },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
  { id: "favorites", label: "Избранное", icon: Heart }
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-logo" src={state.theme === "light" ? "/cs2-insights-light.svg" : "/cs2-insights.svg"} alt="CS2 Insights" /><img className="brand-mark-logo" src={state.theme === "light" ? "/cs2-mark-light.svg" : "/cs2-mark.svg"} alt="" />
      </div>
      <div className="nav-label">НАВИГАЦИЯ</div>
      <nav>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${state.view === id ? "active" : ""}`} onClick={() => dispatch({ type: "SET_VIEW", view: id })}>
            <Icon size={18} /><span>{label}</span>
            {id === "favorites" && state.favorites.length > 0 && <em>{state.favorites.length}</em>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-footer"><Crosshair size={14} /> <span>CS2 INSIGHTS</span><i>01</i></div>
      </div>
    </aside>
  );
}
