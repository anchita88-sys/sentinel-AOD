import { Building2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sector } from "@/lib/nsw-data";

const OPTIONS: {
  id: Sector;
  icon: typeof Building2;
  title: string;
  desc: string;
}[] = [
  {
    id: "community",
    icon: Building2,
    title: "Community & Primary Health",
    desc: "Healthcare workers, NSPs & general community health",
  },
  {
    id: "nightlife",
    icon: PartyPopper,
    title: "Nightlife & Major Events",
    desc: "Festivals, nightlife & acute peer-led care",
  },
];

export function SectorToggle({
  sector,
  onChange,
}: {
  sector: Sector;
  onChange: (s: Sector) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Public health communication stream"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {OPTIONS.map((opt) => {
        const active = sector === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "theme-transition group flex items-start gap-3 rounded-xl border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-elevated"
                : "border-border bg-card text-card-foreground hover:border-primary/50 hover:bg-accent",
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl",
                active ? "bg-primary-foreground/15" : "bg-secondary",
              )}
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="text-sm font-semibold">{opt.title}</span>
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {opt.desc}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
