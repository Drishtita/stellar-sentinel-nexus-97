
// Space Weather API configuration
const NASA_API_KEY = "ZThlBSUgbRRdoK4aPby3FiEHy4majxRM93PzfecO";
const DONKI_URL = "https://api.nasa.gov/DONKI";
const TLE_API_URL = "http://tle.ivanstanojevic.me/api/tle";

export interface SpaceWeatherData {
  modelCompletionTime: string;
  impactList: Array<{
    location: string;
    arrivalTime: string;
    kpIndex: number;
  }>;
}

export interface SatelliteData {
  name: string;
  lineOne: string;
  lineTwo: string;
  date: string;
}

export async function getSpaceWeatherData(): Promise<SpaceWeatherData[]> {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  
  const response = await fetch(
    `${DONKI_URL}/WSAEnlilSimulations?startDate=${startDate}&endDate=${startDate}&api_key=${NASA_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch space weather data');
  }
  
  return await response.json();
}

export async function getLatestSatellites(limit: number = 5): Promise<SatelliteData[]> {
  const response = await fetch(`${TLE_API_URL}?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch satellite data');
  }
  
  const data = await response.json();
  return data.member.map((sat: any) => ({
    name: sat.name,
    lineOne: sat.line1,
    lineTwo: sat.line2,
    date: sat.date
  }));
}
