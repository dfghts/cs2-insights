const image = (id) => `https://community.cloudflare.steamstatic.com/economy/image/${id}`;

export const fallbackSkins = [
  { id: "fallback-1", name: "AK-47 | Красная линия", weapon: { name: "AK-47" }, category: { name: "Винтовка" }, rarity: { name: "Запрещённое", color: "rgb(211, 44, 230)" }, wear: [{ name: "После полевых испытаний" }], min_float: 0.1, max_float: 0.7, stattrak: true, souvenir: false, image: "https://placehold.co/600x400/171b24/edf1f7?text=AK-47+Redline" },
  { id: "fallback-2", name: "AWP | Неонуар", weapon: { name: "AWP" }, category: { name: "Снайперская винтовка" }, rarity: { name: "Засекреченное", color: "rgb(136, 71, 255)" }, wear: [{ name: "Немного поношенное" }], min_float: 0, max_float: 0.8, stattrak: true, souvenir: false, image: "https://placehold.co/600x400/171b24/edf1f7?text=AWP+Neo-Noir" },
  { id: "fallback-3", name: "M4A1-S | Поток информации", weapon: { name: "M4A1-S" }, category: { name: "Винтовка" }, rarity: { name: "Тайное", color: "rgb(235, 75, 75)" }, wear: [{ name: "Прямо с завода" }], min_float: 0, max_float: 0.7, stattrak: false, souvenir: false, image: "https://placehold.co/600x400/171b24/edf1f7?text=M4A1-S+Printstream" },
  { id: "fallback-4", name: "Glock-18 | Градиент", weapon: { name: "Glock-18" }, category: { name: "Пистолет" }, rarity: { name: "Тайное", color: "rgb(235, 75, 75)" }, wear: [{ name: "Прямо с завода" }], min_float: 0, max_float: 0.08, stattrak: false, souvenir: false, image: "https://placehold.co/600x400/171b24/edf1f7?text=Glock-18+Fade" },
  { id: "fallback-5", name: "USP-S | Убийство подтверждено", weapon: { name: "USP-S" }, category: { name: "Пистолет" }, rarity: { name: "Засекреченное", color: "rgb(136, 71, 255)" }, wear: [{ name: "После полевых испытаний" }], min_float: 0, max_float: 0.9, stattrak: true, souvenir: false, image: "https://placehold.co/600x400/171b24/edf1f7?text=USP-S+Kill+Confirmed" },
  { id: "fallback-6", name: "Нож | Поверхностная закалка", weapon: { name: "Нож" }, category: { name: "Нож" }, rarity: { name: "Тайное", color: "rgb(235, 75, 75)" }, wear: [{ name: "Немного поношенное" }], min_float: 0, max_float: 1, stattrak: false, souvenir: false, image: "https://placehold.co/600x400/171b24/edf1f7?text=Knife+Case+Hardened" }
];

export const demoTrend = [
  { month: "Май", players: 865000 },
  { month: "Июн", players: 892000 },
  { month: "Июл", players: 934000 },
  { month: "Авг", players: 918000 },
  { month: "Сен", players: 951000 },
  { month: "Окт", players: 987000 }
];

export const rarityPalette = [
  { name: "Ширпотреб", color: "rgb(176, 195, 217)" },
  { name: "Промышленное качество", color: "rgb(94, 152, 217)" },
  { name: "Армейское качество", color: "rgb(75, 105, 255)" },
  { name: "Запрещённое", color: "rgb(136, 71, 255)" },
  { name: "Засекреченное", color: "rgb(211, 44, 230)" },
  { name: "Тайное", color: "rgb(235, 75, 75)" },
  { name: "Контрабандное", color: "rgb(228, 174, 57)" }
];
