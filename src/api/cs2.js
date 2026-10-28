import axios from "axios";

const API_URLS = [
  "https://bymykel.github.io/CSGO-API/api/en/skins.json",
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json"
];

const rarityTranslations = {
  "Consumer Grade": "Ширпотреб",
  "Industrial Grade": "Промышленное качество",
  "Mil-Spec Grade": "Армейское качество",
  "Restricted": "Запрещённое",
  "Classified": "Засекреченное",
  "Covert": "Тайное",
  "Contraband": "Контрабандное",
  "Extraordinary": "Экстраординарное",
  "Distinguished": "Выдающееся",
  "Exceptional": "Исключительное",
  "Superior": "Превосходное",
  "Master": "Мастерское"
};

const categoryTranslations = {
  "Rifle": "Винтовка",
  "Pistol": "Пистолет",
  "Knife": "Нож",
  "Knives": "Ножи",
  "Gloves": "Перчатки",
  "Sticker": "Наклейка",
  "Agent": "Агент",
  "Patch": "Нашивка",
  "Graffiti": "Граффити",
  "Container": "Контейнер",
  "Collectible": "Коллекционный предмет",
  "Music Kit": "Музыкальный набор",
  "SMG": "Пистолет-пулемёт",
  "Shotgun": "Дробовик",
  "Machinegun": "Пулемёт",
  "Sniper Rifle": "Снайперская винтовка",
  "Equipment": "Экипировка"
};

const wearTranslations = {
  "Factory New": "Прямо с завода",
  "Minimal Wear": "Немного поношенное",
  "Field-Tested": "После полевых испытаний",
  "Well-Worn": "Поношенное",
  "Battle-Scarred": "Закалённое в боях"
};

function translateLabel(value, dictionary) {
  return value ? (dictionary[value] || value) : value;
}

function normalizeSkin(item, index) {
  const rarity = item.rarity || {};
  const category = item.category || {};
  return {
    ...item,
    id: item.id || item.name || `skin-${index}`,
    name: item.name || "Неизвестный предмет",
    image: item.image || "",
    weapon: item.weapon || { name: "Другое" },
    category: {
      ...category,
      name: translateLabel(category.name, categoryTranslations) || "Без категории"
    },
    rarity: {
      ...rarity,
      name: translateLabel(rarity.name, rarityTranslations) || "Не указана",
      color: rarity.color || "rgb(139, 149, 165)"
    },
    wear: Array.isArray(item.wear)
      ? item.wear.map((wear) => ({
          ...wear,
          name: translateLabel(wear?.name, wearTranslations) || "Износ не указан"
        }))
      : [],
    min_float: Number.isFinite(item.min_float) ? item.min_float : null,
    max_float: Number.isFinite(item.max_float) ? item.max_float : null,
    stattrak: Boolean(item.stattrak),
    souvenir: Boolean(item.souvenir)
  };
}

export async function fetchSkins(signal) {
  let lastError;
  for (const url of API_URLS) {
    try {
      const response = await axios.get(url, { signal, timeout: 15000 });
      if (!Array.isArray(response.data)) throw new Error("API вернул данные в неожиданном формате");
      return { data: response.data.map(normalizeSkin), source: url, demo: false };
    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError") throw error;
      lastError = error;
    }
  }
  throw lastError || new Error("Не удалось загрузить каталог скинов");
}

export async function fetchPlayerCount(signal) {
  const customEndpoint = import.meta.env.VITE_STEAM_API_URL?.trim();
  const endpoints = [
    customEndpoint,
    "/api/players",
    "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730"
  ].filter((url, index, list) => Boolean(url) && list.indexOf(url) === index);

  let lastError;
  for (const url of endpoints) {
    try {
      const response = await axios.get(url, { signal, timeout: 9000 });
      const count = Number(response.data?.response?.player_count);
      if (Number.isFinite(count) && count > 0) return { count, live: true };
      throw new Error("Steam API не вернул число игроков");
    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError") throw error;
      lastError = error;
    }
  }
  throw lastError || new Error("Статистика Steam временно недоступна");
}
