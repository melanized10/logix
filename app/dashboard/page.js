"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [loginTime, setLoginTime] = useState(""); // State to store the login time
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("username") || localStorage.getItem("scannedName");
    const storedLoginTime = localStorage.getItem("loginTime"); // Retrieve the login time from localStorage

    if (!storedName) {
      router.push("/signin"); // Redirect to signin if no user is found
    } else {
      setUsername(storedName);
      setLoginTime(storedLoginTime); // Set the login time
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.setItem("lastAction", "logged out"); // Set lastAction to "logged out"
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("scannedName");
    localStorage.removeItem("loginTime"); // Remove the login time
    router.push("/signin");
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>🎉 Welcome {username}!</h1>
      <p>You are currently logged in.</p> {/* Always display "logged in" */}
      {loginTime && (
        <p>
          You logged in at: <strong>{loginTime}</strong>
        </p> // Display the login time if available
      )}
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        🚪 Logout
      </button>
    </div>
  );
}
