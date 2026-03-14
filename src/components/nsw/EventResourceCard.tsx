import { HeartPulse, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventArea } from "@/lib/nsw-data";

export function EventResourceCard({ area }: { area: EventArea }) {
  return (
    <div className="theme-transition flex h-full flex-col overflow-hidden rounded-xl border border-primary/30 bg-hero-gradient p-6 text-hero-foreground shadow-elevated">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-hero-foreground/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
          Event &amp; nightlife pathway
        </span>
      </div>
      <h2 className="mt-3 text-lg font-semibold">Peer support for tonight</h2>
      <p className="text-sm text-hero-foreground/80">{area.name}</p>
      <p className="mt-1 text-xs text-hero-foreground/70">{area.subtitle}</p>

      <div className="mt-4 rounded-lg bg-hero-foreground/10 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Look out for each other</p>
            <ul className="mt-2 space-y-1.5 text-sm text-hero-foreground/85">
              {area.peerGuidance.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden>·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-hero-foreground/10 p-4">
        <div className="flex items-start gap-3">
          <HeartPulse className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-sm text-hero-foreground/85">
            Stimulant risks — overheating, unexpected strength, and long-lasting
            effects — are the main concerns at events. Call Triple Zero (000) for
            any medical emergency. For 24/7 clinical advice, call the NSW Poisons
            Information Centre.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="secondary" className="gap-2">
          <a href="tel:000">
            <Phone className="h-4 w-4" aria-hidden />
            Emergency · 000
          </a>
        </Button>
        <Button asChild variant="secondary" className="gap-2">
          <a href="tel:131126">
            <Phone className="h-4 w-4" aria-hidden />
            Poisons Info · 13 11 26
          </a>
        </Button>
      </div>
    </div>
  );
}
