export function filenameFromDisposition(value: string | null): string | null {
  if (!value) return null;

  const encoded = value.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.replace(/^"|"$/g, ""));
    } catch {
      return encoded;
    }
  }

  const regular = value.match(/filename=(?:"([^"]+)"|([^;]+))/i);
  return (regular?.[1] ?? regular?.[2])?.trim() ?? null;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function extensionFromContentType(contentType: string): "xlsx" | "zip" | "bin" {
  const type = contentType.toLowerCase();

  if (type.includes("spreadsheetml")) {
    return "xlsx";
  }

  if (type.includes("zip")) {
    return "zip";
  }

  return "bin";
}
