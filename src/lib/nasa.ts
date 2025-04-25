
// NASA API configuration
const NASA_API_KEY = "ZThlBSUgbRRdoK4aPby3FiEHy4majxRM93PzfecO";
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";
const NASA_IMAGES_URL = "https://images-api.nasa.gov/search";

export interface NasaImage {
  title: string;
  description: string;
  url: string;
  date?: string;
  photographer?: string;
}

export async function getAstronomyPictureOfDay(): Promise<NasaImage> {
  const response = await fetch(`${NASA_APOD_URL}?api_key=${NASA_API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch APOD');
  
  const data = await response.json();
  return {
    title: data.title,
    description: data.explanation,
    url: data.url,
    date: data.date,
    photographer: data.copyright
  };
}

export async function searchNasaImages(query: string): Promise<NasaImage[]> {
  const response = await fetch(`${NASA_IMAGES_URL}?q=${encodeURIComponent(query)}&media_type=image`);
  if (!response.ok) throw new Error('Failed to fetch NASA images');
  
  const data = await response.json();
  
  return data.collection.items
    .slice(0, 5) // Limit to 5 results
    .map((item: any) => ({
      title: item.data[0].title,
      description: item.data[0].description,
      url: item.links?.[0]?.href || '',
    }));
}
