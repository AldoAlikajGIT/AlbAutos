import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "./index.css";
import { carBrandsAndModels } from "./cardata"; // ✅ Import car data
import { useRef, useEffect } from "react";
import AccountDropdown from "./AccountDropdown";
import { translations } from "./translations";

export default function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const isLoggedIn = !!localStorage.getItem("token");
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian


 // Close mobile menu on outside click
 useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const isClickOutsideMenu = menuRef.current && !menuRef.current.contains(e.target as Node);
    const isClickOutsideButton = hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node);

    if (isClickOutsideMenu && isClickOutsideButton) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // ✅ State for selected brands (max 3) and models
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [models, setModels] = useState<{ [brand: string]: string[] }>({});
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [yearRange, setYearRange] = useState({ from: "", to: "" });
  const [mileageRange, setMileageRange] = useState({ min: "", max: "" });

  // Fuel Type State & Logic
const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(["All"]);
const [fuelDropdownOpen, setFuelDropdownOpen] = useState(false);
const fuelRef = useRef<HTMLDivElement>(null);

const toggleFuelOption = (option: string) => {
  setSelectedFuelTypes((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

// Transmission State & Logic
const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(["All"]);
const [transmissionDropdownOpen, setTransmissionDropdownOpen] = useState(false);
const transmissionRef = useRef<HTMLDivElement>(null);

const toggleTransmissionOption = (option: string) => {
  setSelectedTransmissions((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleLanguage = () => {
  const newLang = lang === "sq" ? "en" : "sq";
  setLang(newLang);
  localStorage.setItem("lang", newLang); // ✅ Save choice
};

useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);


// Click Outside to Close Dropdowns
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (fuelRef.current && !fuelRef.current.contains(event.target as Node)) {
      setFuelDropdownOpen(false);
    }
    if (transmissionRef.current && !transmissionRef.current.contains(event.target as Node)) {
      setTransmissionDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  // ✅ Handle Brand Selection (Allow up to 3)
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        // ✅ Remove the brand
        const updatedBrands = prev.filter((b) => b !== brand);
        setModels((prevModels) => {
          const updatedModels = { ...prevModels };
          delete updatedModels[brand];
          return updatedModels;
        });

        // ✅ Also remove models from the deselected brand
        setSelectedModels((prevModels) =>
          prevModels.filter((model) => !models[brand]?.includes(model))
        );

        return updatedBrands;
      } else {
        // ✅ Add brand if less than 3 selected
        if (prev.length < 3) {
          const updatedBrands = [...prev, brand];

          // ✅ Fetch models for the brand
          const modelsData = carBrandsAndModels[brand];

          const allModels = Array.isArray(modelsData) 
            ? modelsData 
            : Object.values(modelsData).flat();

          setModels((prevModels) => ({ ...prevModels, [brand]: allModels }));
          return updatedBrands;
        }
      }
      return prev;
    });
  };

  // ✅ Handle Model Selection (Allow deselecting models)
  const handleModelChange = (model: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(model)) {
        return prev.filter((m) => m !== model);
      }
      return [...prev, model];
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
         <img src="/Logo.png" alt="AlbAutos Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AlbAutos</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {/* ✅ Language Toggle */}
  <div className="flex items-center space-x-2">
  <span className="text-sm font-medium">{lang === "sq" ? "ALB" : "ENG"}</span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={lang === "en"}
      onChange={toggleLanguage}
    />
    <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></span>
  </label>
  <span className="text-sm font-medium">{lang === "sq" ? "Shqip" : "English"}</span>
</div>

          <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</a>
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

       {/* Mobile Navigation with Language Toggle */}
<div className="md:hidden flex items-center space-x-3">
  {/* Language Toggle with Label */}
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium">{lang === "sq" ? "ALB" : "ENG"}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={lang === "en"}
        onChange={toggleLanguage}
      />
      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></span>
    </label>
  </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button ref={hamburgerRef} onClick={() => setMenuOpen(prev => !prev)} className="text-gray-700 text-2xl">☰</button>
        </div>
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

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 mt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{translations[lang].findCar}</h2>

       {/* Filters Section - Organized into 3 Columns */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">

{/* Select Brand (Allow up to 3) */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].brand}</label>
  <select 
    className="w-full border rounded-lg p-2" 
    onChange={(e) => handleBrandChange(e.target.value)} 
    value=""
  >
    <option value="">{translations[lang].selectBrand}</option>
    {Object.keys(carBrandsAndModels).map((brand) => (
      <option key={brand} value={brand}>
        {selectedBrands.includes(brand) ? `✔️ ${brand}` : brand}
      </option>
    ))}
  </select>

  <div className="mt-2 text-gray-700 font-medium">
        {selectedBrands.map((brand) => (
          <span
            key={brand}
            className="bg-blue-200 text-blue-800 px-2 py-1 rounded-lg mr-2 cursor-pointer"
            onClick={() => handleBrandChange(brand)} // ✅ Deselect on click
          >
            {brand} ✔️
          </span>
        ))}
      </div>
</div>

{/* Select Model */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].model}</label>
  <select 
    className="w-full border rounded-lg p-2" 
    disabled={selectedBrands.length === 0 || Object.keys(models).length === 0}
    onChange={(e) => handleModelChange(e.target.value)}
    value=""
  >
    <option value="">{translations[lang].selectModel}</option>
    {selectedBrands.map((brand) => (
      <optgroup key={brand} label={brand}>
        {models[brand]?.map((model) => (
          <option key={model} value={model}>
            {selectedModels.includes(model) ? `✔️ ${model}` : model}
          </option>
        ))}
      </optgroup>
    ))}
  </select>

  {/* Show selected models */}
  <div className="mt-2 text-gray-700 font-medium">
        {selectedModels.map((model) => (
          <span
            key={model}
            className="bg-green-200 text-green-800 px-2 py-1 rounded-lg mr-2 cursor-pointer"
            onClick={() => handleModelChange(model)} // ✅ Deselect model on click
          >
            {model} ✔️
          </span>
        ))}
      </div>
</div>

{/* Price Range */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].price}</label>
  <div className="flex space-x-2">
    <input type="number" placeholder="Min" min="1" className="w-full border rounded-lg p-2 text-center"
      value={priceRange.min}
      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
    />
    <input
  type="number"
  placeholder="Max"
  className="w-full border rounded-lg p-2 text-center"
  value={priceRange.max}
  onChange={(e) => {
    const raw = e.target.value;
    const num = Number(raw);
    setPriceRange({
      ...priceRange,
      max: raw === "" ? "" : Math.max(1, num).toString(),
    });
  }}
/>

  </div>
</div>

{/* Year Range */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].year}</label>
  <div className="flex space-x-2">
    <input type="number" placeholder={translations[lang].yearFrom} min="1900" className="w-full border rounded-lg p-2 text-center"
      value={yearRange.from}
      onChange={(e) => setYearRange({ ...yearRange, from: e.target.value })}
    />
   <input
  type="number"
  placeholder={translations[lang].yearTo}
  className="w-full border rounded-lg p-2 text-center"
  value={yearRange.to}
  onChange={(e) => {
    const raw = e.target.value;

    // ✅ Allow clearing
    if (raw === "") {
      setYearRange({ ...yearRange, to: "" });
      return;
    }

    const num = Number(raw);

    // ✅ Allow only positive numbers (> 0)
    if (!isNaN(num) && num > 0) {
      setYearRange({ ...yearRange, to: num.toString() });
    }
  }}
/>

  </div>
</div>

{/* Mileage Range */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].mileage}</label>
  <div className="flex space-x-2">
    <input type="number" placeholder="Min" min="0" className="w-full border rounded-lg p-2 text-center"
      value={mileageRange.min}
      onChange={(e) => setMileageRange({ ...mileageRange, min: e.target.value })}
    />
    <input
  type="number"
  placeholder="Max"
  className="w-full border rounded-lg p-2 text-center"
  value={mileageRange.max}
  onChange={(e) => {
    const raw = e.target.value;
    const num = Number(raw);
    setMileageRange({
      ...mileageRange,
      max: raw === "" ? "" : Math.max(0, num).toString(),
    });
  }}
/>

  </div>
</div>

{/* Fuel Type */}
<div className="flex flex-col relative mt-6 sm:mt-0" ref={fuelRef}>
  <label className="block text-gray-700 font-medium mb-1 sm:mb-0">
    {translations[lang].fuel}
  </label>
  <button
    onClick={() => setFuelDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 py-3 bg-white relative mt-0"
  >
    {translations[lang].fuel}:{" "}
    {selectedFuelTypes
      .map((f) => translations[lang].fuelOptions[
        translations.en.fuelOptions.indexOf(f)
      ])
      .join(", ")}
  </button>

  {fuelDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.fuelOptions.map((fuel, idx) => {
        const translatedFuel = translations[lang].fuelOptions[idx];
        return (
          <div
            key={fuel}
            onClick={() => toggleFuelOption(fuel)}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedFuelTypes.includes(fuel)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedFuelTypes.includes(fuel)
              ? `✔️ ${translatedFuel}`
              : translatedFuel}
          </div>
        );
      })}
    </div>
  )}
</div>

{/* Transmission */}
<div className="flex flex-col relative mt-6 sm:mt-0" ref={transmissionRef}>
  <label className="block text-gray-700 font-medium mb-1 sm:mb-0">
    {translations[lang].transmission}
  </label>
  <button
    onClick={() => setTransmissionDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 py-3 bg-white relative mt-0"
  >
    {translations[lang].transmission}:{" "}
{selectedTransmissions
  .map((t) => {
    const idx = translations.en.transmissionOptions.indexOf(t);
    return translations[lang].transmissionOptions[idx];
  })
  .join(", ")}

  </button>

  {transmissionDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.transmissionOptions.map((trans, idx) => {
        const translated = translations[lang].transmissionOptions[idx];
        return (
          <div
            key={trans}
            onClick={() => toggleTransmissionOption(trans)} // ✅ Store EN value
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedTransmissions.includes(trans)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedTransmissions.includes(trans) ? `✔️ ${translated}` : translated}
          </div>
        );
      })}
    </div>
  )}
</div>

</div>


{/* Buttons */}
<div className="mt-6 w-full max-w-2xl flex flex-col space-y-4">
<button
onClick={() => navigate("/advanced-search")}
className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition text-lg"
>
{translations[lang].advancedSearch}
</button>
<button
  onClick={() => {
    const queryParams = new URLSearchParams();
  
    if (selectedBrands.length > 0 && selectedBrands[0] !== "All") {
      queryParams.append("brand", selectedBrands[0]); // ✅ backend expects `brand`
    }
  
    if (selectedModels.length > 0 && selectedModels[0] !== "All") {
      queryParams.append("model", selectedModels[0]); // ✅ backend expects `model`
    }
  
    if (priceRange.min) queryParams.append("minPrice", priceRange.min);
    if (priceRange.max) queryParams.append("maxPrice", priceRange.max);
  
    if (yearRange.from) queryParams.append("minYear", yearRange.from); // ✅ backend expects `minYear`
    if (yearRange.to) queryParams.append("maxYear", yearRange.to);     // ✅ backend expects `maxYear`
  
    if (mileageRange.min) queryParams.append("minMileage", mileageRange.min);
    if (mileageRange.max) queryParams.append("maxMileage", mileageRange.max);
  
    if (!selectedFuelTypes.includes("All")) {
      queryParams.append("fuel", selectedFuelTypes[0]); // ✅ backend expects `fuel`
    }
  
    if (!selectedTransmissions.includes("All")) {
      queryParams.append("transmission", selectedTransmissions[0]); // ✅ backend expects `transmission`
    }
  
    navigate(`/carads?${queryParams.toString()}`);
  }}
  
  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg text-lg shadow-md transition"
>
  🔍 {translations[lang].searchCars}
</button>
</div>
</div>
</div>
);
}