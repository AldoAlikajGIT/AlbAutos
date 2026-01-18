import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  id: number;
  email: string;
  role: string;
  active: boolean;
  fullName?: string;     // if your backend returns decrypted values for admin
  phoneNumber?: string;  // same
};

type AdminCarAd = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  location?: string;
  createdAt?: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token") || "");
  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const [emailInput, setEmailInput] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAds, setLoadingAds] = useState(false);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [ads, setAds] = useState<AdminCarAd[]>([]);

  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  }, [token, navigate]);

  const normalizeEmail = (e: string) => (e || "").trim().toLowerCase();

  const clearResults = () => {
    setUser(null);
    setAds([]);
    setError("");
    setInfo("");
  };

  // ---- API calls ----

  const findUserAndAds = async () => {
    const email = normalizeEmail(emailInput);
    if (!email) {
      setError("Enter an email first.");
      return;
    }

    setError("");
    setInfo("");
    setLoadingUser(true);
    setLoadingAds(true);
    setUser(null);
    setAds([]);

    try {
      // 1) Find user
      const userRes = await axios.get(
        "http://localhost:8080/api/admin/users/by-email",
        { params: { email }, headers: authHeaders, validateStatus: () => true }
      );

      if (userRes.status === 401 || userRes.status === 403) {
        setError("Not authorized. Login as admin again.");
        setLoadingUser(false);
        setLoadingAds(false);
        return;
      }

      if (userRes.status === 404) {
        setError("User not found.");
        setLoadingUser(false);
        setLoadingAds(false);
        return;
      }

      if (userRes.status !== 200) {
        setError("Failed to fetch user.");
        setLoadingUser(false);
        setLoadingAds(false);
        return;
      }

      setUser(userRes.data);

      // 2) Fetch ads for that email
      const adsRes = await axios.get(
        "http://localhost:8080/api/admin/ads/by-user-email",
        { params: { email }, headers: authHeaders, validateStatus: () => true }
      );

      if (adsRes.status === 200) {
        const list = Array.isArray(adsRes.data) ? adsRes.data : [];
        setAds(list);
        if (list.length === 0) setInfo("User has no ads.");
      } else {
        setError("Failed to fetch user ads.");
      }
    } catch (e) {
      setError("Network/server error while fetching.");
    } finally {
      setLoadingUser(false);
      setLoadingAds(false);
    }
  };

  const deleteAd = async (adId: number) => {
    if (!confirm(`Delete ad #${adId}?`)) return;

    setError("");
    setInfo("");

    const res = await axios.delete(
      `http://localhost:8080/api/admin/ads/${adId}`,
      { headers: authHeaders, validateStatus: () => true }
    );

    if (res.status === 401 || res.status === 403) {
      setError("Not authorized.");
      return;
    }
    if (res.status !== 204 && res.status !== 200) {
      setError("Failed to delete ad.");
      return;
    }

    setAds((prev) => prev.filter((a) => a.id !== adId));
    setInfo(`Ad #${adId} deleted.`);
  };

  const deleteUserByEmail = async () => {
    const email = normalizeEmail(emailInput);
    if (!email) return;

    if (!confirm(`Delete user ${email} and all their data?`)) return;

    setError("");
    setInfo("");

    const res = await axios.delete(
      "http://localhost:8080/api/admin/users/by-email",
      { params: { email }, headers: authHeaders, validateStatus: () => true }
    );

    if (res.status === 401 || res.status === 403) {
      setError("Not authorized.");
      return;
    }
    if (res.status !== 204 && res.status !== 200) {
      setError("Failed to delete user.");
      return;
    }

    setInfo("User deleted.");
    clearResults();
    setEmailInput(email); // keep it visible if you want
  };

  // ---- UI ----

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

      {/* Search block */}
      <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-3">Find user by email</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="border p-2 w-full"
            type="email"
            placeholder="user@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") findUserAndAds();
            }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={findUserAndAds}
            disabled={loadingUser || loadingAds}
          >
            {loadingUser || loadingAds ? "Searching..." : "Find user"}
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
            onClick={clearResults}
          >
            Clear
          </button>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {info && <p className="text-green-700 mt-3">{info}</p>}
      </div>

      {/* User card */}
      {user && (
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{user.email}</h3>
              <p className="text-sm text-gray-600">
                Role: <span className="font-medium">{user.role}</span> • Active:{" "}
                <span className="font-medium">{String(user.active)}</span>
              </p>

              {(user.fullName || user.phoneNumber) && (
                <p className="text-sm text-gray-600 mt-1">
                  {user.fullName ? <>Name: <span className="font-medium">{user.fullName}</span> • </> : null}
                  {user.phoneNumber ? <>Phone: <span className="font-medium">{user.phoneNumber}</span></> : null}
                </p>
              )}
            </div>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={deleteUserByEmail}
            >
              Delete user
            </button>
          </div>
        </div>
      )}

      {/* Ads table */}
      {user && (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">User ads</h2>
            <span className="text-sm text-gray-600">
              {loadingAds ? "Loading..." : `${ads.length} ad(s)`}
            </span>
          </div>

          {ads.length === 0 ? (
            <p className="text-gray-600">No ads to show.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-3">Ad ID</th>
                    <th className="py-2 pr-3">Car</th>
                    <th className="py-2 pr-3">Year</th>
                    <th className="py-2 pr-3">Price</th>
                    <th className="py-2 pr-3">Location</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="border-b">
                      <td className="py-2 pr-3 font-medium">#{ad.id}</td>
                      <td className="py-2 pr-3">
                        {ad.brand} {ad.model}
                      </td>
                      <td className="py-2 pr-3">{ad.year}</td>
                      <td className="py-2 pr-3">
                        €{Number(ad.price).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3">{ad.location ?? "-"}</td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => deleteAd(ad.id)}
                          >
                            Delete ad
                          </button>
                          <button
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
                            onClick={() => navigate(`/carad/${ad.id}`)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
