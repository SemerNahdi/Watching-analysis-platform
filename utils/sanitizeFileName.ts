export const sanitizeFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop(); // Get the file extension
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, ''); // Remove the extension

  const sanitized = nameWithoutExtension
    .replace(/[^\x00-\x7F]/g, '_') // Replace all non-ASCII characters (including emojis) with underscores
    .replace(/[^a-zA-Z0-9-_.]/g, '_') // Replace unsupported characters
    .replace(/ /g, '_'); // Replace spaces with underscores

  return `${sanitized}.${extension}`; // Reattach the extension
};
