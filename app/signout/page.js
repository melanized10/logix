"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("lastAction", "logged out");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("scannedName");

    router.push("/signin");
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>👋 Signing you out...</h1>
    </div>
  );
}
