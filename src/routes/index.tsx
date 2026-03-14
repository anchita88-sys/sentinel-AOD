import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { EmergencyHeader } from "@/components/nsw/EmergencyHeader";
import { SectorToggle } from "@/components/nsw/SectorToggle";
import { AlertCard } from "@/components/nsw/AlertCard";
import { GrassrootsModal } from "@/components/nsw/GrassrootsModal";
import { LocationModule } from "@/components/nsw/LocationModule";
import { ResourceActionCard } from "@/components/nsw/ResourceActionCard";
import { Button } from "@/components/ui/button";
import { STATIC_ALERTS, type DrugAlert, type LHD, type Sector } from "@/lib/nsw-data";
import { fetchDrugAlerts, type FeedStatus } from "@/lib/nsw-rss";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "NSW Clinical Risk & Harm Reduction Communication Interface",
      },
      {
        name: "description",
        content:
          "Statewide NSW triage node delivering evidence-based drug alerts, clinical resources and localised harm reduction pathways across all Local Health Districts.",
      },
      {
        property: "og:title",
        content: "NSW Clinical Risk & Harm Reduction Communication Interface",
      },
      {
        property: "og:description",
        content:
          "Evidence-based NSW Health alerts, clinical resources and peer-reported trends across all Local Health Districts.",
      },
    ],
  }),
  component: Index,
});

const SECTOR_COPY: Record<Sector, { focus: string }> = {
  community: {
    focus:
      "This view is for community health, primary care, and everyday settings. It highlights risks around prescription and illicit opioids — including newer synthetic opioids — and points you to ongoing clinical support and referral services in your area.",
  },
  nightlife: {
    focus:
      "This view is for nightlife, festivals, and large events. It focuses on stimulant-related risks such as unexpected strength, overheating, and what to do if someone needs urgent peer-led help on the night.",
  },
};

function Index() {
  const [sector, setSector] = useState<Sector>("community");
  const [stateAlerts, setStateAlerts] = useState<DrugAlert[]>(STATIC_ALERTS);
  const [peerAlerts, setPeerAlerts] = useState<DrugAlert[]>([]);
  const [feedStatus, setFeedStatus] = useState<FeedStatus>("cache");
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function loadFeed() {
    setLoading(true);
    const result = await fetchDrugAlerts();
    setStateAlerts(result.alerts);
    setFeedStatus(result.status);
    setFetchedAt(result.fetchedAt);
    setLoading(false);
  }

  useEffect(() => {
    loadFeed();
  }, []);

  const [lhd, setLhd] = useState<LHD | null>(null);
  const [lhdSource, setLhdSource] = useState<"detected" | "manual" | null>(null);

  const alerts = useMemo(
    () => [...peerAlerts, ...stateAlerts],
    [peerAlerts, stateAlerts],
  );

  const themeClass =
    sector === "community" ? "theme-community" : "theme-nightlife";

  // Radix portals (Dialog, Select) mount on document.body — theme tokens must
  // live there too or modal/dropdown surfaces render transparent.
  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-community", "theme-nightlife");
    body.classList.add(themeClass);
    return () => {
      body.classList.remove("theme-community", "theme-nightlife");
    };
  }, [themeClass]);

  return (
    <div className={cn(themeClass, "theme-transition min-h-screen bg-background text-foreground")}>
      <EmergencyHeader sector={sector} />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        {/* Hero */}
        <header className="py-8">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Activity className="h-4 w-4" aria-hidden />
            Statewide multi-jurisdictional triage node
          </div>
          <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">
            NSW Clinical Risk &amp; Harm Reduction Communication Interface
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            This page is here to help anyone in New South Wales find clear,
            up-to-date information about drug-related health risks. It brings
            together official warnings from NSW Health, links to local support
            and harm reduction services, and reports shared by community peer
            networks. Choose your Local Health District to see resources near
            you, and switch between the community health or nightlife view to
            read guidance that fits your setting. This is an information
            resource only — it does not replace medical advice or emergency
            care.
          </p>
        </header>

        {/* Sector segmentation */}
        <section aria-label="Sector selection" className="mb-4">
          <SectorToggle sector={sector} onChange={setSector} />
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Current focus:</span>{" "}
            {SECTOR_COPY[sector].focus}
          </p>
        </section>

        {/* Location + resource pathway */}
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <LocationModule
            selected={lhd}
            onSelect={(next, source) => {
              setLhd(next);
              setLhdSource(source);
            }}
          />
          <ResourceActionCard lhd={lhd} />
        </section>
        {lhd && lhdSource && (
          <p className="mt-2 text-xs text-muted-foreground">
            Pathway {lhdSource === "detected" ? "auto-detected" : "manually selected"} for{" "}
            {lhd.name} — {lhd.metro ? "metropolitan" : "regional / isolated"} coverage.
          </p>
        )}

        {/* Alerts */}
        <section aria-label="Drug alerts" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Active drug alerts</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                    feedStatus === "live"
                      ? "bg-success text-success-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  {feedStatus === "live"
                    ? "Live NSW Health feed"
                    : "Verified 2026 clinical cache"}
                </span>
                {fetchedAt && <span>Updated {fetchedAt}</span>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={loadFeed}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={cn("h-4 w-4", loading && "animate-spin")}
                  aria-hidden
                />
                Refresh feed
              </Button>
              <GrassrootsModal
                onSubmit={(a) => setPeerAlerts((prev) => [a, ...prev])}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer disclaimer */}
      <footer className="theme-transition border-t border-border bg-surface text-surface-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            Clinical validation disclaimer
          </div>
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-muted-foreground">
            This interface aggregates public drug alerts from the NSW Ministry of
            Health public drug-alerts feed
            (<span className="font-mono">health.nsw.gov.au/aod/public-drug-alerts</span>),
            retrieved via a public proxy wrapper with an automatic fallback to a
            verified 2026 static clinical cache when the live feed is
            unreachable. State advisories are validated NSW Health communications;
            items marked{" "}
            <span className="font-semibold text-peer">
              ⚠️ Peer Sourced (Clinical Validation Pending)
            </span>{" "}
            are community submissions that have not been clinically validated and
            must not be treated as confirmed advice. This platform does not
            replace professional medical care. In an emergency call Triple Zero
            (000); for clinical advice call the NSW Poisons Information Centre on
            13 11 26 (24/7).
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} NSW Clinical Risk &amp; Harm Reduction
            Communication Interface — statewide harm reduction resource.
          </p>
        </div>
      </footer>
    </div>
  );
}
