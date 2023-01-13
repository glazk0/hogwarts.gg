'use client';
import { useEffect, useState } from 'react';

const RELEASE_DATE = new Date('2023-02-10T00:00:00.000Z');

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(
    () => RELEASE_DATE.getTime() - Date.now(),
  );

  useEffect(() => {
    const id = setInterval(
      () => setTimeLeft(RELEASE_DATE.getTime() - Date.now()),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const secondsLeft = Math.floor((timeLeft / 1000) % 60);
  const minutesLeft = Math.floor((timeLeft / 1000 / 60) % 60);
  const hoursLeft = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
  const daysLeft = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

  return (
    <span className="font-mono text-2xl drop-shadow-md ">
      {daysLeft}
      <span className="uppercase ml-1 mr-2">days</span>
      {pad(hoursLeft)}
      <span className="uppercase ml-1 mr-2">h</span>
      {pad(minutesLeft)}
      <span className="uppercase ml-1 mr-2">m</span>
      {pad(secondsLeft)}
      <span className="uppercase ml-1">s</span>
    </span>
  );
};

export default Countdown;

const pad = (value: number) => `0${Math.floor(value)}`.slice(-2);
