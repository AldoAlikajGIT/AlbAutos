import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { translations } from "./translations";

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string>("");
  const [lang, setLang] = useState<"en" | "sq">("sq"); // Default Albanian
  const [carAd, setCarAd] = useState<any>({
    price: ""
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCarAdDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cars/${id}`);
        setCarAd(response.data);
      } catch (error) {
        console.error("Error fetching car ad:", error);
        setError("Failed to fetch car details.");
      }
    };

    if (id) {
      fetchCarAdDetails();
    }
  }, [id]);

  useEffect(() => {
  const savedLang = localStorage.getItem("lang") as "en" | "sq";
  if (savedLang) setLang(savedLang);
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceValue = parseFloat(carAd.price);

    if (isNaN(priceValue) || priceValue < 1) {
      setError("Price must be at least €1.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/cars/update-price/${id}`,
        { price: priceValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Car ad info updated successfully!");
      setError("");
      setTimeout(() => navigate("/myaccount"), 1500);
    } catch (error) {
      console.error("Error updating car ad contact info:", error);
      setError("Failed to update car ad contact info.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">{translations[lang].editCar}(ID: {id})</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium">{translations[lang].price}</label>
            <input
              type="number"
              id="price"
              name="price"
              value={carAd.price}
              onChange={(e) => setCarAd({ ...carAd, price: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
              min="1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
          >
            {translations[lang].saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
}
