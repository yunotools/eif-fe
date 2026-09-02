"use client";

import { useEffect, useState } from "react";

export type Countdown = {
  totalSeconds: number;
  text: string;
  expired: boolean;
};

function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const days = Math.floor(safe / 86_400);
  const hours = Math.floor((safe % 86_400) / 3_600);
  const minutes = Math.floor((safe % 3_600) / 60);
  const seconds = safe % 60;
  const time = [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
  return days > 0 ? `${days}d ${time}` : time;
}

export function useCountdown(expiredAt: string | null | undefined): Countdown {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  if (!expiredAt) {
    return { totalSeconds: 0, text: "--:--:--", expired: false };
  }

  const timestamp = new Date(expiredAt).getTime();
  if (Number.isNaN(timestamp)) {
    return { totalSeconds: 0, text: "--:--:--", expired: false };
  }

  const totalSeconds = Math.max(0, Math.ceil((timestamp - now) / 1_000));

  return {
    totalSeconds,
    text: formatCountdown(totalSeconds),
    expired: totalSeconds <= 0,
  };
}
