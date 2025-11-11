// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EventBusProvider } from "./context/EventBusContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Game from "./pages/Game";
import SignIn from "./pages/SignIn";

function LoginWidget() {
  const { user, login, logout } = useAuth();
  if (user) {
    return (
      <div className="p-2">
        Logged in as <strong>{user.username}</strong>
        <button onClick={logout} className="ml-2 px-2">Logout</button>
      </div>
    );
  }

  const doLogin = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get("username");
    const password = fd.get("password");
    if (typeof login === "function") {
      login({ username, password });
    } else {
      // fallback: set user directly in localStorage if no login function
      localStorage.setItem("user", JSON.stringify({ username }));
      window.location.reload();
    }
  };

  return (
    <form onSubmit={doLogin} className="p-2">
      <input name="username" placeholder="username" className="border p-1 mr-2" required />
      <input name="password" placeholder="password" type="password" className="border p-1 mr-2" required />
      <button type="submit" className="px-2">Login</button>
    </form>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventBusProvider>
        <BrowserRouter>
          <div className="container mx-auto">
         

            <main>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/game" element={<Game />} />
                <Route path="/" element={<Navigate to="/game" replace />} />
                <Route path="*" element={<Navigate to="/game" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </EventBusProvider>
    </AuthProvider>
  );
}
