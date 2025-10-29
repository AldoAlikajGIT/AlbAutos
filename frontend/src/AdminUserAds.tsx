import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

type CarAd = {
  id: number;
  brand?: string;
  model?: string;
  year?: number | string;
  price?: number | string;
  // add any other fields you want to show
};

export default function AdminUserAds() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = useMemo(
    () => (searchParams.get("email") || "").trim().toLowerCase(),
    [searchParams]
  );

  const [ads, setAds] = useState<CarAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string>("");

  // read token once
  const token = useMemo(() => localStorage.getItem("token") || "", []);

  useEffect(() => {
    if (!token) {
      navigate("/"); // no token → bounce
      return;
    }
    if (!emailParam) {
      setMsg("No email provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMsg("");

    axios
      .get(`/api/admin/user-ads-by-email/${encodeURIComponent(emailParam)}`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true, // handle 204/404 cleanly
      })
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data)) {
          setAds(res.data);
          setMsg("");
        } else if (res.status === 204) {
          setAds([]);
          setMsg("No ads found for this user.");
        } else if (res.status === 404) {
          setAds([]);
          setMsg("User not found.");
        } else {
          setAds([]);
          setMsg("Failed to load ads.");
        }
      })
      .catch(() => {
        setAds([]);
        setMsg("Failed to load ads.");
      })
      .finally(() => setLoading(false));
  }, [emailParam, token, navigate]);

  const handleDeleteAd = (adId: number) => {
    axios
      .delete(`/api/cars/delete/${adId}`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      })
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          setAds((prev) => prev.filter((a) => a.id !== adId));
        } else {
          alert("Failed to delete ad.");
        }
      })
      .catch(() => alert("Failed to delete ad."));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Ads for:
          <span className="block sm:inline sm:ml-2 break-all">{emailParam}</span>
        </h1>
        <button
          onClick={() => navigate("/caditiperadmininoheker")}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900"
        >
          Back to Admin
        </button>
      </div>

      {loading && (
        <div className="mt-6 text-gray-600">Loading ads…</div>
      )}

      {!loading && msg && (
        <div className="mt-6 text-gray-700">{msg}</div>
      )}

      {!loading && ads.length > 0 && (
        <ul className="mt-6 space-y-3">
          {ads.map((ad) => (
            <li key={ad.id} className="border rounded p-3 shadow-sm">
              <div className="font-semibold">
                {ad.brand} {ad.model} {ad.year ? `- ${ad.year}` : ""}
              </div>
              {ad.price !== undefined && (
                <div className="text-sm text-gray-700 mt-1">Price: {ad.price}</div>
              )}

              <div className="mt-3 space-x-2">
                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                {/* If you later add editing here, place an Edit button next to Delete */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
