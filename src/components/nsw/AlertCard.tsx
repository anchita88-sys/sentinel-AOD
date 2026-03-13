import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DrugAlert } from "@/lib/nsw-data";

const SEVERITY: Record<
  DrugAlert["severity"],
  { label: string; badge: string; bar: string }
> = {
  critical: {
    label: "Critical",
    badge: "bg-critical text-critical-foreground",
    bar: "bg-critical",
  },
  caution: {
    label: "Caution",
    badge: "bg-caution text-caution-foreground",
    bar: "bg-caution",
  },
  info: {
    label: "Advisory",
    badge: "bg-info text-info-foreground",
    bar: "bg-info",
  },
};

export function AlertCard({ alert }: { alert: DrugAlert }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY[alert.severity];
  const isPeer = alert.provenance === "peer";

  return (
    <article className="theme-transition relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-card">
      <span className={cn("absolute inset-y-0 left-0 w-1.5", sev.bar)} aria-hidden />
      <div className="flex flex-col gap-4 p-5 pl-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
              sev.badge,
            )}
          >
            {sev.label}
          </span>
          {isPeer ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-peer px-2.5 py-0.5 text-xs font-semibold text-peer-foreground">
              ⚠️ Peer Sourced (Clinical Validation Pending)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Validated State Advisory
            </span>
          )}
          {alert.live && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-success-foreground">
              <Radio className="h-3.5 w-3.5" aria-hidden />
              Live feed
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-snug">{alert.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {alert.summary}
          </p>
        </div>

        {alert.clinicalGuidance.length > 0 && (
          <div className="rounded-lg bg-surface p-4 text-surface-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Clinical guidance
            </p>
            <ul className="mt-2 space-y-1.5">
              {alert.clinicalGuidance.map((g) => (
                <li key={g} className="flex gap-2 text-sm">
                  <span
                    className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", sev.bar)}
                    aria-hidden
                  />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Source & Verification */}
        <div className="rounded-lg border border-border">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
              Data Source &amp; Verification
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {open && (
            <dl className="grid gap-x-4 gap-y-2 border-t border-border px-4 py-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Issuing body
                </dt>
                <dd>{alert.issuingBody}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Publication timestamp
                </dt>
                <dd>{alert.publishedAt}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Document identifier
                </dt>
                <dd className="font-mono text-xs">{alert.documentId}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Provenance
                </dt>
                <dd>
                  {isPeer
                    ? "Peer network — clinical validation pending"
                    : "NSW Health verified advisory"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <a
                  href={alert.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View source document
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </dl>
          )}
        </div>
      </div>
    </article>
  );
}
