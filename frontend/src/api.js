export const UNSPLASH_KEY = "nfAMPOWTyLv4XrCQCM-GBzF9R7wTjSEJPHBND--x59c";

export async function fetchImages(query, count = 7) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=${count}&orientation=landscape&client_id=${UNSPLASH_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("Unsplash response for:", query, data);

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Return array of URLs
    return data.results.map((img) => img.urls.regular);
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
}
