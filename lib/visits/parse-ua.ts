export type ParsedUa = {
  browser: string;
  os: string;
  device: string;
};

export function parseUserAgent(ua: string | null | undefined): ParsedUa {
  const value = ua || "";
  let browser = "Other";
  if (/Edg\//i.test(value)) browser = "Edge";
  else if (/Chrome\//i.test(value) && !/Chromium/i.test(value)) browser = "Chrome";
  else if (/Safari\//i.test(value) && !/Chrome\//i.test(value)) browser = "Safari";
  else if (/Firefox\//i.test(value)) browser = "Firefox";
  else if (/OPR\//i.test(value) || /Opera/i.test(value)) browser = "Opera";

  let os = "Other";
  if (/Android/i.test(value)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(value)) os = "iOS";
  else if (/Windows/i.test(value)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(value)) os = "macOS";
  else if (/Linux/i.test(value)) os = "Linux";

  let device = "desktop";
  if (/iPad|Tablet/i.test(value)) device = "tablet";
  else if (/Mobi|Android.*Mobile|iPhone|iPod/i.test(value)) device = "mobile";

  return { browser, os, device };
}
