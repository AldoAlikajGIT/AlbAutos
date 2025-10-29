import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { carBrandsAndModels } from "./cardata";
import { filterOptions } from "./dropdownFilters";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { translations } from "./translations";
import AccountDropdown from "./AccountDropdown";

interface DecodedToken {
  sub: string; // or 'email' if you use a custom claim
  [key: string]: any;
}

export default function SellYourCar() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleRemoveImage = (index: number) => {
  setImages((prev) => {
    const updated = [...prev];
    updated.splice(index, 1);
    return updated;
  });

  // 🔄 Reset file input so it reflects the updated state immediately
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};
// ✅ Validate image types you accept
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
]);

// ✅ Re-usable compression function
async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,            // ~1MB target
    maxWidthOrHeight: 1920,  // resize if larger
    useWebWorker: true,
    initialQuality: 0.8,     // starting point; lib adjusts if needed
    fileType: file.type === "image/heic" ? "image/jpeg" : undefined, // simple HEIC fallback
  };
  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (err) {
    console.warn("Compression failed, falling back to original:", file.name, err);
    return file; // fail-safe
  }
}

useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
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
  
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [models, setModels] = useState<{ [brand: string]: string[] }>({});
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const [carDetails, setCarDetails] = useState({
    brand: "",
    model: "",
    price: "",
    year: "",
    powerHP: "",
    powerKW: "",
    doorCount: "",
    seatCount: "",
    fuel: "",
    exteriorColor: "",
    interiorColor: "",
    upholstery: "",
    body: "",
    mileageKm: "",
    consumptionLPerKm: "",
    location: "",
    imageUrls: [],
    options: [] as string[],
    description: "",
  });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  // ✅ Power (HP) change
  if (name === "powerHP") {
    const hp = value;
    setCarDetails(prev => ({
      ...prev,
      powerHP: hp,
      powerKW: hp ? Math.round(parseFloat(hp) * 0.7355).toString() : ""
    }));
    return;
  }

  // ✅ Power (kW) change
  if (name === "powerKW") {
    const kw = value;
    setCarDetails(prev => ({
      ...prev,
      powerKW: kw,
      powerHP: kw ? Math.round(parseFloat(kw) / 0.7355).toString() : ""
    }));
    return;
  }

  if (name === "bodyType") {
  setCarDetails(prev => ({
    ...prev,
    bodyType: value,
    body: value, // keep backend field in sync
  }));
  return;
}


  // ✅ Default case for all other fields
  setCarDetails({ ...carDetails, [name]: value });
};

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCarDetails((prev) => ({
      ...prev,
      options: checked
        ? [...prev.options, value]
        : prev.options.filter((opt) => opt !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitted"); // 🔍 Check if this prints
    // Set the brand and model before validation
    const brand = selectedBrands[0] || "";
    const model = selectedModels[0] || "";
  
    const fullCarDetails = {
      ...carDetails,
      brand,
      model,
      interiorColor: carDetails.interiorColor.trim() === "" ? null : carDetails.interiorColor,
      upholstery: carDetails.upholstery.trim() === "" ? null : carDetails.upholstery,
      description: carDetails.description.trim() === "" ? null : carDetails.description, 
      consumptionLPerKm: String(carDetails.consumptionLPerKm).trim() === "" ? null : carDetails.consumptionLPerKm, 

    };
  
    for (const key in fullCarDetails) {
  if (
    key !== "Options" &&
    key !== "interiorColor" && 
    key !== "upholstery" && 
    key !== "description" &&
    key !== "consumptionLPerKm" &&
    !fullCarDetails[key as keyof typeof fullCarDetails]
  ) {
    alert(`Please fill in all required fields: ${key}`);
    return;
  }
}

  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("You must be logged in to submit a car listing.");
        return;
      }
  
      // Decode token to get user email
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("🔍 decoded token", decoded); // ⬅️ Add this!
      const email = decoded.sub; // If your token uses a custom field like `email`, replace with `decoded.email`
  
      const response = await axios.post("http://localhost:8080/api/cars", fullCarDetails, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type manually, axios will default it to application/json
        },
      });

// 2. Extract carAdId from response
const carAdId = response.data.id;

// 3. Upload all images at once to /api/images/upload-multiple/{carAdId}
if (images.length > 0 && carAdId) {
  const fd = new FormData();
  for (const file of images) {
    fd.append("files", file); // plural key matches backend
  }

  try {
    await axios.post(
      `http://localhost:8080/api/images/upload-multiple/${carAdId}`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (err: any) {
    // Show friendly JSON message from GlobalUploadExceptionHandler (413, etc.)
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Image upload failed.";
    alert(`❌ ${msg}`);
    return; // stop if upload fails
  }
}

// 🔁 Refresh the car ad to get updated image URLs
const refreshedAd = await axios.get(`http://localhost:8080/api/cars/${carAdId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log("🖼️ Refreshed ad with images:", refreshedAd.data);

  
      alert("✅ Car ad submitted successfully!");
      console.log(response.data);
      navigate("/myaccount");
    } catch (error) {
      console.error("❌ Error submitting car ad:", error);
      alert("An error occurred while submitting your car listing.");
    }
  };
  

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      // If brand is already selected, remove it and clear dependent values
      setSelectedBrands([]);
      setModels({});
      setSelectedModels([]);
      setCarDetails((prev) => ({ ...prev, brand: "", model: "" }));
    } else {
      // Otherwise, set the new brand and load its models
      setSelectedBrands([brand]);
      const modelsData = carBrandsAndModels[brand];
      const allModels = Array.isArray(modelsData)
        ? modelsData
        : Object.values(modelsData).flat();
  
      setModels({ [brand]: allModels });
      setSelectedModels([]);
      setCarDetails((prev) => ({ ...prev, brand, model: "" }));
    }
  };
  
  
  const handleModelChange = (model: string) => {
    if (selectedModels.includes(model)) {
      // If model is already selected, remove it and reset car details
      setSelectedModels([]);
      setCarDetails((prev) => ({ ...prev, model: "" }));
    } else {
      // Otherwise, set the selected model
      setSelectedModels([model]);
      setCarDetails((prev) => ({ ...prev, model }));
    }
  };
  
  
  return (
    <div className="bg-gray-100 min-h-screen">
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

          {/* ✅ Language Toggle */}
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          
          {localStorage.getItem("token") ? (
            <AccountDropdown lang={lang} />
          ) : (
            <button onClick={() => navigate("/login")} className="text-gray-700 hover:text-blue-500 font-medium">
              {translations[lang].logIn}
            </button>
          )}
        </div>
       {/* Mobile Navigation (Hamburger Menu) */}
<div className="md:hidden">
  <button ref={hamburgerRef}
    onClick={() => setMenuOpen((prev) => !prev)} // ← toggles open/close
    className="text-gray-700 text-2xl"
  >
    ☰
  </button>
</div>
      </nav>

      {menuOpen && (
        <div ref={menuRef} className="md:hidden bg-white shadow-md py-5 flex flex-col items-center space-y-4 mt-14 w-full fixed top-5 left-0 z-50">
          <button onClick={() => navigate("/")} className="text-gray-700 hover:text-blue-500 font-medium">{translations[lang].home}</button>
          {isLoggedIn && (
            <button onClick={() => {
              navigate("/myaccount");
              setMenuOpen(false);
            }} className="text-gray-700 hover:text-blue-500 font-medium">
              {translations[lang].myAccount}
            </button>
          )}
          <button
            onClick={() => {
              if (isLoggedIn) {
                localStorage.removeItem("token");
                alert("Logged out");
                setMenuOpen(false);
                navigate("/");
                window.location.reload();
              } else {
                navigate("/login");
                setMenuOpen(false);
              }
            }}
            className={`font-medium ${isLoggedIn ? "text-red-600 hover:text-red-700" : "text-gray-700 hover:text-blue-500"}`}
          >
            {isLoggedIn ? "Log Out" : "Log In"}
          </button>
        </div>
      )}

<div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-20">
  <h2 className="text-2xl font-bold text-center mb-6">{translations[lang].sellYourCar}</h2>

  {/* Display message for validity period */}
  <div className="text-center text-gray-700 mb-6">
    <p className="font-medium">
     {translations[lang].validFor}
    </p>
  </div>

      {/* Check if the user is logged in */}
  {!isLoggedIn && (
    <div className="text-center text-red-600 font-medium mb-6">
      {translations[lang].mustLogin}
    </div>
  )}

    {/* Brand Selection (Select up to 3) */}
    {isLoggedIn && (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
    <div className="flex flex-col">
      <label className="block text-gray-700 font-medium mb-1">{translations[lang].brand}</label>
      <select
        className="w-full border rounded-lg p-2"
        onChange={(e) => handleBrandChange(e.target.value)}
        value=""
      >
        <option value="">{translations[lang].brand}</option>
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
            onClick={() => handleBrandChange(brand)}
          >
            {brand} ✔️
          </span>
        ))}
      </div>
    </div>

    {/* Model Selection */}
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

      <div className="mt-2 text-gray-700 font-medium">
        {selectedModels.map((model) => (
          <span
            key={model}
            className="bg-green-200 text-green-800 px-2 py-1 rounded-lg mr-2 cursor-pointer"
            onClick={() => handleModelChange(model)}
          >
            {model} ✔️
          </span>
        ))}
      </div>
    </div>

    {/* Store brand/model into carDetails for submission */}
    <input type="hidden" name="brand" value={selectedBrands.join(", ")} />
    <input type="hidden" name="model" value={selectedModels.join(", ")} />

    {/* Other fields mapped as usual */}
    {[
      { label: translations[lang].year, name: "year", type: "number", min: "1900", max: "2025" },
      { label: translations[lang].fuel, name: "fuel", type: "select", options: filterOptions.fuelTypes },
      { label: translations[lang].transmission, name: "transmission", type: "select", options: filterOptions.transmissions },
      { label: translations[lang].powerHP, name: "powerHP", type: "number", min: "1" },
      { label: translations[lang].powerKW, name: "powerKW", type: "number", min: "1" },
      { label: translations[lang].mileage, name: "mileageKm", type: "number", min: "0" },
      { label: translations[lang].body, name: "bodyType", type: "select", options: filterOptions.bodyTypes},
      { label: `${translations[lang].consumption} ${translations[lang].optionalLabel}`, name: "consumptionLPerKm", type: "number", step: "0.1", min: "0" },
      { label: translations[lang].doors, name: "doorCount", type: "select", options: filterOptions.doorCounts },
      { label: translations[lang].seats, name: "seatCount", type: "select", options: filterOptions.seatCounts },
      { label: translations[lang].exteriorColor, name: "exteriorColor", type: "select", options: filterOptions.exteriorColors },
      { label: `${translations[lang].interiorColor} ${translations[lang].optionalLabel}`, name: "interiorColor", type: "select", options: filterOptions.interiorColors },
      { label: `${translations[lang].upholstery} ${translations[lang].optionalLabel}`, name: "upholstery", type: "select", options: filterOptions.upholsteries },
      { label: translations[lang].location, name: "location", type: "text" },
      { label: translations[lang].price, name: "price", type: "number", min: "1" },
      { label: `${translations[lang].description} ${translations[lang].optionalLabel}`, name: "description", customType: "textarea", maxLength: 250 }
      
    ].map((field, index) => (
  <div key={index} className="flex flex-col mb-4">
    <label className="block text-gray-700 font-medium mb-1">
      {field.label}
      {field.name === "description" && (
        <span className="text-sm text-gray-500"> (max {field.maxLength} characters)</span>
      )}
    </label>

    {field.customType === "textarea" ? (
      <textarea
        name={field.name}
        value={carDetails[field.name as keyof typeof carDetails]}
        onChange={handleChange}
        maxLength={field.maxLength}
        rows={4}
        placeholder= {translations[lang].descriptionMessage}
        className="w-full border rounded-lg p-2"
        required={field.name !== "description"}
      />
    ) : field.type === "select" ? (
      <select
        name={field.name}
        value={carDetails[field.name as keyof typeof carDetails]}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
         // ✅ Add conditional required here for select
        required={field.name !== "interiorColor" && field.name !== "upholstery" && field.name !== "description" && field.name !== "consumptionLPerKm"}
      >
        {field.options?.map((option, i) => (
  <option key={option} value={option}>
    {(translations[lang] as any)?.[field.name + "Options"]?.[i] || option}
  </option>
))}

      </select>
    ) : (
      <input
        type={field.type}
        name={field.name}
        value={carDetails[field.name as keyof typeof carDetails]}
        onChange={handleChange}
        min={field.min}
        max={field.max}
        step={field.step}
        className="w-full border rounded-lg p-2"
        // ✅ Conditional required for input fields
        required={field.name !== "interiorColor" && field.name !== "upholstery" && field.name !== "description" && field.name !== "consumptionLPerKm"}
      />
    )}
  </div>
))}

    {/* Upload Images */}
    <div className="mt-6">
      <label className="block text-gray-700 font-medium mb-2">{translations[lang].uploadImage}</label>
      <input
  ref={fileInputRef}
  type="file"
  multiple
  accept="image/*"
  className="w-full border p-2 rounded"
  onChange={async (e) => {
  if (!e.target.files) return;

  const picked = Array.from(e.target.files);

  // 🔎 filter unsupported files
  const valid = picked.filter(f => ALLOWED_MIME.has(f.type));
  const rejected = picked.filter(f => !ALLOWED_MIME.has(f.type));
  if (rejected.length) {
    alert(`Some files were skipped (unsupported type): ${rejected.map(r => r.name).join(", ")}`);
  }

  // 🚦 enforce 15 total
  const remainingSlots = Math.max(0, 15 - images.length);
  const toProcess = valid.slice(0, remainingSlots);
  if (valid.length > remainingSlots) {
    alert("You can upload a maximum of 15 images.");
  }
  if (!toProcess.length) {
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  // 🗜️ compress all selected
  const compressedList = await Promise.all(toProcess.map(f => compressImage(f)));

  // ⛔ enforce backend's 5MB limit after compression (avoid 413)
  const finalList = compressedList.filter(f => f.size <= 5 * 1024 * 1024);
  const overLimit = compressedList.filter(f => f.size > 5 * 1024 * 1024);
  if (overLimit.length) {
    alert(`Some images are still > 5MB after compression: ${overLimit.map(f => f.name).join(", ")}`);
  }

  // ✅ add only allowed, non-duplicate files
  // ✅ add only allowed, non-duplicate files
setImages(prev => {
  const existingKeys = new Set(prev.map(f => `${f.name}-${f.size}-${(f as any).lastModified ?? 0}`));
  const deduped = finalList.filter(f => !existingKeys.has(`${f.name}-${f.size}-${(f as any).lastModified ?? 0}`));
  return [...prev, ...deduped];
});


  // reset input so same files can be reselected later
  if (fileInputRef.current) fileInputRef.current.value = "";
}}
/>


    {images.length > 0 && (
  <div className="mt-4">
    <p className="font-medium text-gray-700 mb-2">{translations[lang].pictureSelected}:</p>
    <ul className="space-y-2">
      {images.map((image, index) => (
        <li key={`${image.name}-${index}`} className="flex justify-between items-center border p-2 rounded">
          <span className="text-sm truncate">
            {image.name} — {(image.size / 1024).toFixed(0)} KB
          </span>
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>


          {/* Options Button (No Validation Here) */}
          <button
  type="button"
  onClick={() => setShowOptions(!showOptions)}
  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
>
  {showOptions ? translations[lang].hideExtraOptions : translations[lang].showExtraOptions}
</button>


        {/* Options Section */}
        {showOptions && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Options</h3>
            {[
              { title: "🔒 Safety and Security", options: ["Front Sensors", "Back Sensors", "Side Sensors", "Front Camera", "Side Camera", "Back Camera", "360 Camera", 
                "Night Vision", "Blind Spot Monitoring", "Emergency Braking", "Park Assist", "Cruise Control", "Lane Assist", 
                "Speed Limiter", "ABS", "ESP", "Auto Hold", "Driver Drowsiness Detection", "High Beam Assist", 
                "Glare-Free High Beam Headlights", "ISOFIX", "Electric Stability Control",] },
              { title: "🛋️ Comfort and Convenience", options: ["Air Conditioner", "Air Suspension", "Heated Seats", "Ventilated Seats", "Seat Massage", "Memory Seats", 
                "Leather Seats", "Sunroof", "Keyless Go", "Start/Stop Button", "Electrically Adjustable Front Seats", 
                "Electrically Adjustable Back Seats", "Electronic Parking Brake", "Power Steering", "Power Windows", 
                "Adjustable Suspension", "Four-Wheel Drive", "Rear-Wheel Drive", "Front-Wheel Drive", "Sliding Door Right", 
                "Sliding Door Left", "Sliding Doors Both", "Heated Steering Wheel", "Heated Mirrors", "Headlight Washer System", 
                "Wooden Steering Wheel"] },
              { title: "🎵 Entertainment and Media", options: ["Bluetooth", "CD Player", "Radio", "Android Auto", "Apple CarPlay", "Hands-Free Equipment", "Voice Control", 
                "Heads-Up Display", "Navigation System", "Traffic Sign Recognition", "Touch Screen", "Television", "MP3", 
                "USB Port", "USB-C Port", "Touch Charger for Smartphone"] },
              { title: "⚙️ Extras", options: ["Cargo Barrier", "Tow Hook", "Aluminium Wheels", "Steel Wheels", "Sport Seats", "Panorama Roof", "Daytime Running Lights", 
                "Foldable Passenger Seats", "Summer Tires", "Winter Tires", "All-Season Tires", "Smokers Package", "Sport Suspension", 
                "Downhill Assist", "Tinted Windows", "Curtains", "Shift Paddles", "Auto-Dimming Interior Mirror", "E-Active Body Control", 
                "Back Fridge", "Carbon Ceramic Brakes", "Ventilated Brakes", "Child Seats", "Long Wheel Base"] },
            ].map((section, index) => (
              <div key={index} className="mt-4">
                <h4 className="text-md font-bold text-gray-800">{section.title}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {section.options.map(option => (
                    <label key={option} className="flex items-center">
                      <input
      type="checkbox"
      className="mr-2"
      value={option}
      checked={carDetails.options.includes(option)}
      onChange={handleOptionChange}
      />
       {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

          {/* Submit Button */}
          <div className="mt-6">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow-md transition">
              {translations[lang].submit}
            </button>
          </div>
          </form>
           )}
      </div>
    </div>
  );
}
