export function debounce(fn, delay = 500) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function getQualityColor(quality) {
  const map = {普通:"#ccc",稀有:"#409eff",史诗:"#a740ff",神话:"#ff4040"};
  return map[quality] || "#ccc";
}

export function uuid(addr = "") {
  return Date.now().toString(36) + Math.random().toString(36).slice(2) + (addr || "").slice(-4);
}
