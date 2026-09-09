export const YOUTUBE_NOCOOKIE_EMBED_BASE = "https://www.youtube-nocookie.com/embed";

const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{6,20}$/;

export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const segments = url.pathname.split("/").filter(Boolean);

  const isYouTubeHost =
    host === "youtu.be" ||
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com";

  if (!isYouTubeHost) return null;

  if (host === "youtu.be") {
    const id = segments[0];
    return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null;
  }

  if (url.pathname === "/watch" || url.pathname === "/watch/") {
    const id = url.searchParams.get("v");
    return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null;
  }

  const pathKind = segments[0];
  const idIndex =
    pathKind === "embed" || pathKind === "shorts" || pathKind === "live"
      ? 1
      : pathKind === "v"
        ? 1
        : -1;

  if (idIndex === -1) return null;
  const id = segments[idIndex];
  return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null;
}

export function toYouTubeEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const videoId = extractYouTubeVideoId(trimmed);
  if (videoId) {
    return `${YOUTUBE_NOCOOKIE_EMBED_BASE}/${videoId}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}
