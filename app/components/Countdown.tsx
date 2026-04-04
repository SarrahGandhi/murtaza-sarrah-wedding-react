"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-10-22T00:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-none font-light text-foreground tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.35em] uppercase text-text-secondary mt-2 sm:mt-3 font-body text-center">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <div className="flex items-center gap-2 sm:gap-6 md:gap-10 lg:gap-14">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <Digit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-6 md:gap-10 lg:gap-14">
      <Digit value={time.days} label="Days" />
      <span className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-muted font-light self-start mt-2 md:mt-4">
        :
      </span>
      <Digit value={time.hours} label="Hours" />
      <span className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-muted font-light self-start mt-2 md:mt-4">
        :
      </span>
      <Digit value={time.minutes} label="Minutes" />
      <span className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-muted font-light self-start mt-2 md:mt-4 hidden sm:block">
        :
      </span>
      <div className="hidden sm:flex flex-col items-center">
        <Digit value={time.seconds} label="Seconds" />
      </div>
    </div>
  );
}
