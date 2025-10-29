import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({ fullName: "", phoneNumber: "" });

  const [searchEmail, setSearchEmail] = useState("");

  // Read token once on mount
  const [token] = useState(() => localStorage.getItem("token") || "");

  // ✅ No role-check call here. PrivateAdminRoute handles it.
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    setLoading(false);
  }, [token, navigate]);

  // Load all users once "ready"
  useEffect(() => {
    if (loading || !token) return;

    axios
      .get("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (Array.isArray(res.data)) setUsers(res.data);
        else setUsers([]);
      })
      .catch(() => {
        // If backend still denies for any reason, punt home
        navigate("/");
      });
  }, [loading, token, navigate]);

  // ---- Actions ----

  const handleDeleteUser = (id: string) => {
    axios
      .delete(`/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        if (selectedUserId === id) {
          setSelectedUserId("");
        }
      });
  };

  const handleBanUser = (email: string) => {
    axios.put(
      `/api/admin/ban-by-email/${email}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleUnbanUser = (email: string) => {
    axios.put(
      `/api/admin/unban-by-email/${email}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleUpdateUser = (id: string, data: any) => {
    axios
      .put(`/api/admin/update-user/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("User updated.");
        setEditUserId(null);
        setEditData({ fullName: "", phoneNumber: "" });
        // reflect client-side
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, ...data } : u))
        );
      });
  };

  const handleSearchUserAds = () => {
    const email = searchEmail.trim();
    if (!email) return alert("Enter an email to search.");
    navigate(`/admin/user-ads?email=${encodeURIComponent(email)}`);
  };

  if (loading) {
    return <div className="p-6 text-lg text-center">Loading admin dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/")}
      >
        Home
      </button>

      {/* 🔍 Search user ads by email (single, unified block) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Search User Ads by Email</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="border p-2 w-full sm:w-1/2"
            type="email"
            placeholder="Enter user email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSearchUserAds}
          >
            Search Ads
          </button>
        </div>
      </div>

      {/* 👤 All users */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-3 rounded shadow">
            <strong>{user.email}</strong> ({user.role})
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => handleBanUser(user.email)}
              >
                Ban
              </button>
              <button
                className="bg-green-600 text-white px-2 py-1 rounded"
                onClick={() => handleUnbanUser(user.email)}
              >
                Unban
              </button>
              <button
                className="bg-indigo-500 text-white px-2 py-1 rounded"
                onClick={() => {
                  setEditUserId(user.id);
                  setEditData({
                    fullName: user.fullName || "",
                    phoneNumber: user.phoneNumber || "",
                  });
                }}
              >
                Edit
              </button>
            </div>

            {editUserId === user.id && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  className="border p-2"
                  placeholder="Full Name"
                  value={editData.fullName}
                  onChange={(e) =>
                    setEditData({ ...editData, fullName: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border p-2"
                  placeholder="Phone Number"
                  value={editData.phoneNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, phoneNumber: e.target.value })
                  }
                />
                <button
                  className="col-span-1 sm:col-span-2 bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => handleUpdateUser(user.id, editData)}
                >
                  Save Changes
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
