"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [action, setAction] = useState("logged in");
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("username") || localStorage.getItem("scannedName");
    const lastAction = localStorage.getItem("lastAction") || "logged in";

    if (!storedName) {
      router.push("/signin"); // Redirect if not signed in
    } else {
      setUsername(storedName);
      setAction(lastAction);
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem("lastAction", "logged out");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("scannedName");
    router.push("/signin");
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>🎉 Welcome {username}!</h1>
      <p>You have successfully {action}.</p>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        🚪 Logout
      </button>
    </div>
  );
}
