"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/login', { username, password });

      if (response.status === 200) {
        console.log("@23 its working fine");
        // Redirect to admin dashboard on successful login
        localStorage.setItem("adminToken", response.data.token);
        router.push('/admin/dashboard');
      }
    } catch (error) {
        console.log(error);
      setErrorMessage( 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-sm p-6 bg-gray-700 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-white" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="text-white" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
