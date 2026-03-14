import { HeartPulse, Hospital, Mail, Phone, Pill, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HospitalFacility, LHD } from "@/lib/nsw-data";

export function ResourceActionCard({
  lhd,
  hospital,
}: {
  lhd: LHD | null;
  hospital: HospitalFacility | null;
}) {
  if (!lhd) {
    return (
      <div className="theme-transition flex h-full flex-col justify-center rounded-xl border border-dashed border-border bg-card p-6 text-card-foreground shadow-card">
        <HeartPulse className="h-6 w-6 text-muted-foreground" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold">
          Harm Reduction Resource Action
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Detect your location or select a Local Health District to receive a
          localised naloxone and clinical referral pathway.
        </p>
      </div>
    );
  }

  const metro = lhd.metro;

  return (
    <div className="theme-transition flex h-full flex-col overflow-hidden rounded-xl border border-primary/30 bg-hero-gradient p-6 text-hero-foreground shadow-elevated">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-hero-foreground/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
          {metro ? "Metropolitan pathway" : "Regional / isolated pathway"}
        </span>
      </div>
      <h2 className="mt-3 text-lg font-semibold">
        Harm Reduction Resource Action
      </h2>
      <p className="text-sm text-hero-foreground/80">{lhd.name}</p>

      {hospital && (
        <div className="mt-3 rounded-lg border border-hero-foreground/20 bg-hero-foreground/10 p-3">
          <div className="flex items-start gap-3">
            <Hospital className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="text-sm font-semibold">{hospital.name}</p>
              <p className="mt-0.5 text-xs text-hero-foreground/85">
                Level {hospital.level} hospital · {hospital.location} — emergency
                department can administer naloxone for suspected overdose.
              </p>
            </div>
          </div>
        </div>
      )}

      {metro ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-hero-foreground/10 p-4">
            <div className="flex items-start gap-3">
              <Pill className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">{lhd.centre}</p>
                <p className="mt-1 text-sm text-hero-foreground/85">
                  {lhd.centreDetail}
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-hero-foreground/85">
            Free Take-Home Naloxone is available under the Commonwealth program
            from Community Health Centre NSPs and participating Section 90
            pharmacies — no prescription required.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="gap-2">
              <a
                href="https://www.health.nsw.gov.au/aod/programs/Pages/naloxone.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Pill className="h-4 w-4" aria-hidden />
                Find Take-Home Naloxone
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
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-hero-foreground/10 p-4">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">
                  NUAA Mail-Order Naloxone Program
                </p>
                <p className="mt-1 text-sm text-hero-foreground/85">
                  For regional and isolated areas, the NSW Users and AIDS
                  Association posts free naloxone statewide with training
                  resources. {lhd.centreDetail}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="gap-2">
              <a
                href="https://nuaa.org.au/naloxone"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Order NUAA Mail-Order Naloxone
              </a>
            </Button>
            <Button asChild variant="secondary" className="gap-2">
              <a href="tel:131126">
                <Phone className="h-4 w-4" aria-hidden />
                24/7 Poisons Info · 13 11 26
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
