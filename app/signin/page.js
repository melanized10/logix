"use client";

import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // Track scanning state
  const router = useRouter();

  // Start the QR code scanning process
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // List video input devices (cameras) and choose the first one
    codeReader.listVideoInputDevices().then((videoInputDevices) => {
      if (videoInputDevices.length > 0) {
        const selectedDeviceId = videoInputDevices[0].deviceId;

        // Start decoding video from the selected device
        codeReader.decodeFromVideoDevice(selectedDeviceId, "video", (result, err) => {
          if (result) {
            setScannedResult(result.getText());
            setIsScanning(false); // Stop scanning after result is found
            playScanSound(); // Play success sound
            // Optionally, autofill the username and password from the scanned result
            // setUsername(result.getText()); // Example: assuming the scanned QR provides the username
            // setPassword('yourDefaultPassword'); // If the scan is used to set password (optional)
          }
          if (err && !(err instanceof DOMException)) {
            console.error("QR scan error:", err);
          }
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      codeReader.reset();
    };
  }, []);

  const getCurrentTimestamp = () => new Date().toLocaleString();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (username && password) {
      const timestamp = getCurrentTimestamp();
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("loginTime", timestamp);

      console.log(`User logged in at: ${timestamp}`);
      router.push("/dashboard");
    } else {
      alert("Please fill in both username and password.");
    }
  };

  // Function to play sound on successful scan
  const playScanSound = () => {
    const sound = new Audio("/success-sound.mp3"); // Ensure you have a sound file
    sound.play();
  };

  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-body">
                <h2 className="text-center mb-4">Sign In</h2>
                <form onSubmit={handleSignIn}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Sign In
                  </button>
                </form>

                <hr className="my-4" />

                <h5 className="text-center">Or Scan QR Code</h5>
                <div className="d-flex justify-content-center mb-2">
                  <video id="video" width="300" height="200" className="border rounded" />
                </div>

                {/* Show scanning feedback */}
                {isScanning && (
                  <p className="text-center text-warning">Scanning...</p>
                )}

                {/* Show scanned result */}
                {scannedResult && (
                  <p className="text-success text-center">
                    Scanned result: <strong>{scannedResult}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        &copy; {new Date().getFullYear()} @thebelladonnanun | All rights reserved.
      </footer>
    </>
  );
}
