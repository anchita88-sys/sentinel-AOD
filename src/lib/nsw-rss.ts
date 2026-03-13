// Live NSW Health public drug-alerts RSS retrieval with resilient proxy
// wrapping. Falls back cleanly to the verified 2026 static clinical cache.

import { STATIC_ALERTS, type DrugAlert } from "./nsw-data";

const RSS_URL =
  "https://www.health.nsw.gov.au/aod/public-drug-alerts/Pages/rss.aspx";
const PROXY = "https://api.allorigins.win/raw?url=";

export type FeedStatus = "live" | "cache";

export interface FeedResult {
  alerts: DrugAlert[];
  status: FeedStatus;
  fetchedAt: string;
}

function classifySeverity(text: string): DrugAlert["severity"] {
  const t = text.toLowerCase();
  if (
    /(death|fatal|overdose|nitazene|fentanyl|opioid|critical|urgent|life-threatening)/.test(
      t,
    )
  ) {
    return "critical";
  }
  if (/(caution|contaminat|high-dose|high dose|warning|unexpected)/.test(t)) {
    return "caution";
  }
  return "info";
}

function stripHtml(input: string): string {
  return input
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? stripHtml(m[1]) : "";
}

function parseRss(xml: string): DrugAlert[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const parsed: DrugAlert[] = [];

  items.slice(0, 8).forEach((item, index) => {
    const title = pick(item, "title");
    const description = pick(item, "description");
    if (!title) return;

    const linkMatch = item.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const link = linkMatch ? stripHtml(linkMatch[1]) : RSS_URL;
    const pubDate = pick(item, "pubDate");
    const guid = pick(item, "guid");

    parsed.push({
      id: `live-${index}-${guid.slice(-12) || title.slice(0, 12)}`,
      severity: classifySeverity(`${title} ${description}`),
      provenance: "state",
      sector: "both",
      title,
      summary:
        description ||
        "See the NSW Health public drug alert for full clinical detail.",
      clinicalGuidance: [
        "Refer to the full NSW Health alert for detailed clinical guidance.",
        "Carry naloxone, never use alone, and call Triple Zero (000) in an emergency.",
      ],
      issuingBody: "NSW Ministry of Health — Public Drug Alerts (live feed)",
      publishedAt: pubDate
        ? new Date(pubDate).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Date not provided",
      documentId: guid ? guid.slice(-16) : "LIVE-FEED",
      sourceUrl: link,
      live: true,
    });
  });

  return parsed;
}

export async function fetchDrugAlerts(): Promise<FeedResult> {
  const fetchedAt = new Date().toLocaleString("en-AU");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(`${PROXY}${encodeURIComponent(RSS_URL)}`, {
      signal: controller.signal,
      headers: { Accept: "application/rss+xml, text/xml, */*" },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Proxy responded ${res.status}`);
    const xml = await res.text();
    const alerts = parseRss(xml);

    if (alerts.length === 0) throw new Error("No items parsed from feed");
    return { alerts, status: "live", fetchedAt };
  } catch {
    // Clean fallback to the verified static clinical cache.
    return { alerts: STATIC_ALERTS, status: "cache", fetchedAt };
  }
}
