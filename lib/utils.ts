export function encodeId(id: number | string) {
  try {
    return Buffer.from(String(id)).toString("base64").replace(/=+$/, "");
  } catch {
    try {
      return btoa(String(id)).replace(/=+$/, "");
    } catch {
      return String(id);
    }
  }
}

export function decodeId(encoded: string) {
  try {
    // pad base64
    const pad = encoded.length % 4 === 0 ? encoded : encoded + "=".repeat(4 - (encoded.length % 4));
    return Buffer.from(pad, "base64").toString();
  } catch {
    try {
      return atob(encoded);
    } catch {
      return encoded;
    }
  }
}
