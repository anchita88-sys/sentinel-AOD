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

export interface EventArea {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  peerGuidance: string[];
}

export interface HospitalFacility {
  id: string;
  lhdId: string;
  name: string;
  level: 4 | 5;
  location: string;
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

// Level 4/5 public hospitals with emergency departments that can treat
// overdose and administer naloxone. Listed per LHD for finer local selection.
export const HOSPITAL_FACILITIES: HospitalFacility[] = [
  { id: "svh", lhdId: "sydney", name: "St Vincent's Hospital", level: 5, location: "Darlinghurst" },
  { id: "sydh", lhdId: "sydney", name: "Sydney Hospital & Sydney Eye Hospital", level: 4, location: "Sydney CBD" },
  { id: "rpa", lhdId: "svsydney", name: "Royal Prince Alfred Hospital", level: 5, location: "Camperdown" },
  { id: "pow", lhdId: "sesydney", name: "Prince of Wales Hospital", level: 5, location: "Randwick" },
  { id: "stgeorge", lhdId: "sesydney", name: "St George Hospital", level: 4, location: "Kogarah" },
  { id: "sutherland", lhdId: "sesydney", name: "Sutherland Hospital", level: 4, location: "Caringbah" },
  { id: "westmead", lhdId: "wsydney", name: "Westmead Hospital", level: 5, location: "Westmead" },
  { id: "blacktown", lhdId: "wsydney", name: "Blacktown Hospital", level: 4, location: "Blacktown" },
  { id: "auburn", lhdId: "wsydney", name: "Auburn Hospital", level: 4, location: "Auburn" },
  { id: "liverpool", lhdId: "swsydney", name: "Liverpool Hospital", level: 5, location: "Liverpool" },
  { id: "campbelltown", lhdId: "swsydney", name: "Campbelltown Hospital", level: 4, location: "Campbelltown" },
  { id: "fairfield", lhdId: "swsydney", name: "Fairfield Hospital", level: 4, location: "Fairfield" },
  { id: "rns", lhdId: "nsydney", name: "Royal North Shore Hospital", level: 5, location: "St Leonards" },
  { id: "hornsby", lhdId: "nsydney", name: "Hornsby Ku-ring-gai Hospital", level: 4, location: "Hornsby" },
  { id: "monavale", lhdId: "nsydney", name: "Mona Vale Hospital", level: 4, location: "Mona Vale" },
  { id: "nepean", lhdId: "nbm", name: "Nepean Hospital", level: 4, location: "Kingswood" },
  { id: "gosford", lhdId: "cc", name: "Gosford Hospital", level: 4, location: "Gosford" },
  { id: "wyong", lhdId: "cc", name: "Wyong Hospital", level: 4, location: "Wyong" },
  { id: "wollongong", lhdId: "illawarra", name: "Wollongong Hospital", level: 4, location: "Wollongong" },
  { id: "johnhunter", lhdId: "hne", name: "John Hunter Hospital", level: 5, location: "New Lambton" },
  { id: "tamworth", lhdId: "hne", name: "Tamworth Hospital", level: 4, location: "Tamworth" },
  { id: "dubbo", lhdId: "wnsw", name: "Dubbo Base Hospital", level: 4, location: "Dubbo" },
  { id: "orange", lhdId: "wnsw", name: "Orange Health Service", level: 4, location: "Orange" },
  { id: "bathurst", lhdId: "wnsw", name: "Bathurst Hospital", level: 4, location: "Bathurst" },
  { id: "brokenhill", lhdId: "farwest", name: "Broken Hill Health Service", level: 4, location: "Broken Hill" },
  { id: "wagga", lhdId: "murrumbidgee", name: "Wagga Wagga Base Hospital", level: 4, location: "Wagga Wagga" },
  { id: "bega", lhdId: "southernnsw", name: "South East Regional Hospital", level: 4, location: "Bega" },
  { id: "goulburn", lhdId: "southernnsw", name: "Goulburn Base Hospital", level: 4, location: "Goulburn" },
  { id: "coffs", lhdId: "mnc", name: "Coffs Harbour Health Campus", level: 4, location: "Coffs Harbour" },
  { id: "portmacquarie", lhdId: "mnc", name: "Port Macquarie Base Hospital", level: 4, location: "Port Macquarie" },
  { id: "lismore", lhdId: "northernnsw", name: "Lismore Base Hospital", level: 4, location: "Lismore" },
  { id: "tweed", lhdId: "northernnsw", name: "The Tweed Hospital", level: 4, location: "Tweed Heads" },
];

export function hospitalsForLhd(lhdId: string): HospitalFacility[] {
  return HOSPITAL_FACILITIES.filter((h) => h.lhdId === lhdId).sort(
    (a, b) => b.level - a.level || a.name.localeCompare(b.name),
  );
}

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

// Event and nightlife areas — broader regions for people at festivals, clubs,
// or going out (not LHD / hospital clinical pathways).
export const EVENT_AREAS: EventArea[] = [
  {
    id: "sydney-cbd",
    name: "Sydney CBD & inner city",
    subtitle: "Clubs, bars, and city events",
    lat: -33.868,
    lng: 151.209,
    peerGuidance: [
      "Look for event medical or harm reduction stalls at large events.",
      "Move to a cool, quieter area if someone is overheating — crowds trap heat.",
      "Never leave someone alone if they are confused or unwell.",
    ],
  },
  {
    id: "eastern-beaches",
    name: "Eastern suburbs & beaches",
    subtitle: "Coastal venues and beach events",
    lat: -33.89,
    lng: 151.27,
    peerGuidance: [
      "Hydrate steadily — heat and dancing combine quickly near the coast.",
      "Find shade or air conditioning if someone feels faint or agitated.",
      "Ask venue staff or security for help accessing medical support.",
    ],
  },
  {
    id: "inner-west",
    name: "Inner west",
    subtitle: "Local venues, warehouses, and pop-up events",
    lat: -33.89,
    lng: 151.15,
    peerGuidance: [
      "Start low and go slow — strength varies between batches.",
      "Check in with your group regularly and share plans to get home.",
      "Call 000 if someone will not respond or has chest pain.",
    ],
  },
  {
    id: "western-sydney",
    name: "Western Sydney",
    subtitle: "Suburban nightlife and festival grounds",
    lat: -33.81,
    lng: 150.99,
    peerGuidance: [
      "Plan transport before you go out — avoid driving if using substances.",
      "Carry water and take regular breaks from the dance floor.",
      "Use a designated sober friend to watch for overheating.",
    ],
  },
  {
    id: "newcastle",
    name: "Newcastle & Hunter Coast",
    subtitle: "Harbour events and coastal festivals",
    lat: -32.928,
    lng: 151.781,
    peerGuidance: [
      "Coastal wind can hide dehydration — drink water even if you do not feel hot.",
      "Know where the nearest open pharmacy or open clinic is before the event.",
      "Seek help early for agitation or a racing heartbeat.",
    ],
  },
  {
    id: "wollongong",
    name: "Wollongong & South Coast",
    subtitle: "University events, beaches, and regional festivals",
    lat: -34.427,
    lng: 150.893,
    peerGuidance: [
      "Beach events combine sun, heat, and stimulants — pace yourself.",
      "Do not mix alcohol with stimulants — it masks warning signs.",
      "Call 000 for seizures, chest pain, or very high temperature.",
    ],
  },
  {
    id: "central-coast",
    name: "Central Coast",
    subtitle: "Coastal venues and outdoor events",
    lat: -33.43,
    lng: 151.34,
    peerGuidance: [
      "Outdoor events can get hot fast — rest in shade between sets.",
      "Stick with people you trust and agree on a meeting point.",
      "Ask event staff for medical help rather than waiting it out.",
    ],
  },
  {
    id: "northern-rivers",
    name: "Byron Bay & Northern Rivers",
    subtitle: "Festivals, camping events, and coastal gatherings",
    lat: -28.647,
    lng: 153.602,
    peerGuidance: [
      "Camping festivals mean long days — sleep, eat, and hydrate between nights.",
      "Heat builds up in tents and crowds — cool someone down early.",
      "Regional events may have on-site medics — locate them when you arrive.",
    ],
  },
  {
    id: "regional-nsw",
    name: "Regional NSW festivals",
    subtitle: "Country shows, regional events, and touring festivals",
    lat: -32.25,
    lng: 148.6,
    peerGuidance: [
      "Services can be far apart — save emergency numbers before you arrive.",
      "Share your location with a trusted contact outside the event.",
      "Carry naloxone if opioids may be present — stimulant contamination is a known risk.",
    ],
  },
];

export function nearestEventArea(lat: number, lng: number): EventArea {
  let best = EVENT_AREAS[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const area of EVENT_AREAS) {
    const d = (area.lat - lat) ** 2 + (area.lng - lng) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = area;
    }
  }
  return best;
}

// Adaptive "Signs of Overdose" markers by sector.
export const OVERDOSE_MARKERS: Record<
  Sector,
  { label: string; examples: string; markers: string[] }
> = {
  community: {
    label: "Opioid overdose",
    examples:
      "Heroin, fentanyl, oxycodone, morphine, codeine, and nitazenes",
    markers: [
      "Very small (pinpoint) pupils",
      "Slow or stopped breathing",
      "Blue or grey lips and fingertips",
      "Will not wake up or respond",
    ],
  },
  nightlife: {
    label: "Stimulant overdose or overheating",
    examples:
      "MDMA (ecstasy), cocaine, methamphetamine (ice), and amphetamine (speed)",
    markers: [
      "Very high body temperature",
      "Agitation, confusion, or seizures",
      "Stiff or rigid muscles",
      "Fast heartbeat or chest pain",
    ],
  },
};
