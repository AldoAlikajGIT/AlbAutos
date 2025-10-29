import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "./translations";

export const fuelMap = {
  diesel: { en: "Diesel", sq: "Naftë" },
  petrol: { en: "Petrol", sq: "Benzinë" },
  electric: { en: "Electric", sq: "Elektrike" },
  cng: { en: "CNG", sq: "CNG" },
  lpg: { en: "LPG", sq: "LPG" },
  ethanol: { en: "Ethanol", sq: "Etanol" },
  hydrogen: { en: "Hydrogen", sq: "Hidrogjen" },
};

export const transmissionMap = {
  automatic: { en: "Automatic", sq: "Automatik" },
  manual: { en: "Manual", sq: "Manual" },
  "semi-automatic": { en: "Semi-Automatic", sq: "Gjysmë-Automatik" },
};

export const bodyMap = {
  sedan: { en: "Sedan", sq: "Sedan" },
  suv: { en: "SUV", sq: "Foristrada" },
  coupe: { en: "Coupe", sq: "Coupe" },
  convertible: { en: "Convertible", sq: "Cabriolet" },
  compact: { en: "Compact", sq: "Kompakt" },
  van: { en: "Van", sq: "Furgon" },
};

export const exteriorColorMap = {
  black: { en: "Black", sq: "E zezë" },
  grey: { en: "Grey", sq: "Gri" },
  silver: { en: "Silver", sq: "Argjend" },
  white: { en: "White", sq: "E bardhë" },
  blue: { en: "Blue", sq: "Blu" },
  yellow: { en: "Yellow", sq: "E verdhë" },
  violet: { en: "Violet", sq: "Lejla" },
  red: { en: "Red", sq: "E kuqe" },
  orange: { en: "Orange", sq: "Portokalli" },
  green: { en: "Green", sq: "E gjelbër" },
  gold: { en: "Gold", sq: "Flori" },
  brown: { en: "Brown", sq: "Kafe" },
  bronze: { en: "Bronze", sq: "Bronz" },
  beige: { en: "Beige", sq: "Bezh" },
  metallic: { en: "Metallic", sq: "Metalike" },
};

export const interiorColorMap = {
  blue: { en: "Blue", sq: "Blu" },
  brown: { en: "Brown", sq: "Kafe" },
  yellow: { en: "Yellow", sq: "E verdhë" },
  grey: { en: "Grey", sq: "Gri" },
  beige: { en: "Beige", sq: "Bezha" },
  white: { en: "White", sq: "E bardhë" },
  red: { en: "Red", sq: "E kuqe" },
  orange: { en: "Orange", sq: "Portokalli" },
  green: { en: "Green", sq: "E gjelbër" },
  black: { en: "Black", sq: "E zezë" },
};

export const upholsteryMap = {
  alcantara: { en: "Alcantara", sq: "Alkantara" },
  cloth: { en: "Cloth", sq: "Pëlhurë" },
  "full leather": { en: "Full leather", sq: "Lëkurë e plotë" },
  "part leather": { en: "Part leather", sq: "Pjesërisht lëkurë" },
  velour: { en: "Velour", sq: "Kadife" },
  other: { en: "Other", sq: "Tjetër" },
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
  doorCount: string;
  seatCount: string;
  exteriorColor: string;
  interiorColor: string;
  upholstery: string;
  location: string;
  body: string;
  consumptionLPerKm: number;
  imageUrls: string[];
  options: string[];
  phoneNumber: string;
  email: string;
  sellerRole: "USER" | "CARDEALERSHIP";
  description: string;
}

export default function CarAdPage() {
  
  const [lang, setLang] = useState<"en" | "sq">("sq");
  const { id } = useParams();
  const navigate = useNavigate();
  const [carAd, setCarAd] = useState<CarAd | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? (carAd?.imageUrls.length ?? 1) - 1 : prev - 1
    );
  };

  const translateValue = (
  map: Record<string, { en: string; sq: string }>,
  value: string,
  lang: "en" | "sq"
): string => {
  if (!value) return "";
  return map[value.toLowerCase()]?.[lang] || value;
};

  useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);


  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === (carAd?.imageUrls.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/cars/${id}`)
      .then((res) => setCarAd(res.data))
      .catch(() => {
        alert("Could not load car ad.");
        navigate("/");
      });
  }, [id, navigate]);

  if (!carAd) return <div className="text-center mt-20">Loading car ad...</div>;

  

  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4 max-w-5xl mx-auto">
       <div className="mb-4">
      <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
        >
          <span className="text-lg"></span>
          <span className="font-medium">{translations[lang].goBack}</span>
        </button>
        </div>


      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          {carAd.brand} {carAd.model} ({carAd.year})
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Carousel */}
          <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg cursor-pointer flex items-center justify-center">
            <img
               src={`http://localhost:8080${carAd.imageUrls[currentIndex]}`}
               alt={`Car ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain transition duration-500 ease-in-out"
                onClick={() => setShowModal(true)}
              />
              
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow hover:bg-opacity-100"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow hover:bg-opacity-100"
            >
              ›
            </button>

            <div className="absolute bottom-2 w-full flex justify-center space-x-2">
              {carAd.imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 text-gray-700 text-sm">
  <p><strong>{translations[lang].price}:</strong> €{carAd.price.toLocaleString()}</p>
  <p><strong>{translations[lang].mileage}:</strong> {carAd.mileageKm.toLocaleString()} km</p>
  <p><strong>{translations[lang].fuel}:</strong> {translateValue(fuelMap, carAd.fuel, lang)}</p>
  <p><strong>{translations[lang].transmission}:</strong> {translateValue(transmissionMap, carAd.transmission, lang)}</p>
  <p><strong>{translations[lang].power}:</strong> {carAd.powerKW} kW / {carAd.powerHP} hp</p>
  <p><strong>{translations[lang].consumption}:</strong> {carAd.consumptionLPerKm} L/100km</p>
  <p><strong>{translations[lang].body}:</strong> {translateValue(bodyMap, carAd.body, lang)}</p>
  <p><strong>{translations[lang].doors}:</strong> {carAd.doorCount}</p>
  <p><strong>{translations[lang].seats}:</strong> {carAd.seatCount}</p>
  <p><strong>{translations[lang].exteriorColor}:</strong> {translateValue(exteriorColorMap, carAd.exteriorColor, lang)}</p>
  <p><strong>{translations[lang].interiorColor}:</strong> {translateValue(interiorColorMap, carAd.interiorColor, lang)}</p>
  <p><strong>{translations[lang].upholstery}:</strong> {translateValue(upholsteryMap, carAd.upholstery, lang)}</p>
  <p><strong>{translations[lang].location}:</strong> {carAd.location}</p>
</div>

        </div>

        {carAd.description && (
  <div className="mt-6">
    <h2 className="font-semibold text-lg mb-2">{translations[lang].description}</h2>
    <p className="text-gray-700 whitespace-pre-line">{carAd.description}</p>
  </div>
)}

        {/* Extra Options */}
        {carAd.options?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">{translations[lang].extraOptions}</h2>
            <ul className="list-disc list-inside text-gray-600 grid grid-cols-2 gap-2">
              {carAd.options.map((opt, index) => (
                <li key={index}>{opt}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold text-lg mb-2">{translations[lang].contactSeller}</h2>
          <p className="text-gray-600 text-sm font-bold">
            {carAd.sellerRole === "USER"
            ? translations[lang].privateSeller
            : `${translations[lang].dealership}: ${(carAd as any).dealershipName || ""}`}
          </p>
          <p className="text-gray-700"><strong>{translations[lang].email}:</strong> {carAd.email}</p>
          <p className="text-gray-700"><strong>{translations[lang].phone}:</strong> {carAd.phoneNumber}</p>
        </div>
      </div>

      {/* Modal for Fullscreen Image */}
      {showModal && (
  <div
    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      className="relative max-h-screen max-w-screen flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Go Back (inside modal, top-left) */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(-0); }}
        className="absolute top-5 left-5 z-20 text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-md text-sm font-medium"
        aria-label="Go back"
      >
        {translations[lang].goBack}
      </button>

      {/* Close (X) */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-5 right-5 z-20 text-white text-3xl font-bold"
        aria-label="Close"
      >
        ×
      </button>

      {/* The image sits UNDER the controls and ignores pointer events */}
      <img
        src={`http://localhost:8080${carAd.imageUrls[currentIndex]}`}
        alt="Fullscreen"
        className="h-[90vh] w-auto object-contain rounded shadow-lg max-w-full z-0 pointer-events-none select-none"
      />

      {/* Left Arrow */}
      {carAd.imageUrls.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                     text-white text-4xl font-bold bg-black/40 hover:bg-black/60
                     w-12 h-12 rounded-full flex items-center justify-center"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Right Arrow */}
      {carAd.imageUrls.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                     text-white text-4xl font-bold bg-black/40 hover:bg-black/60
                     w-12 h-12 rounded-full flex items-center justify-center"
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>
  </div>
)}
    </div>
  );
}
