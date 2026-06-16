/**
 * Utilitare pentru parsarea și compararea timpului meciurilor
 * Presupunem că turneul are loc în anul 2026.
 * "15 iunie" -> 2026-06-15
 */

const LUNI = {
  "iunie": 5, // 0-indexed in JS
  "iulie": 6,
};

/**
 * Calculează timestamp-ul pentru începutul unui meci
 */
export function getMatchTimestamp(dateStr, timeStr) {
  const [zi, lunaStr] = dateStr.split(" ");
  const day = parseInt(zi, 10);
  const month = LUNI[lunaStr] !== undefined ? LUNI[lunaStr] : 5;
  const [hour, min] = timeStr.split(":").map(Number);
  
  // Creăm un obiect Date pentru anul 2026
  return new Date(2026, month, day, hour, min).getTime();
}

/**
 * Determină statusul unui meci raportat la momentul actual
 * @returns {'past' | 'live' | 'future'}
 */
export function getMatchStatus(dateStr, timeStr) {
  const matchTime = getMatchTimestamp(dateStr, timeStr);
  const now = new Date().getTime();
  
  // Durata estimată a unui meci: ~2 ore (120 min)
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

  if (now < matchTime) {
    return 'future';
  } else if (now >= matchTime && now <= matchTime + TWO_HOURS_MS) {
    return 'live';
  } else {
    return 'past';
  }
}
