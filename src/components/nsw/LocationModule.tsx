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
import { LHDS, nearestLHD, type LHD } from "@/lib/nsw-data";

type DetectState = "idle" | "locating" | "error";

export function LocationModule({
  selected,
  onSelect,
}: {
  selected: LHD | null;
  onSelect: (lhd: LHD, source: "detected" | "manual") => void;
}) {
  const [detect, setDetect] = useState<DetectState>("idle");
  const [message, setMessage] = useState<string>("");

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
        setDetect("idle");
        setMessage(`Detected nearest district: ${lhd.name}.`);
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
    <div className="theme-transition rounded-xl border border-border bg-card p-5 text-card-foreground shadow-card">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" aria-hidden />
        <h2 className="text-base font-semibold">Statewide geolocation</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Detect your location or choose a Local Health District to localise your
        harm reduction resource pathway.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          onClick={detectLocation}
          disabled={detect === "locating"}
          className="gap-2"
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

      {message && (
        <p
          className={
            detect === "error"
              ? "mt-3 text-sm text-destructive"
              : "mt-3 text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
