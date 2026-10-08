// Runs only for the root address ("/"). Sends each visitor to /en/ or /pt-br/.
//
// Order of decisions:
//   1. A language the visitor picked with the switch (the "lang" cookie).
//   2. Visitors located in Brazil get Brazilian Portuguese.
//   3. The visitor's browser languages, in their order of preference:
//      any Portuguese (pt, pt-BR, pt-PT) -> Brazilian Portuguese, English -> English,
//      Italian -> Italian.
//   4. Everyone else gets English.
//
// To add a language: create site/<code>/, add the code to SUPPORTED and a line to
// fromBrowserTag, and add its hreflang link and switch link to every page.

const SUPPORTED = ["en", "pt-br", "it"];
const DEFAULT = "en";

function fromBrowserTag(tag) {
  const primary = tag.toLowerCase().split("-")[0];
  if (primary === "pt") return "pt-br";
  if (primary === "en") return "en";
  if (primary === "it") return "it";
  return null;
}

function fromAcceptLanguage(header) {
  if (!header) return null;
  const prefs = header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.trim(), q: q ? parseFloat(q.slice(2)) : 1, i };
    })
    .filter((p) => p.tag && p.tag !== "*" && p.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  for (const p of prefs) {
    const lang = fromBrowserTag(p.tag);
    if (lang) return lang;
  }
  return null;
}

function fromCookie(header) {
  const match = /(?:^|;\s*)lang=([^;]+)/.exec(header || "");
  return match && SUPPORTED.includes(match[1]) ? match[1] : null;
}

export function chooseLanguage(request) {
  return (
    fromCookie(request.headers.get("Cookie")) ||
    (request.cf && request.cf.country === "BR" ? "pt-br" : null) ||
    fromAcceptLanguage(request.headers.get("Accept-Language")) ||
    DEFAULT
  );
}

export function onRequest({ request }) {
  const url = new URL(request.url);
  const lang = chooseLanguage(request);
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/${lang}/${url.search}`,
      Vary: "Accept-Language, Cookie",
      "Cache-Control": "private, no-store",
    },
  });
}
