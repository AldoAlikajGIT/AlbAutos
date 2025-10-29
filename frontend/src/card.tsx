import { useState, useEffect } from "react";

// Translation maps
const fuelMap: Record<string, { en: string; sq: string }> = {
  diesel: { en: "Diesel", sq: "Naftë" },
  petrol: { en: "Petrol", sq: "Benzinë" },
  electric: { en: "Electric", sq: "Elektrike" },
  cng: { en: "CNG", sq: "CNG" },
  lpg: { en: "LPG", sq: "LPG" },
  ethanol: { en: "Ethanol", sq: "Etanol" },
  hydrogen: { en: "Hydrogen", sq: "Hidrogjen" },
};

const transmissionMap: Record<string, { en: string; sq: string }> = {
  automatic: { en: "Automatic", sq: "Automatik" },
  manual: { en: "Manual", sq: "Manual" },
  "semi-automatic": { en: "Semi-Automatic", sq: "Gjysmë-Automatik" },
};

// Translation helper
const translateValue = (
  map: Record<string, { en: string; sq: string }>,
  value: string,
  lang: "en" | "sq"
): string => {
  if (!value) return "";
  return map[value.toLowerCase()]?.[lang] || value;
};

interface CarAd {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileageKm: number;
  fuel: string;
  transmission: string;
  powerKW: number;
  powerHP: number;
  imageUrls: string[];
  location: string;
}

export default function Card({ carAd }: { carAd: CarAd }) {
  const [lang, setLang] = useState<"en" | "sq">("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") as "en" | "sq" | null;
    if (storedLang === "sq") {
      setLang("sq");
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden mb-6 w-full">
      {/* Image Section */}
      <div className="md:w-1/3 w-full h-60 bg-white flex items-center justify-center">
        <img
          src={`http://localhost:8080${carAd.imageUrls[0]}` || "/no-image.jpg"}
          alt={`${carAd.brand} ${carAd.model}`}
          className="object-contain w-full h-full"
        />
      </div>

      {/* Info Section */}
      <div className="md:w-2/3 w-full p-4 flex flex-col justify-between">
        {/* Title & Price */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">
              {carAd.brand} {carAd.model}
            </h2>
            <p className="text-gray-500">{carAd.year}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-700">
              € {carAd.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>📍 {carAd.mileageKm.toLocaleString()} km</div>
          <div>⚙️ {translateValue(transmissionMap, carAd.transmission, lang)}</div>
          <div>🗓️ {carAd.year}</div>
          <div>⛽ {translateValue(fuelMap, carAd.fuel, lang)}</div>
          <div>
            🔋 {carAd.powerKW} kW ({carAd.powerHP} hp)
          </div>
          <div>📌 {carAd.location}</div>
        </div>
      </div>
    </div>
  );
}
