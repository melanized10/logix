"use client"; // Mark the component as client-side
import 'bootstrap/dist/css/bootstrap.min.css';


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check localStorage for user login status on page load
  useEffect(() => {
    const userStatus = localStorage.getItem('loggedIn');
    if (userStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle Log Out
  const handleLogOut = () => {
    localStorage.setItem('loggedIn', 'false');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to homepage after logout
  };

  // Handle Log In (simulate login for demo purposes)
  const handleLogIn = () => {
    localStorage.setItem('loggedIn', 'true');
    setIsLoggedIn(true);
    router.push('/dashboard'); // Redirect to dashboard after login
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Logix</h1>
      <p>Your sign-in and sign-out app</p>

      {!isLoggedIn ? (
        <div>
          <p>Please sign in to access your account.</p>
          <button
            onClick={() => router.push('/signin')}
            style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}
          >
            Go to Sign In Page
          </button>
          <button
            onClick={handleLogIn}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Simulate Log In
          </button>
        </div>
      ) : (
        <div>
          <p>You are logged in!</p>
          <button
            onClick={handleLogOut}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
