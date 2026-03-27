export const encodeData = (data: object): string => {
  const sData = JSON.stringify(data);
  const bytes = new TextEncoder().encode(sData);

  // Build binary string in chunks to avoid RangeError from spread on large arrays
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};
