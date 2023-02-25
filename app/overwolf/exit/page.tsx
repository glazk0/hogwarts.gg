'use client';

import Button from '#/ui/Button';
import { useEffect, useState } from 'react';

export default function Page() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds < 1) {
      window.close();
    }
  }, [seconds]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="grid gap-2 place-content-center h-screen text-center">
      <h1 className="text-xl">Successfully logged in 🤘</h1>
      <p>This window will be self-destroyed in {seconds} seconds</p>
      <Button onClick={() => window.close()} className="w-60 mx-auto">
        Close now 🚀
      </Button>
    </div>
  );
}
