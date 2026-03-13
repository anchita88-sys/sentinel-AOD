import { Phone, TriangleAlert } from "lucide-react";
import type { Sector } from "@/lib/nsw-data";
import { OVERDOSE_MARKERS } from "@/lib/nsw-data";

export function EmergencyHeader({ sector }: { sector: Sector }) {
  const { label, markers } = OVERDOSE_MARKERS[sector];

  return (
    <div className="sticky top-0 z-50 theme-transition border-b border-emergency/40 bg-emergency text-emergency-foreground shadow-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-start gap-2.5">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
              Signs of overdose · {label}
            </p>
            <ul className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm font-medium">
              {markers.map((m) => (
                <li key={m} className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emergency-foreground/70"
                    aria-hidden
                  />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href="tel:000"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-emergency-foreground px-4 py-2 text-sm font-bold text-emergency shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-emergency"
          aria-label="Call Emergency Services Triple Zero"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Emergency · Call 000
        </a>
      </div>
    </div>
  );
}
