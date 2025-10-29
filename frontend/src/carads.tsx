import { useEffect, useRef, useState } from "react";
import Card from "./card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { translations } from "./translations";
import AccountDropdown from "./AccountDropdown";


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

export default function CarAdsPage() {
  const [lang, setLang] = useState<"en" | "sq">("sq");
  const [carAds, setCarAds] = useState<CarAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // ✅ Parse entire query string with qs
        const parsedParams = qs.parse(location.search, { ignoreQueryPrefix: true });
  
        const response = await axios.get("http://localhost:8080/api/cars/search", {
          params: parsedParams,
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
        });
  
        setCarAds(response.data);
      } catch (error) {
        console.error("❌ Error fetching filtered car ads:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAds();
  }, [location.search]);

    useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);
  
  // Close hamburger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutside =
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node);
      if (isOutside) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
        <div className="flex items-center space-x-3">
        <div
  className="flex items-center space-x-3 cursor-pointer"
  onClick={() => navigate("/")}
>
  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
  <img src="/Logo.png" alt="AlbAutos Logo" className="w-full h-full object-contain" />
  </div>
  <h1 className="text-2xl font-bold text-gray-800">AlbAutos</h1>
</div>

        </div>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].sellYourCar}
          </button>
          {localStorage.getItem("token") ? (
            <AccountDropdown lang={lang} />
          ) : (
            <button onClick={() => navigate("/login")} className="text-gray-700 hover:text-blue-500 font-medium">
              {translations[lang].logIn}
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button ref={hamburgerRef} onClick={() => setMenuOpen(prev => !prev)} className="text-gray-700 text-2xl">☰</button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden bg-white shadow-md py-5 flex flex-col items-center space-y-4 mt-14 w-full fixed top-5 left-0 z-50">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">
            {translations[lang].sellYourCar}
          </button>
          {isLoggedIn && (
            <button onClick={() => { navigate("/myaccount"); setMenuOpen(false); }} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].myAccount}</button>
          )}
                    {localStorage.getItem("token") ? (
      <>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setMenuOpen(false);
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 1500);
          }}
          
          className="text-red-600 hover:text-red-700 font-medium"
        >
          {translations[lang].logOut}
        </button>
      </>
    ) : (
      <button
        onClick={() => {
          navigate("/login");
          setMenuOpen(false);
        }}
        className="text-gray-700 hover:text-blue-500 font-medium"
      >
        {translations[lang].logIn}
      </button>
    )}
  </div>
)}

      {/* Main Page Content */}
      <div className="px-4 pt-24 pb-12 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{translations[lang].carListings}</h1>

        {loading ? (
          <p className="text-center text-gray-600">{translations[lang].loadingCarAds}</p>
        ) : carAds.length === 0 ? (
          <p className="text-center text-red-500 font-semibold">{translations[lang].noSuchListing}</p>
        ) : (
          <div className="flex flex-col">
            {carAds.map((carAd) => (
              <div key={carAd.id} onClick={() => navigate(`/caradpage/${carAd.id}`)} className="cursor-pointer">
                <Card carAd={carAd} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
