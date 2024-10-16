"use client"; // This makes the component a client component

import { SessionProvider } from "next-auth/react"; // Adjust the import according to your setup
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react'; // Import getSession here

const Provider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Fetch the session when the component mounts
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    
    fetchSession();
  }, []);

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default Provider;
