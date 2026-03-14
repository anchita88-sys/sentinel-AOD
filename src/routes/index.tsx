import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { OverdoseSignsSection } from "@/components/nsw/OverdoseSignsSection";
import { SectorToggle } from "@/components/nsw/SectorToggle";
import { AlertCard } from "@/components/nsw/AlertCard";
import { GrassrootsModal } from "@/components/nsw/GrassrootsModal";
import { EventLocationModule } from "@/components/nsw/EventLocationModule";
import { EventResourceCard } from "@/components/nsw/EventResourceCard";
import { LocationModule } from "@/components/nsw/LocationModule";
import { ResourceActionCard } from "@/components/nsw/ResourceActionCard";
import { Button } from "@/components/ui/button";
import { STATIC_ALERTS, hospitalsForLhd, type DrugAlert, type EventArea, type HospitalFacility, type LHD, type Sector } from "@/lib/nsw-data";
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
      "For everyday health support — opioid risks, naloxone, hospitals, and clinical services near you.",
  },
  nightlife: {
    focus:
      "For going out tonight — stimulant risks, overheating, and peer-led help at events and venues.",
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
  const [hospital, setHospital] = useState<HospitalFacility | null>(null);
  const [eventArea, setEventArea] = useState<EventArea | null>(null);
  const [eventSource, setEventSource] = useState<"detected" | "manual" | null>(null);

  function handleSectorChange(next: Sector) {
    setSector(next);
    setLhd(null);
    setLhdSource(null);
    setHospital(null);
    setEventArea(null);
    setEventSource(null);
  }

  const locationReady = useMemo(() => {
    if (sector === "community") {
      if (!lhd || !lhdSource) return false;
      const hospitals = hospitalsForLhd(lhd.id);
      return hospitals.length === 0 || hospital !== null;
    }
    return eventArea !== null && eventSource !== null;
  }, [sector, lhd, lhdSource, hospital, eventArea, eventSource]);

  const alerts = useMemo(() => {
    const all = [...peerAlerts, ...stateAlerts];
    return all.filter(
      (a) => a.sector === sector || a.sector === "both",
    );
  }, [peerAlerts, stateAlerts, sector]);

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
      <main className="mx-auto max-w-7xl px-4 pb-16">
        {/* Hero */}
        <header className="py-6">
          <h1 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">
            NSW Clinical Risk &amp; Harm Reduction Communication Interface
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            One place to check drug-related health warnings for New South Wales —
            official alerts, local support, and community reports.
          </p>
        </header>

        <OverdoseSignsSection />

        <section aria-label="What are you here for?" className="mt-8">
          <h2 className="text-lg font-semibold">What are you here for?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose whether you need general health support or are heading to an
            event or nightlife.
          </p>
          <div className="mt-4">
            <SectorToggle sector={sector} onChange={handleSectorChange} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Current focus:</span>{" "}
            {SECTOR_COPY[sector].focus}
          </p>
        </section>

        <section aria-label="Set your location" className="mt-8">
          {sector === "community" ? (
            <LocationModule
              selected={lhd}
              selectedHospital={hospital}
              onSelect={(next, source) => {
                setLhd(next);
                setLhdSource(source);
                setHospital(null);
              }}
              onHospitalSelect={setHospital}
            />
          ) : (
            <EventLocationModule
              selected={eventArea}
              onSelect={(area, source) => {
                setEventArea(area);
                setEventSource(source);
              }}
            />
          )}
        </section>

        {locationReady && (
          <>
            <header className="mt-10 border-t border-border pt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {sector === "community" ? "Your local area" : "Your event area"}
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                {sector === "community" && lhd
                  ? `${lhd.name}${hospital ? ` · ${hospital.name}` : ""}`
                  : eventArea?.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {sector === "community" && lhd ? (
                  <>
                    Pathway {lhdSource === "detected" ? "auto-detected" : "manually selected"} —{" "}
                    {lhd.metro ? "metropolitan" : "regional / isolated"} coverage.
                  </>
                ) : (
                  <>
                    Area {eventSource === "detected" ? "auto-detected" : "manually selected"} —{" "}
                    {eventArea?.subtitle}
                  </>
                )}
              </p>
            </header>

            <section className="mt-6">
              {sector === "community" && lhd ? (
                <ResourceActionCard lhd={lhd} hospital={hospital} />
              ) : eventArea ? (
                <EventResourceCard area={eventArea} />
              ) : null}
            </section>

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
          </>
        )}
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
