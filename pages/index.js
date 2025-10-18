import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main page
    router.push('/index.html');
  }, []);

  return null;
}
