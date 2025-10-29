import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { carBrandsAndModels } from "./cardata"; // ✅ Import car data
import qs from "qs";
import { translations } from "./translations";



export default function AdvancedSearch() {
   const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [yearRange, setYearRange] = useState({ min: "", max: "" });
  const [mileageRange, setMileageRange] = useState({ min: "", max: "" });
  const [powerHPRange, setPowerHPRange] = useState({ min: "", max: "" });
  const [powerKWRange, setPowerKWRange] = useState({ min: "", max: "" });
  const [location, setLocation] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const yearMaxRef = useRef(yearRange.max);

useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);

  useEffect(() => {
    yearMaxRef.current = yearRange.max;
  }, [yearRange.max]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  // ✅ Detect token on initial render
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

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

  // ✅ Multi-Select Dropdown States
const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(["All"]);
const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(["All"]);
const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(["All"]);
const [selectedSeatCounts, setSelectedSeatCounts] = useState<string[]>(["All"]);
const [selectedDoorCounts, setSelectedDoorCounts] = useState<string[]>(["All"]);
const [selectedExteriorColors, setSelectedExteriorColors] = useState<string[]>(["All"]);
const [selectedInteriorColors, setSelectedInteriorColors] = useState<string[]>(["All"]);
const [selectedUpholsteries, setSelectedUpholsteries] = useState<string[]>(["All"]);

// Dropdown States
const [fuelDropdownOpen, setFuelDropdownOpen] = useState(false);
const [transmissionDropdownOpen, setTransmissionDropdownOpen] = useState(false);
const [bodyTypeDropdownOpen, setBodyTypeDropdownOpen] = useState(false);
const [seatCountDropdownOpen, setSeatCountDropdownOpen] = useState(false);
const [doorCountDropdownOpen, setDoorCountDropdownOpen] = useState(false);
const [exteriorColorDropdownOpen, setExteriorColorDropdownOpen] = useState(false);
const [interiorColorDropdownOpen, setInteriorColorDropdownOpen] = useState(false);
const [upholsteryDropdownOpen, setUpholsteryDropdownOpen] = useState(false);

// Dropdown Refs (for click outside logic)
const fuelRef = useRef<HTMLDivElement>(null);
const transmissionRef = useRef<HTMLDivElement>(null);
const bodyTypeRef = useRef<HTMLDivElement>(null);
const seatCountRef = useRef<HTMLDivElement>(null);
const doorCountRef = useRef<HTMLDivElement>(null);
const exteriorColorRef = useRef<HTMLDivElement>(null);
const interiorColorRef = useRef<HTMLDivElement>(null);
const upholsteryRef = useRef<HTMLDivElement>(null);

const toggleFuelOption = (option: string) => {
  setSelectedFuelTypes((prev) => {
    if (option === "All") return ["All"];

    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];

    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};
const toggleTransmissionOption = (option: string) => {
  setSelectedTransmissions((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleBodyTypeOption = (option: string) => {
  setSelectedBodyTypes((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleSeatCountOption = (option: string) => {
  setSelectedSeatCounts((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleDoorCountOption = (option: string) => {
  setSelectedDoorCounts((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleExteriorColorOption = (option: string) => {
  setSelectedExteriorColors((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleInteriorColorOption = (option: string) => {
  setSelectedInteriorColors((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

const toggleUpholsteryOption = (option: string) => {
  setSelectedUpholsteries((prev) => {
    if (option === "All") return ["All"];
    const newSelection = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev.filter((item) => item !== "All"), option];
    return newSelection.length === 0 ? ["All"] : newSelection;
  });
};

// ✅ Step 2: Ref and click outside logic
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (fuelRef.current && !fuelRef.current.contains(event.target as Node)) {
      setFuelDropdownOpen(false);
    }
    if (transmissionRef.current && !transmissionRef.current.contains(event.target as Node)) {
      setTransmissionDropdownOpen(false);
    }
    if (bodyTypeRef.current && !bodyTypeRef.current.contains(event.target as Node)) {
      setBodyTypeDropdownOpen(false);
    }
    if (seatCountRef.current && !seatCountRef.current.contains(event.target as Node)) {
      setSeatCountDropdownOpen(false);
    }
    if (doorCountRef.current && !doorCountRef.current.contains(event.target as Node)) {
      setDoorCountDropdownOpen(false);
    }
    if (exteriorColorRef.current && !exteriorColorRef.current.contains(event.target as Node)) {
      setExteriorColorDropdownOpen(false);
    }
    if (interiorColorRef.current && !interiorColorRef.current.contains(event.target as Node)) {
      setInteriorColorDropdownOpen(false);
    }
    if (upholsteryRef.current && !upholsteryRef.current.contains(event.target as Node)) {
      setUpholsteryDropdownOpen(false);
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
        const updatedBrands = prev.filter((b) => b !== brand);
        setModels((prevModels) => {
          const updatedModels = { ...prevModels };
          delete updatedModels[brand];
          return updatedModels;
        });

        // Remove models from deselected brand
        setSelectedModels((prevModels) =>
          prevModels.filter((model) => !models[brand]?.includes(model))
        );

        return updatedBrands;
      } else {
        if (prev.length < 3) {
          const updatedBrands = [...prev, brand];
          const modelsData = carBrandsAndModels[brand];
          const allModels = Array.isArray(modelsData) ? modelsData : Object.values(modelsData).flat();

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
      
  
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center relative">
  <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">
    {translations[lang].home}
  </button>
  <button onClick={() => navigate("/sellyourcar")} className="text-gray-700 hover:text-blue-500 font-medium">
    {translations[lang].sellYourCar}
  </button>

  {isLoggedIn ? (
  <div className="relative">
    <button
      onClick={() => setShowOptions((prev) => !prev)}
      className="text-gray-700 hover:text-blue-500 font-medium"
    >
      {translations[lang].myAccount} ▾
    </button>

    {showOptions && (
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
        <button
          onClick={() => {
            navigate("/myaccount");
            setShowOptions(false);
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
        >
          {translations[lang].myAccount}
        </button>
        <button
          onClick={() => {
            handleLogout();
            setShowOptions(false);
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
        >
          {translations[lang].logOut}
        </button>
      </div>
    )}
  </div>
) : (
  <button
    onClick={() => navigate("/login")}
    className="text-gray-700 hover:text-blue-500 font-medium"
  >
    {translations[lang].logIn}
  </button>
)}
</div>
  
  
         {/* Mobile Navigation with Language Toggle */}
<div className="md:hidden flex items-center space-x-3">
 

  {/* Hamburger */}
  <button
    ref={hamburgerRef}
    onClick={() => setMenuOpen((prev) => !prev)}
    className="text-gray-700 text-2xl"
  >
    ☰
  </button>
</div>
      </nav>
  
      {/* Mobile Menu */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden bg-white shadow-md py-5 flex flex-col items-center space-y-4 fixed top-16 left-0 w-full z-50">
          <button onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          <button onClick={() => {
            navigate("/sellyourcar");
            setMenuOpen(false);
          }} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].sellYourCar}</button>
          {isLoggedIn ? (
            <>
              <button onClick={() => {
                navigate("/myaccount");
                setMenuOpen(false);
              }} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].myAccount}</button>
              <button onClick={() => {
                localStorage.removeItem("token");
                setMenuOpen(false);
                navigate("/");
                window.location.reload();
              }} className="text-red-600 hover:text-red-700 font-medium">{translations[lang].logOut}</button>
            </>
          ) : (
            <button onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].logIn}</button>
          )}
        </div>
      )}
      
       {/* Main Content */}
        <div className="flex flex-col items-center mt-20 px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{translations[lang].advancedSearch}</h2>

          {/* Centered Brand & Model */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mb-6">
    {/* Select Brand (Allow up to 3) */}
    <div className="flex flex-col">
      <label className="block text-gray-700 font-medium mb-1">{translations[lang].brand}</label>
      <select
        className="w-full border rounded-lg p-2"
        onChange={(e) => handleBrandChange(e.target.value)}
        value=""
      >
        <option value="">Select a brand</option>
        {Object.keys(carBrandsAndModels).map((brand) => (
          <option key={brand} value={brand}>
            {selectedBrands.includes(brand) ? `✔️ ${brand}` : brand}
          </option>
        ))}
      </select>

      {/* Show selected brands */}
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
        <option value="">Select a model</option>
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
  </div>

  {/* Filters Section - Improved Spacing & Symmetry */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
    
    {/* Price Range */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].price}(€)</label>
  <div className="flex space-x-2">
    <input
      type="number"
      placeholder="Min"
      min="1"
      className="w-full border rounded-lg p-2 text-center"
      value={priceRange.min}
      onChange={(e) =>
        setPriceRange({ ...priceRange, min: e.target.value })
      }
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
{/* Mileage Range */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].mileage}</label>
  <div className="flex space-x-2">
    <input
      type="number"
      placeholder="Min"
      min="0"
      className="w-full border rounded-lg p-2 text-center"
      value={mileageRange.min}
      onChange={(e) =>
        setMileageRange({ ...mileageRange, min: e.target.value })
      }
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
{/* Power (HP) */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].powerHP}</label>
  <div className="flex space-x-2">
    <input
      type="number"
      placeholder="Min"
      min="1"
      className="w-full border rounded-lg p-2 text-center"
      value={powerHPRange.min}
      onChange={(e) =>
        setPowerHPRange({ ...powerHPRange, min: e.target.value })
      }
    />
    <input
      type="number"
      placeholder="Max"
      className="w-full border rounded-lg p-2 text-center"
      value={powerHPRange.max}
      onChange={(e) => {
        const raw = e.target.value;
        const num = Number(raw);
        setPowerHPRange({
          ...powerHPRange,
          max: raw === "" ? "" : Math.max(1, num).toString(),
        });
      }}
    />
  </div>
</div>
{/* Power (kW) */}
<div className="flex flex-col">
  <label className="block text-gray-700 font-medium mb-1">{translations[lang].powerKW}</label>
  <div className="flex space-x-2">
    <input
      type="number"
      placeholder="Min"
      min="1"
      className="w-full border rounded-lg p-2 text-center"
      value={powerKWRange.min}
      onChange={(e) =>
        setPowerKWRange({ ...powerKWRange, min: e.target.value })
      }
    />
    <input
      type="number"
      placeholder="Max"
      className="w-full border rounded-lg p-2 text-center"
      value={powerKWRange.max}
      onChange={(e) => {
        const raw = e.target.value;
        const num = Number(raw);
        setPowerKWRange({
          ...powerKWRange,
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
    <input
      type="number"
      placeholder={translations[lang].yearFrom}
      min="1900"
      className="w-full border rounded-lg p-2 text-center"
      value={yearRange.min}
      onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
    />
    <input
  type="number"
  placeholder={translations[lang].yearTo}
  min="1900"
  className="w-full border rounded-lg p-2 text-center"
  value={yearRange.max}
  onChange={(e) => {
    const raw = e.target.value;

    // Let the user clear the input
    if (raw === "") {
      setYearRange({ ...yearRange, max: "" });
    } else {
      setYearRange({ ...yearRange, max: raw });
    }
  }}
/>
  </div>
</div>

    {/* Fuel Type */}
<div className="flex flex-col space-y-2 relative" ref={fuelRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].fuel}</label>
  <button
    onClick={() => setFuelDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedFuelTypes
      .map((f) => translations[lang].fuelOptions[translations.en.fuelOptions.indexOf(f)])
      .join(", ")}
  </button>
  {fuelDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.fuelOptions.map((fuel, idx) => {
        const translatedFuel = translations[lang].fuelOptions[idx];
        return (
          <div
            key={fuel}
            onClick={() => toggleFuelOption(fuel)} // ✅ Keep EN key internally
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedFuelTypes.includes(fuel) ? "bg-green-100 text-green-800 font-semibold" : ""
            }`}
          >
            {selectedFuelTypes.includes(fuel) ? `✔️ ${translatedFuel}` : translatedFuel}
          </div>
        );
      })}
    </div>
  )}
</div>
  
    {/* Transmission */}
<div className="flex flex-col space-y-2 relative" ref={transmissionRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].transmission}</label>
  <button
    onClick={() => setTransmissionDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedTransmissions
      .map((t) => translations[lang].transmissionOptions[translations.en.transmissionOptions.indexOf(t)])
      .join(", ")}
  </button>
  {transmissionDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.transmissionOptions.map((trans, idx) => {
        const translatedTrans = translations[lang].transmissionOptions[idx];
        return (
          <div
            key={trans}
            onClick={() => toggleTransmissionOption(trans)} // ✅ Keep EN values internally
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedTransmissions.includes(trans) ? "bg-green-100 text-green-800 font-semibold" : ""
            }`}
          >
            {selectedTransmissions.includes(trans) ? `✔️ ${translatedTrans}` : translatedTrans}
          </div>
        );
      })}
    </div>
  )}
</div>
  
    {/* Body Type */}
<div className="flex flex-col space-y-2 relative" ref={bodyTypeRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].body}</label>
  <button
    onClick={() => setBodyTypeDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedBodyTypes
      .map((b) => translations[lang].bodyTypeOptions[translations.en.bodyTypeOptions.indexOf(b)])
      .join(", ")}
  </button>
  {bodyTypeDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.bodyTypeOptions.map((body, idx) => {
        const translatedBody = translations[lang].bodyTypeOptions[idx];
        return (
          <div
            key={body}
            onClick={() => toggleBodyTypeOption(body)} // ✅ Keep EN value internally
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedBodyTypes.includes(body) ? "bg-green-100 text-green-800 font-semibold" : ""
            }`}
          >
            {selectedBodyTypes.includes(body) ? `✔️ ${translatedBody}` : translatedBody}
          </div>
        );
      })}
    </div>
  )}
</div>

    {/* Seat Count */}
<div className="flex flex-col space-y-2 relative" ref={seatCountRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].seats}</label>
  <button
    onClick={() => setSeatCountDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedSeatCounts
      .map((seat) => translations[lang].seatCountOptions[translations.en.seatCountOptions.indexOf(seat)])
      .join(", ")}
  </button>

  {seatCountDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.seatCountOptions.map((seat, idx) => {
        const translatedSeat = translations[lang].seatCountOptions[idx];
        return (
          <div
            key={seat}
            onClick={() => toggleSeatCountOption(seat)} // ✅ Store EN value
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedSeatCounts.includes(seat)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedSeatCounts.includes(seat) ? `✔️ ${translatedSeat}` : translatedSeat}
          </div>
        );
      })}
    </div>
  )}
</div>

    {/* Door Count */}
<div className="flex flex-col space-y-2 relative" ref={doorCountRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].doors}</label>
  <button
    onClick={() => setDoorCountDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedDoorCounts
      .map((door) => translations[lang].doorCountOptions[translations.en.doorCountOptions.indexOf(door)])
      .join(", ")}
  </button>

  {doorCountDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.doorCountOptions.map((door, idx) => {
        const translatedDoor = translations[lang].doorCountOptions[idx];
        return (
          <div
            key={door}
            onClick={() => toggleDoorCountOption(door)} // ✅ Store EN value
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedDoorCounts.includes(door)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedDoorCounts.includes(door) ? `✔️ ${translatedDoor}` : translatedDoor}
          </div>
        );
      })}
    </div>
  )}
</div>

    {/* Exterior Color */}
<div className="flex flex-col space-y-2 relative" ref={exteriorColorRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].exteriorColor}</label>
  <button
    onClick={() => setExteriorColorDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedExteriorColors
      .map((color) => translations[lang].exteriorColorOptions[translations.en.exteriorColorOptions.indexOf(color)])
      .join(", ")}
  </button>

  {exteriorColorDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.exteriorColorOptions.map((color, idx) => {
        const translatedColor = translations[lang].exteriorColorOptions[idx];
        return (
          <div
            key={color}
            onClick={() => toggleExteriorColorOption(color)} // ✅ Store EN value
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedExteriorColors.includes(color)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedExteriorColors.includes(color) ? `✔️ ${translatedColor}` : translatedColor}
          </div>
        );
      })}
    </div>
  )}
</div>

{/* Interior Color */}
<div className="flex flex-col space-y-2 relative" ref={interiorColorRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].interiorColor}</label>
  <button
    onClick={() => setInteriorColorDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedInteriorColors
      .map((color) => translations[lang].interiorColorOptions[translations.en.interiorColorOptions.indexOf(color)])
      .join(", ")}
  </button>

  {interiorColorDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.interiorColorOptions.map((color, idx) => {
        const translatedColor = translations[lang].interiorColorOptions[idx];
        return (
          <div
            key={color}
            onClick={() => toggleInteriorColorOption(color)} // ✅ Store EN value
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedInteriorColors.includes(color)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedInteriorColors.includes(color) ? `✔️ ${translatedColor}` : translatedColor}
          </div>
        );
      })}
    </div>
  )}
</div>

    {/* Upholstery */}
<div className="flex flex-col space-y-2 relative" ref={upholsteryRef}>
  <label className="block text-gray-700 font-medium">{translations[lang].upholstery}</label>
  <button
    onClick={() => setUpholsteryDropdownOpen((prev) => !prev)}
    className="w-full border rounded-lg p-2 bg-white"
  >
    {selectedUpholsteries
      .map((u) => translations[lang].upholsteryOptions[translations.en.upholsteryOptions.indexOf(u)])
      .join(", ")}
  </button>

  {upholsteryDropdownOpen && (
    <div className="absolute left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 w-full max-h-60 overflow-y-auto">
      {translations.en.upholsteryOptions.map((u, idx) => {
        const translatedU = translations[lang].upholsteryOptions[idx];
        return (
          <div
            key={u}
            onClick={() => toggleUpholsteryOption(u)} // ✅ Store EN value
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedUpholsteries.includes(u)
                ? "bg-green-100 text-green-800 font-semibold"
                : ""
            }`}
          >
            {selectedUpholsteries.includes(u) ? `✔️ ${translatedU}` : translatedU}
          </div>
        );
      })}
    </div>
  )}
</div>

  </div>

    {/* Location - Centered Above Extra Options */}
  <div className="flex flex-col items-center w-full">
  <label className="block text-gray-700 font-medium">{translations[lang].location}</label>
  <input
  type="text"
  placeholder={translations[lang].enterLocation}
  className="w-full max-w-md border rounded-lg p-2"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  />
</div>


        {/* Extra Options Button */}
<div className="mt-6 flex justify-center w-1/3 mx-auto ">
  <button
    onClick={() => setShowExtraOptions(!showExtraOptions)}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition text-lg"
  >
    {showExtraOptions 
      ? translations[lang].hideExtraOptions 
      : translations[lang].showExtraOptions}
  </button>
</div>


        {/* Extra Options Section */}
        {showExtraOptions && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-200 w-full max-w-5xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Options</h3>

            {[
              { title: "🔒 Safety and Security", options: [
                "Front Sensors", "Back Sensors", "Side Sensors", "Front Camera", "Side Camera", "Back Camera", "360 Camera", 
                "Night Vision", "Blind Spot Monitoring", "Emergency Braking", "Park Assist", "Cruise Control", "Lane Assist", 
                "Speed Limiter", "ABS", "ESP", "Auto Hold", "Driver Drowsiness Detection", "High Beam Assist", 
                "Glare-Free High Beam Headlights", "ISOFIX", "Electric Stability Control"
              ]},
              { title: "🛋️ Comfort and Convenience", options: [
                "Air Conditioner", "Air Suspension", "Heated Seats", "Ventilated Seats", "Seat Massage", "Memory Seats", 
                "Leather Seats", "Sunroof", "Keyless Go", "Start/Stop Button", "Electrically Adjustable Front Seats", 
                "Electrically Adjustable Back Seats", "Electronic Parking Brake", "Power Steering", "Power Windows", 
                "Adjustable Suspension", "Four-Wheel Drive", "Rear-Wheel Drive", "Front-Wheel Drive", "Sliding Door Right", 
                "Sliding Door Left", "Sliding Doors Both", "Heated Steering Wheel", "Heated Mirrors", "Headlight Washer System", 
                "Wooden Steering Wheel"
              ]},
              { title: "🎵 Entertainment and Media", options: [
                "Bluetooth", "CD Player", "Radio", "Android Auto", "Apple CarPlay", "Hands-Free Equipment", "Voice Control", 
                "Heads-Up Display", "Navigation System", "Traffic Sign Recognition", "Touch Screen", "Television", "MP3", 
                "USB Port", "USB-C Port", "Touch Charger for Smartphone"
              ]},
              { title: "⚙️ Extras", options: [
                "Cargo Barrier", "Tow Hook", "Aluminium Wheels", "Steel Wheels", "Sport Seats", "Panorama Roof", "Daytime Running Lights", 
                "Foldable Passenger Seats", "Summer Tires", "Winter Tires", "All-Season Tires", "Smokers Package", "Sport Suspension", 
                "Downhill Assist", "Tinted Windows", "Curtains", "Shift Paddles", "Auto-Dimming Interior Mirror", "E-Active Body Control", 
                "Back Fridge", "Carbon Ceramic Brakes", "Ventilated Brakes", "Child Seats", "Long Wheel Base"
              ]}
            ].map((section, index) => (
              <div key={index} className="mt-4">
                <h4 className="text-md font-bold text-gray-800">{section.title}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {section.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={selectedOptions.includes(option)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (e.target.checked) {
                            setSelectedOptions([...selectedOptions, value]);
                          } else {
                            setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
                          }
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> 
      
  <div className="mt-6 flex justify-center">
    <button
  onClick={() => {
     if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur(); // force React to update state from input
    }
    const queryParams: any = {};

if (selectedBrands.length > 0) queryParams.brand = selectedBrands[0];
if (selectedModels.length > 0) queryParams.model = selectedModels[0];

// --- Price ---
  if (priceRange.min) queryParams.minPrice = priceRange.min;
  if (priceRange.max && Number(priceRange.max) >= 1) {
    queryParams.maxPrice = priceRange.max;
  } else if (priceRange.max) {
    queryParams.maxPrice = "-1"; // force no match if invalid
  }

  // --- Year ---
  if (yearRange.min) queryParams.minYear = yearRange.min;
  if (yearRange.max && Number(yearRange.max) >= 1900) {
    queryParams.maxYear = yearRange.max;
  } else if (yearRange.max) {
    queryParams.maxYear = "-1";
  }

  // --- Mileage ---
  if (mileageRange.min) queryParams.minMileage = mileageRange.min;
  if (mileageRange.max && Number(mileageRange.max) >= 0) {
    queryParams.maxMileage = mileageRange.max;
  } else if (mileageRange.max) {
    queryParams.maxMileage = "-1";
  }

  // --- Power HP ---
  if (powerHPRange.min) queryParams.minPowerHP = powerHPRange.min;
  if (powerHPRange.max && Number(powerHPRange.max) >= 1) {
    queryParams.maxPowerHP = powerHPRange.max;
  } else if (powerHPRange.max) {
    queryParams.maxPowerHP = "-1";
  }

  // --- Power kW ---
  if (powerKWRange.min) queryParams.minPowerKW = powerKWRange.min;
  if (powerKWRange.max && Number(powerKWRange.max) >= 1) {
    queryParams.maxPowerKW = powerKWRange.max;
  } else if (powerKWRange.max) {
    queryParams.maxPowerKW = "-1";
  }


if (!selectedFuelTypes.includes("All")) queryParams.fuel = selectedFuelTypes[0];
if (!selectedTransmissions.includes("All")) queryParams.transmission = selectedTransmissions[0];
if (!selectedBodyTypes.includes("All")) queryParams.body = selectedBodyTypes[0];
if (!selectedSeatCounts.includes("All")) queryParams.seatCount = selectedSeatCounts;
if (!selectedDoorCounts.includes("All")) queryParams.doorCount = selectedDoorCounts;

if (!selectedExteriorColors.includes("All")) queryParams.exteriorColor = selectedExteriorColors[0];
if (!selectedInteriorColors.includes("All")) queryParams.interiorColor = selectedInteriorColors[0];
if (!selectedUpholsteries.includes("All")) queryParams.upholstery = selectedUpholsteries[0];
if (location) queryParams.location = location;

if (selectedOptions.length > 0) queryParams.options = selectedOptions;

console.log("Navigating to:", qs.stringify(queryParams, { arrayFormat: "repeat" }));
console.log("params before stringify:", queryParams);
console.log("final URL:", qs.stringify(queryParams, { arrayFormat: "repeat" }));
console.log("queryParams object:", queryParams);
console.log("yearRange.max (raw string):", yearRange.max);
console.log("maxYear being sent:", queryParams.maxYear);


navigate(`/carads?${qs.stringify(queryParams, { arrayFormat: "repeat"})}`);

  }}
  className="px-16 py-5 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition text-lg"
>
  🔍 {translations[lang].searchCars}
</button>


  </div>
    </div>
    
  );
  }
  