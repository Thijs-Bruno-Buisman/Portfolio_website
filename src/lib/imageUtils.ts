/**
 * Client-side image compression utility using HTML5 Canvas.
 * Prevents Firestore document limit errors (1MB) and localStorage quota errors.
 */
export async function compressImage(
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Het geüploade bestand is geen geldige afbeelding.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Fout bij het lezen van het bestand.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Fout bij converteren van afbeelding.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Kan de afbeelding niet decoderen.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas context unavailable
          resolve(reader.result as string);
          return;
        }

        // Draw image smoothly onto canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-friendly JPEG data url
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
