import { useState } from "react";
import { z } from "zod";
import { Megaphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LHDS, type DrugAlert } from "@/lib/nsw-data";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(6, "Please provide a short descriptive title (min 6 characters).")
    .max(120, "Keep the title under 120 characters."),
  lhd: z.string().trim().min(1, "Select the Local Health District."),
  substance: z
    .string()
    .trim()
    .min(2, "Describe the substance involved.")
    .max(80, "Keep this under 80 characters."),
  detail: z
    .string()
    .trim()
    .min(20, "Provide at least 20 characters of clinical detail.")
    .max(1000, "Keep the report under 1000 characters."),
});

export function GrassrootsModal({
  onSubmit,
}: {
  onSubmit: (alert: DrugAlert) => void;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    lhd: "",
    substance: "",
    detail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setValues({ title: "", lhd: "", substance: "", detail: "" });
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const lhdName =
      LHDS.find((l) => l.id === parsed.data.lhd)?.name ?? parsed.data.lhd;

    onSubmit({
      id: `peer-${Date.now()}`,
      severity: "caution",
      provenance: "peer",
      sector: "both",
      title: parsed.data.title,
      summary: `${parsed.data.detail} (Substance reported: ${parsed.data.substance}.)`,
      clinicalGuidance: [
        "This is an unverified peer report awaiting clinical validation.",
        "Do not treat as confirmed NSW Health advice. Exercise caution and seek clinical care if unwell.",
      ],
      issuingBody: `Grassroots peer network — ${lhdName}`,
      publishedAt: new Date().toLocaleString("en-AU"),
      documentId: "PEER-INTAKE-PENDING",
      sourceUrl: "#",
    });

    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Megaphone className="h-4 w-4" aria-hidden />
          Grassroots Reporting Intake
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Grassroots Reporting Intake</DialogTitle>
          <DialogDescription>
            Submit an unverified anomaly observed by a peer network. Submissions
            are flagged{" "}
            <span className="font-semibold text-peer">
              ⚠️ Peer Sourced (Clinical Validation Pending)
            </span>{" "}
            and kept separate from validated state advisories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="peer-title">Report title</Label>
            <Input
              id="peer-title"
              value={values.title}
              maxLength={120}
              onChange={(e) =>
                setValues((v) => ({ ...v, title: e.target.value }))
              }
              placeholder="e.g. Unexpected sedation after stimulant use"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="peer-lhd">Local Health District</Label>
              <Select
                value={values.lhd}
                onValueChange={(val) =>
                  setValues((v) => ({ ...v, lhd: val }))
                }
              >
                <SelectTrigger id="peer-lhd">
                  <SelectValue placeholder="Select LHD" />
                </SelectTrigger>
                <SelectContent>
                  {LHDS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lhd && (
                <p className="text-xs text-destructive">{errors.lhd}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="peer-substance">Substance involved</Label>
              <Input
                id="peer-substance"
                value={values.substance}
                maxLength={80}
                onChange={(e) =>
                  setValues((v) => ({ ...v, substance: e.target.value }))
                }
                placeholder="e.g. MDMA, cocaine"
              />
              {errors.substance && (
                <p className="text-xs text-destructive">{errors.substance}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="peer-detail">Clinical detail</Label>
            <Textarea
              id="peer-detail"
              value={values.detail}
              maxLength={1000}
              rows={4}
              onChange={(e) =>
                setValues((v) => ({ ...v, detail: e.target.value }))
              }
              placeholder="Describe the anomaly, observed effects and any relevant context."
            />
            {errors.detail && (
              <p className="text-xs text-destructive">{errors.detail}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="gap-2">
              <Megaphone className="h-4 w-4" aria-hidden />
              Submit peer report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
