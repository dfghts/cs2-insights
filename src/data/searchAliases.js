export const searchAliases = {
  "AK-47": ["ак 47", "ак47", "калаш", "автомат"],
  "AK-47 | Redline": ["красная линия", "редлайн", "ред лайн"],
  "Redline": ["красная линия", "редлайн", "ред лайн"],
  "AWP": ["авп", "снайперка", "снайперская винтовка"],
  "Asiimov": ["азимов", "асимов"],
  "Neo-Noir": ["неонуар", "нео нуар"],
  "Printstream": ["поток информации", "принтстрим"],
  "Fade": ["градиент", "фейд"],
  "Kill Confirmed": ["убийство подтверждено", "килл конфирмд"],
  "Case Hardened": ["поверхностная закалка", "кейс харденд"],
  "Doppler": ["допплер"],
  "Gamma Doppler": ["гамма допплер", "гамма-допплер"],
  "Crimson Web": ["багровая сеть", "кримсон веб"],
  "Tiger Tooth": ["тигриный клык", "тайгер тус"],
  "Marble Fade": ["мраморный градиент", "марбл фейд"],
  "Rust Coat": ["ржавое покрытие", "раст коат"],
  "Damascus Steel": ["дамасская сталь", "дамаск стил"],
  "Urban Masked": ["городская маскировка"],
  "Forest DDPAT": ["лесной цифровой камуфляж", "лесной ддпат"],
  "Safari Mesh": ["сафари сетка", "сафари-меш"],
  "Arctic Camo": ["арктический камуфляж"],
  "Boreal Forest": ["бореальный лес"],
  "Crimson Kimono": ["багровое кимоно"],
  "Ultraviolet": ["ультрафиолет"],
  "Autotronic": ["автотроника"],
  "Slaughter": ["мясник", "слотер"],
  "Stained": ["патина", "стейнед"],
  "Black Laminate": ["черный ламинат", "чёрный ламинат"],
  "Blue Laminate": ["синий ламинат"],
  "Red Laminate": ["красный ламинат"],
  "Ruby": ["рубин"],
  "Sapphire": ["сапфир"],
  "Emerald": ["изумруд"],
  "Dragon Lore": ["драконья история", "драгон лор"],
  "Hyper Beast": ["гиперзверь", "гипер бист"],
  "Fire Serpent": ["огненный змей", "файр серпент"],
  "Neon Rider": ["неоновый гонщик", "неон райдер"],
  "Bloodsport": ["кровавый спорт", "бладспорт"],
  "Vulcan": ["вулкан"],
  "Frontside Misty": ["туман на передовой", "фронтсайд мисти"],
  "Aquamarine Revenge": ["аквамариновая месть", "аквамарин ревендж"],
  "Neon Revolution": ["неоновая революция"],
  "Point Disarray": ["точечная дезорганизация"],
  "Fuel Injector": ["топливный инжектор"],
  "Wasteland Rebel": ["бунтарь пустоши"],
  "Dragon Tattoo": ["драконья татуировка"],
  "Bullet Rain": ["дождь из пуль"],
  "Golden Koi": ["золотой кои"],
  "Electric Hive": ["электрический улей"],
  "Slate": ["сланец"],
  "Empress": ["императрица"],
  "Howl": ["вой"],
  "Wild Lotus": ["дикий лотос"],
  "Nightwish": ["ночное желание", "найтвиш"],
  "Head Shot": ["выстрел в голову", "хедшот"],
  "Ice Coaled": ["ледяной уголь", "айс коулд"],
  "Phantom Disruptor": ["фантомный разрушитель"],
  "Desert Eagle": ["дезерт игл", "дигл"],
  "Glock-18": ["глок", "глок 18", "глок18"],
  "USP-S": ["юсп", "юспс"],
  "M4A1-S": ["м4а1с", "эмка", "м4а1 с"],
  "M4A4": ["м4а4", "эмка"],
  "P250": ["п250"],
  "Five-SeveN": ["файв севен", "пять семь"],
  "Tec-9": ["тек9", "тек 9"],
  "MAC-10": ["мак10", "мак 10"],
  "MP9": ["эмп9", "мп9"],
  "UMP-45": ["умп45", "умп 45"],
  "P90": ["п90"],
  "FAMAS": ["фамас"],
  "Galil AR": ["галил"],
  "AUG": ["ауг"],
  "SG 553": ["сг553", "сг 553"],
  "SSG 08": ["ссг08", "скаут"],
  "SCAR-20": ["скар20", "скар 20"],
  "G3SG1": ["г3сг1"],
  "Nova": ["нова"],
  "XM1014": ["хм1014"],
  "MAG-7": ["маг7", "маг 7"],
  "Sawed-Off": ["обрез"],
  "Negev": ["невага"],
  "M249": ["м249"],
  "Karambit": ["керамбит"],
  "Butterfly Knife": ["нож бабочка", "бабочка"],
  "Bayonet": ["штык нож", "штык-нож"],
  "M9 Bayonet": ["м9 штык", "м9 байонет"],
  "Hand Wraps": ["обмотки рук", "бинты"],
  "Sport Gloves": ["спортивные перчатки"],
  "Driver Gloves": ["перчатки водителя"],
  "Specialist Gloves": ["перчатки спецназа"],
  "Moto Gloves": ["мото перчатки", "мотоциклетные перчатки"],
  "Broken Fang Gloves": ["перчатки сломанного клыка"],
  "Bloodhound Gloves": ["перчатки ищейки"]
};

export function normalizeSearch(value) {
  return String(value || "")
    .toLocaleLowerCase("ru")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function makeSearchIndex(skin) {
  const values = [
    skin.name,
    skin.weapon?.name,
    skin.category?.name,
    skin.rarity?.name,
    skin.description,
    skin.collection?.name,
    ...(Array.isArray(skin.wear) ? skin.wear.map((wear) => wear?.name) : [])
  ].filter(Boolean);
  const normalizedBase = normalizeSearch(values.join(" "));
  const aliases = [];
  for (const [canonical, synonyms] of Object.entries(searchAliases)) {
    const normalizedCanonical = normalizeSearch(canonical);
    if (normalizedCanonical && normalizedBase.includes(normalizedCanonical)) aliases.push(...synonyms);
  }
  return normalizeSearch(`${values.join(" ")} ${aliases.join(" ")}`);
}
