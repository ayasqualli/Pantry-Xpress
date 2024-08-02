'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Login = dynamic(() => import('./login'), { ssr: false });

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading indicator
  }

  return <Login />;
}