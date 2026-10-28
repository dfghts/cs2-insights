import React, { createContext, useContext, useMemo, useReducer } from "react";

const AppContext = createContext(null);

const initialState = {
  favorites: [],
  view: "overview",
  theme: "dark"
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.includes(action.id)
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id]
      };
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp должен использоваться внутри AppProvider");
  return context;
}
