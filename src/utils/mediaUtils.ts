/**
 * Detects if a URL points to a video file based on its extension or MIME type
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;

  const urlLower = url.toLowerCase();

  // Check for data URLs with video MIME type
  if (urlLower.startsWith('data:')) {
    const mimeType = urlLower.split(';')[0].split(':')[1];
    return mimeType?.startsWith('video/') || false;
  }

  // Check for file extensions
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'm4v'];
  return videoExtensions.some(ext => urlLower.includes(`.${ext}`));
};

/**
 * Get the file extension from a URL
 */
export const getFileExtension = (url: string): string => {
  if (!url) return '';
  const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
  return match ? match[1].toLowerCase() : '';
};
