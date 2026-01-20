// src/utils/getImageUrl.js
const getImageUrl = (images, fallback = "/default.png") => {
  if (!images || images.length === 0) return fallback;
  return images[0]?.url || images[0] || fallback;
};

export default getImageUrl;
