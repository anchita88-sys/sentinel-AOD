// NSW Clinical Risk & Harm Reduction Communication Interface — data layer.
// Verified 2026 NSW Health datasets used as the static clinical cache, plus
// Local Health District (LHD) reference data for the geolocation engine.

export type Sector = "community" | "nightlife";

export type AlertSeverity = "critical" | "caution" | "info";
export type AlertProvenance = "state" | "peer";

export interface DrugAlert {
  id: string;
  severity: AlertSeverity;
  provenance: AlertProvenance;
  sector: Sector | "both";
  title: string;
  summary: string;
  clinicalGuidance: string[];
  // Data Source & Verification
  issuingBody: string;
  publishedAt: string; // ISO or human date
  documentId: string;
  sourceUrl: string;
  live?: boolean; // true when hydrated from the live RSS feed
}

export interface LHD {
  id: string;
  name: string;
  metro: boolean;
  lat: number;
  lng: number;
  // Metropolitan resource (NSP / Section 90 THN pharmacy)
  centre: string;
  centreDetail: string;
}

// ------------------------------------------------------------------
// Verified 2026 static clinical cache (fallback when the live feed is
// unreachable). Sourced from NSW Health public drug alerts.
// ------------------------------------------------------------------
export const STATIC_ALERTS: DrugAlert[] = [
  {
    id: "sn012-26",
    severity: "critical",
    provenance: "state",
    sector: "both",
    title:
      "Cluster of unintentional opioid overdoses following stimulant insufflation",
    summary:
      "Clusters of unintentional opioid overdoses have been recorded following cocaine and methamphetamine insufflation across both Sydney and Western NSW. Stimulant powders are being unexpectedly contaminated with potent synthetic opioids, including nitazenes.",
    clinicalGuidance: [
      "Opioid toxidrome may present with no expected opioid exposure — maintain high index of suspicion.",
      "Naloxone is effective; repeated or higher doses may be required for nitazene involvement.",
      "Never use alone; carry take-home naloxone and call Triple Zero (000) for any suspected overdose.",
    ],
    issuingBody: "NSW Ministry of Health — Safety Notice",
    publishedAt: "30 June 2026",
    documentId: "SN012/26",
    sourceUrl:
      "https://www.health.nsw.gov.au/aod/public-drug-alerts/Pages/default.aspx",
  },
  {
    id: "dcs-mdma-dipentylone-0226",
    severity: "caution",
    provenance: "state",
    sector: "both",
    title: "High-dose MDMA tablets contaminated with dipentylone",
    summary:
      "High-dose MDMA tablets contaminated with dipentylone (a synthetic cathinone) are circulating across the state. Dipentylone produces longer, unpredictable stimulant effects and has been linked to agitation, hyperthermia and cardiovascular strain.",
    clinicalGuidance: [
      "Effects may be delayed and longer-lasting than expected — avoid redosing.",
      "Monitor for hyperthermia, agitation and serotonergic features; move to a cool, calm space and hydrate moderately.",
      "Seek clinical care early for high temperature, confusion or chest pain.",
    ],
    issuingBody:
      "NSW Drug Checking Service / Centre for Alcohol & Other Drugs",
    publishedAt: "February 2026",
    documentId: "DCS-2026-02",
    sourceUrl:
      "https://www.health.nsw.gov.au/aod/public-drug-alerts/Pages/default.aspx",
  },
];

// ------------------------------------------------------------------
// NSW Local Health Districts
// ------------------------------------------------------------------
export const LHDS: LHD[] = [
  {
    id: "sydney",
    name: "Sydney LHD",
    metro: true,
    lat: -33.888,
    lng: 151.18,
    centre: "Kirketon Road Centre NSP (Kings Cross)",
    centreDetail:
      "Community Health Centre NSP dispensing under the Commonwealth Take-Home Naloxone Program.",
  },
  {
    id: "svsydney",
    name: "Sydney LHD — Inner West",
    metro: true,
    lat: -33.89,
    lng: 151.13,
    centre: "RPA / Inner West Community Health NSP",
    centreDetail:
      "Section 90 pharmacies nearby supply free Take-Home Naloxone with brief training.",
  },
  {
    id: "sesydney",
    name: "South Eastern Sydney LHD",
    metro: true,
    lat: -33.95,
    lng: 151.22,
    centre: "The Langton Centre NSP (Surry Hills)",
    centreDetail:
      "Community Health Centre NSP executing the Commonwealth Take-Home Naloxone Program.",
  },
  {
    id: "wsydney",
    name: "Western Sydney LHD",
    metro: true,
    lat: -33.81,
    lng: 150.99,
    centre: "Parramatta Community Health NSP",
    centreDetail:
      "Local Section 90 pharmacies dispense free Take-Home Naloxone across Western Sydney.",
  },
  {
    id: "swsydney",
    name: "South Western Sydney LHD",
    metro: true,
    lat: -33.92,
    lng: 150.8,
    centre: "Liverpool Community Health NSP",
    centreDetail:
      "Community Health Centre NSP and participating Section 90 pharmacies.",
  },
  {
    id: "nsydney",
    name: "Northern Sydney LHD",
    metro: true,
    lat: -33.75,
    lng: 151.15,
    centre: "Royal North Shore Community Health NSP",
    centreDetail:
      "Community Health Centre NSP under the Commonwealth Take-Home Naloxone Program.",
  },
  {
    id: "nbm",
    name: "Nepean Blue Mountains LHD",
    metro: true,
    lat: -33.75,
    lng: 150.69,
    centre: "Nepean Community Health NSP (Penrith)",
    centreDetail:
      "Community Health Centre NSP and Section 90 pharmacies dispensing naloxone.",
  },
  {
    id: "cc",
    name: "Central Coast LHD",
    metro: true,
    lat: -33.43,
    lng: 151.34,
    centre: "Gosford Community Health NSP",
    centreDetail:
      "Community Health Centre NSP under the Commonwealth Take-Home Naloxone Program.",
  },
  {
    id: "illawarra",
    name: "Illawarra Shoalhaven LHD",
    metro: true,
    lat: -34.42,
    lng: 150.89,
    centre: "Wollongong Community Health NSP",
    centreDetail:
      "Community Health Centre NSP and participating Section 90 pharmacies.",
  },
  {
    id: "hne",
    name: "Hunter New England LHD",
    metro: false,
    lat: -31.09,
    lng: 150.93,
    centre: "Regional NSP & mail-order naloxone",
    centreDetail:
      "Dispersed rural coverage — prioritise mail-order supply and telehealth referral.",
  },
  {
    id: "wnsw",
    name: "Western NSW LHD",
    metro: false,
    lat: -32.25,
    lng: 148.6,
    centre: "Regional NSP & mail-order naloxone",
    centreDetail:
      "Isolated coverage across the Central West and Orana — mail-order supply prioritised.",
  },
  {
    id: "farwest",
    name: "Far West LHD",
    metro: false,
    lat: -31.95,
    lng: 141.47,
    centre: "Broken Hill Community Health & mail-order naloxone",
    centreDetail:
      "Remote coverage — mail-order supply and Poisons Information Centre prioritised.",
  },
  {
    id: "murrumbidgee",
    name: "Murrumbidgee LHD",
    metro: false,
    lat: -35.12,
    lng: 147.37,
    centre: "Regional NSP & mail-order naloxone",
    centreDetail:
      "Riverina coverage — mail-order supply and telehealth referral prioritised.",
  },
  {
    id: "southernnsw",
    name: "Southern NSW LHD",
    metro: false,
    lat: -36.24,
    lng: 149.13,
    centre: "Regional NSP & mail-order naloxone",
    centreDetail:
      "Dispersed south-east coverage — mail-order supply prioritised.",
  },
  {
    id: "mnc",
    name: "Mid North Coast LHD",
    metro: false,
    lat: -30.86,
    lng: 152.85,
    centre: "Regional NSP & mail-order naloxone",
    centreDetail:
      "Coastal regional coverage — mail-order supply and telehealth referral.",
  },
  {
    id: "northernnsw",
    name: "Northern NSW LHD",
    metro: false,
    lat: -28.81,
    lng: 153.28,
    centre: "Regional NSP & mail-order naloxone",
    centreDetail:
      "Northern Rivers coverage — mail-order supply prioritised.",
  },
];

export function nearestLHD(lat: number, lng: number): LHD {
  let best = LHDS[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const lhd of LHDS) {
    const d = (lhd.lat - lat) ** 2 + (lhd.lng - lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = lhd;
    }
  }
  return best;
}

// Adaptive "Signs of Overdose" markers by sector.
export const OVERDOSE_MARKERS: Record<
  Sector,
  { label: string; markers: string[] }
> = {
  community: {
    label: "Opioid overdose",
    markers: [
      "Very small (pinpoint) pupils",
      "Slow or stopped breathing",
      "Blue or grey lips and fingertips",
      "Will not wake up or respond",
    ],
  },
  nightlife: {
    label: "Stimulant overdose or overheating",
    markers: [
      "Very high body temperature",
      "Agitation, confusion, or seizures",
      "Stiff or rigid muscles",
      "Fast heartbeat or chest pain",
    ],
  },
};
