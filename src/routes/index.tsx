import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Clock,
});

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center gap-10 p-6 transition-colors duration-500 ${
        dark ? "bg-[#0b1020]" : "bg-gradient-to-br from-indigo-950 via-[#151a35] to-black"
      }`}
    >
      {/* Analog face */}
      <div className="relative h-64 w-64 sm:h-80 sm:w-80">
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-2xl">
          <circle cx="100" cy="100" r="96" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          {Array.from({ length: 60 }).map((_, i) => {
            const major = i % 5 === 0;
            const angle = (i * 6 * Math.PI) / 180;
            const outer = 88;
            const inner = major ? 76 : 83;
            return (
              <line
                key={i}
                x1={100 + outer * Math.sin(angle)}
                y1={100 - outer * Math.cos(angle)}
                x2={100 + inner * Math.sin(angle)}
                y2={100 - inner * Math.cos(angle)}
                stroke={major ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)"}
                strokeWidth={major ? 2.5 : 1}
                strokeLinecap="round"
              />
            );
          })}
          {[0, 3, 6, 9].map((num) => {
            const angle = (num * 30 * Math.PI) / 180;
            const r = 62;
            return (
              <text
                key={num}
                x={100 + r * Math.sin(angle)}
                y={100 - r * Math.cos(angle)}
                fill="rgba(255,255,255,0.85)"
                fontSize="14"
                fontWeight="600"
                fontFamily="monospace"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {String(num * 5)}
              </text>
            );
          })}
          {/* Hour hand */}
          <line
            x1="100" y1="100"
            x2={100 + 46 * Math.sin(((hours % 12) / 12) * 2 * Math.PI)}
            y2={100 - 46 * Math.cos(((hours % 12) / 12) * 2 * Math.PI)}
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            x1="100" y1="100"
            x2={100 + 68 * Math.sin((minutes / 60) * 2 * Math.PI)}
            y2={100 - 68 * Math.cos((minutes / 60) * 2 * Math.PI)}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Second hand */}
          <line
            x1="100" y1="112"
            x2={100 + 78 * Math.sin((seconds / 60) * 2 * Math.PI)}
            y2={100 - 78 * Math.cos((seconds / 60) * 2 * Math.PI)}
            stroke="#f43f5e"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="#f43f5e" />
        </svg>
      </div>

      {/* Digital display */}
      <div className="text-center">
        <div className="font-mono text-7xl font-bold tabular-nums text-white sm:text-8xl">
          {pad(hours)}:{pad(minutes)}
          <span className="text-emerald-400">:{pad(seconds)}</span>
        </div>
        <p className="mt-4 text-lg capitalize tracking-wide text-white/60">{dateLabel}</p>
      </div>

      <button
        onClick={() => setDark(!dark)}
        className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
      >
        {dark ? "Lighter" : "Dimmer"}
      </button>
    </div>
  );
}
