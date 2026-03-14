import { useState } from "react";
import { Crosshair, LoaderCircle, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  LHDS,
  hospitalsForLhd,
  nearestLHD,
  type HospitalFacility,
  type LHD,
} from "@/lib/nsw-data";
import { cn } from "@/lib/utils";

type DetectState = "idle" | "locating" | "error";

export function LocationModule({
  selected,
  selectedHospital,
  onSelect,
  onHospitalSelect,
}: {
  selected: LHD | null;
  selectedHospital: HospitalFacility | null;
  onSelect: (lhd: LHD, source: "detected" | "manual") => void;
  onHospitalSelect: (hospital: HospitalFacility | null) => void;
}) {
  const [detect, setDetect] = useState<DetectState>("idle");
  const [message, setMessage] = useState<string>("");
  const hospitals = selected ? hospitalsForLhd(selected.id) : [];
  const needsHospital = hospitals.length > 0;
  const isComplete = Boolean(selected && (!needsHospital || selectedHospital));

  function detectLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setDetect("error");
      setMessage("Geolocation unavailable — please select your LHD manually.");
      return;
    }
    setDetect("locating");
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lhd = nearestLHD(pos.coords.latitude, pos.coords.longitude);
        onSelect(lhd, "detected");
        onHospitalSelect(null);
        setDetect("idle");
        setMessage(`Detected nearest district: ${lhd.name}. Now choose your nearest hospital.`);
      },
      () => {
        setDetect("error");
        setMessage(
          "Location permission denied — please select your LHD manually.",
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  return (
    <div
      className={cn(
        "theme-transition rounded-xl border-2 p-6 shadow-elevated sm:p-8",
        isComplete
          ? "border-success/40 bg-card text-card-foreground"
          : "border-primary/40 bg-card text-card-foreground",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Start here
          </p>
          <h2 className="text-lg font-bold sm:text-xl">Set your local area</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We ask for your location so we can show where to get free naloxone, your nearest level 4/5 hospital emergency department, and harm reduction services in your area. NSW health districts are large, so picking your district and hospital helps us point you to what is actually near you.
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label>Local Health District</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={detectLocation}
              disabled={detect === "locating"}
              className="gap-2 sm:shrink-0"
            >
              {detect === "locating" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Crosshair className="h-4 w-4" aria-hidden />
              )}
              {detect === "locating" ? "Detecting…" : "Detect my location"}
            </Button>

            <div className="flex-1">
              <Select
                value={selected?.id ?? ""}
                onValueChange={(id) => {
                  const lhd = LHDS.find((l) => l.id === id);
                  if (lhd) {
                    onSelect(lhd, "manual");
                    onHospitalSelect(null);
                    setMessage("");
                    setDetect("idle");
                  }
                }}
              >
                <SelectTrigger aria-label="Select Local Health District">
                  <SelectValue placeholder="Or select your Local Health District" />
                </SelectTrigger>
                <SelectContent>
                  {LHDS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                      {l.metro ? "" : " (regional)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {selected && needsHospital && (
          <div className="space-y-1.5 border-t border-border pt-4">
            <Label htmlFor="hospital-select">
              Nearest level 4/5 hospital
            </Label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Districts cover large areas. Choose the hospital nearest you — both
              level 4 and level 5 hospitals can treat overdose and give naloxone
              in their emergency department.
            </p>
            <details className="rounded-lg border border-border bg-background p-3 text-xs leading-relaxed text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground">
                What do level 4 and level 5 hospitals mean?
              </summary>
              <p className="mt-2">
                In NSW, public hospitals are grouped by the level of care they
                provide. This helps people find a hospital with the right emergency
                services nearby.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>
                  <span className="font-medium text-foreground">Level 5</span> —
                  major tertiary hospitals with specialist emergency and intensive
                  care (for example Westmead, Royal Prince Alfred, or John Hunter).
                </li>
                <li>
                  <span className="font-medium text-foreground">Level 4</span> —
                  large district or regional hospitals with full emergency
                  departments (for example Blacktown, Gosford, or Wagga Wagga Base).
                </li>
              </ul>
              <p className="mt-2">
                Both level 4 and level 5 hospitals can treat suspected overdose in
                their emergency department and administer naloxone. In an emergency,
                go to the nearest one you can reach, or call Triple Zero (000).
              </p>
            </details>
            <Select
              value={selectedHospital?.id ?? ""}
              onValueChange={(id) => {
                const hospital = hospitals.find((h) => h.id === id) ?? null;
                onHospitalSelect(hospital);
              }}
            >
              <SelectTrigger id="hospital-select" aria-label="Select hospital">
                <SelectValue placeholder="Select nearest level 4/5 hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name} — Level {h.level} ({h.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {message && (
        <p
          className={
            detect === "error"
              ? "mt-4 text-sm text-destructive"
              : "mt-4 text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
      )}

      {selected && needsHospital && !selectedHospital && (
        <p className="mt-4 text-sm font-medium text-primary">
          Select your nearest hospital to see local alerts and support services.
        </p>
      )}

      {isComplete && selected && (
        <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Location set for {selected.name}
          {selectedHospital ? ` · ${selectedHospital.name}` : ""}. Your local
          information is shown below.
        </p>
      )}
    </div>
  );
}
