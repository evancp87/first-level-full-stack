// ============================================
// To cache api results on user's disk
// ============================================

export const storeCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getCache = (key) => {
  const diskData = JSON.parse(localStorage.getItem(key));
  return diskData ? diskData : [];
};

export const getCachedGames = () => {
  return getCache("cachedGames");
};

export const cacheGames = (data) => {
  storeCache("cachedGames", data);
};

//  dates

export const currentDate = dayjs().format("YYYY-MM-DD");
export const oneMonthAgo = dayjs().subtract(1, "month").format("YYYY-MM-DD");
export const oneMonthAhead = dayjs().add(1, "month").format("YYYY-MM-DD");
