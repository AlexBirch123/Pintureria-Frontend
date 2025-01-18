export const getLocalStorage = (itemKey) => {
  const item = localStorage.getItem(itemKey);
  if (!item) return null;
  const { datos, timestamp } = JSON.parse(item);
  return { datos, timestamp };
};

export const setLocalStorage = (data, itemKey) => {
  const now = Date.now();
  localStorage.setItem(
    itemKey,
    JSON.stringify({ datos: data, timestamp: now })
  );
};
