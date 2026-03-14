import { useState } from "react";
import { Crosshair, LoaderCircle, PartyPopper } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EVENT_AREAS, nearestEventArea, type EventArea } from "@/lib/nsw-data";
import { cn } from "@/lib/utils";

type DetectState = "idle" | "locating" | "error";

export function EventLocationModule({
  selected,
  onSelect,
}: {
  selected: EventArea | null;
  onSelect: (area: EventArea, source: "detected" | "manual") => void;
}) {
  const [detect, setDetect] = useState<DetectState>("idle");
  const [message, setMessage] = useState<string>("");

  function detectLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setDetect("error");
      setMessage("Geolocation unavailable — please select your area manually.");
      return;
    }
    setDetect("locating");
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const area = nearestEventArea(pos.coords.latitude, pos.coords.longitude);
        onSelect(area, "detected");
        setDetect("idle");
        setMessage(`Detected nearest area: ${area.name}.`);
      },
      () => {
        setDetect("error");
        setMessage(
          "Location permission denied — please select your area manually.",
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  return (
    <div
      className={cn(
        "theme-transition rounded-xl border-2 p-6 shadow-elevated sm:p-8",
        selected
          ? "border-success/40 bg-card text-card-foreground"
          : "border-primary/40 bg-card text-card-foreground",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <PartyPopper className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Start here
          </p>
          <h2 className="text-lg font-bold sm:text-xl">Where are you tonight?</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We ask which area you are in so we can show alerts and peer support relevant to festivals, clubs, and nightlife near you. You do not need to pick a health district or hospital — just the region you are going out in.
      </p>

      <div className="mt-6 space-y-1.5">
        <Label>Event or nightlife area</Label>
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
            {detect === "locating" ? "Detecting…" : "Use my location"}
          </Button>

          <div className="flex-1">
            <Select
              value={selected?.id ?? ""}
              onValueChange={(id) => {
                const area = EVENT_AREAS.find((a) => a.id === id);
                if (area) {
                  onSelect(area, "manual");
                  setMessage("");
                  setDetect("idle");
                }
              }}
            >
              <SelectTrigger aria-label="Select event or nightlife area">
                <SelectValue placeholder="Or select the area you are in" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_AREAS.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name} — {area.subtitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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

      {selected && (
        <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Area set to {selected.name}. Event and nightlife information is shown
          below.
        </p>
      )}
    </div>
  );
}
