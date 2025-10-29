import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { translations } from "./translations";
import AccountDropdown from "./AccountDropdown";

interface CarAd {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  
}

interface UserInfo {
  email: string;
  phoneNumber: string;
  role: string;
  carAds: CarAd[];
}

export default function MyAccount() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    phoneNumber: "",
    role: "",
    carAds: [],
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(e.target as Node);
      const isOutsideButton = hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node);
      if (isOutsideMenu && isOutsideButton) setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Please log in first.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserInfo(res.data))
      .catch(() => {
        setErrorMessage("Session expired. Please log in again.");
        navigate("/login");
      });
  }, [navigate]);

  const handleDelete = async (adId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this car ad?");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/cars/delete/${adId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: userInfo.email }
      });
  
      setUserInfo((prev) => ({
        ...prev,
        carAds: prev.carAds.filter((ad) => ad.id !== adId),
      }));
  
      setInfoMessage("Car ad deleted successfully!");
      setErrorMessage(""); // clear any previous error
    } catch (error) {
      setErrorMessage("Failed to delete car ad.");
      setInfoMessage(""); // clear any previous success
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center px-0">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between w-full">
      <div
  className="flex items-center space-x-3 cursor-pointer"
  onClick={() => navigate("/")}
>
  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
  <img src="/Logo.png" alt="AlbAutos Logo" className="w-full h-full object-contain" />

  </div>
  <h1 className="text-2xl font-bold text-gray-800">AlbAutos</h1>
</div>

        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].sellYourCar}</button>
          {localStorage.getItem("token") ? (
            <AccountDropdown lang={lang} />
          ) : (
            <button onClick={() => navigate("/login")} className="text-gray-700 hover:text-blue-500 font-medium">
              {translations[lang].logIn}
            </button>
          )}
        </div>

        {/* Hamburger Button for Mobile */}
        <div className="md:hidden">
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 text-2xl"
          >
            ☰
          </button>
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

      {/* Account Info */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mt-24">
        <h2 className="text-2xl font-bold text-center mb-4">{translations[lang].myAccount}</h2>
        {infoMessage && (
  <div className="text-green-600 text-center mb-4 font-medium">
    {infoMessage}
  </div>
)}
{errorMessage && (
  <div className="text-red-600 text-center mb-4 font-medium">
    {errorMessage}
  </div>
)}

        <div className="text-gray-700 space-y-3">
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Phone Number:</strong> {userInfo.phoneNumber}</p>
        </div>

        <div className="mt-4 flex justify-start">
  <button
    onClick={() => navigate("/editcontact")}
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    {translations[lang].editContact}
  </button>
</div>

        <div className="mt-6">
  <h3 className="text-lg font-semibold mb-2">{translations[lang].myCarAds}</h3>
  {userInfo.carAds.length > 0 ? (
    <ul className="space-y-4">
      {userInfo.carAds.map((ad) => (
        <li key={ad.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="font-medium">
            {ad.brand} {ad.model} ({ad.year}) ID: {ad.id}
          </p>

          <div className="mt-2 flex gap-4">
            <button
              onClick={() => navigate(`/caradpage/${ad.id}`)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              {translations[lang].view}
            </button>
            <button
              onClick={() => navigate(`/editcar/${ad.id}`)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              {translations[lang].edit}
            </button>
            <button
              onClick={() => handleDelete(ad.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              {translations[lang].delete}
            </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">{translations[lang].myCarAds}.</p>
  )}
</div>

      </div>
    </div>
  );
}
