import React from "react";
import { Moon, Sun } from "lucide-react";
import { useApp } from "../state/AppContext.jsx";

const pageNames = { overview: "Обзор", catalog: "Каталог скинов", analytics: "Аналитика", favorites: "Избранное" };

export default function Header() {
  const { state, dispatch } = useApp();
  return (
    <header className="topbar">
      <div className="breadcrumb"><span>CS2 INSIGHTS</span><b>/</b><strong>{pageNames[state.view]}</strong></div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Переключить тему" onClick={() => dispatch({ type: "TOGGLE_THEME" })}>{state.theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
      </div>
    </header>
  );
}
