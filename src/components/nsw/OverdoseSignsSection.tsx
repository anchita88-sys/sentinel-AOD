import { Phone, TriangleAlert } from "lucide-react";
import { OVERDOSE_MARKERS } from "@/lib/nsw-data";

const SIGN_GROUPS = [
  { id: "community" as const, heading: "Opioid overdose" },
  { id: "nightlife" as const, heading: "Stimulant overdose or overheating" },
];

export function OverdoseSignsSection() {
  return (
    <section
      aria-labelledby="overdose-signs-heading"
      className="theme-transition rounded-xl border border-emergency/30 bg-card p-5 text-card-foreground shadow-card sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emergency/10 text-emergency">
          <TriangleAlert className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id="overdose-signs-heading" className="text-lg font-semibold">
            Know the signs of overdose
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            If you see these signs, call 000 straight away.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {SIGN_GROUPS.map((group) => {
          const { markers } = OVERDOSE_MARKERS[group.id];
          return (
            <div
              key={group.id}
              className="rounded-lg border border-border bg-background p-4"
            >
              <h3 className="text-sm font-semibold">{group.heading}</h3>
              <ul className="mt-2 space-y-2">
                {markers.map((sign) => (
                  <li
                    key={sign}
                    className="flex items-start gap-2 text-sm leading-snug"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emergency"
                      aria-hidden
                    />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-lg border border-emergency/20 bg-emergency/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-foreground">What to do:</span> Call
          000, give naloxone if opioids may be involved, place the person on
          their side, and stay with them.
        </p>
        <a
          href="tel:000"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-emergency px-4 py-2 text-sm font-bold text-emergency-foreground shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency focus-visible:ring-offset-2"
          aria-label="Call Emergency Services Triple Zero"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call 000
        </a>
      </div>
    </section>
  );
}
