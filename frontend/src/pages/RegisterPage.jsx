import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      setRedirect(true);
      alert("Registration Successful");
      alert("Redirecting to Login Page");
    } else {
      alert("Username is not available");
    }
  };

  if (redirect) {
    return <Navigate to= "/login" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Blue Glow Effect */}
      <div className="absolute inset-0  pointer-events-none"></div>

      {/* Glassmorphic Register Card */}
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 text-white">
        <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 bg-transparent border border-blue-400/50 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 bg-transparent border border-blue-400/50 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-transparent border border-blue-400/50 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Blue Animated Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-blue-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
