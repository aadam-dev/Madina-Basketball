'use client';

interface GoogleSheetsEmbedProps {
  sheetUrl: string;
  title?: string;
  className?: string;
  height?: string;
}

export default function GoogleSheetsEmbed({
  sheetUrl,
  title,
  className = '',
  height = '600px',
}: GoogleSheetsEmbedProps) {
  // Convert Google Sheets URL to embed format
  // Example: https://docs.google.com/spreadsheets/d/SHEET_ID/edit?gid=GID#gid=GID
  // To: https://docs.google.com/spreadsheets/d/SHEET_ID/preview?gid=GID
  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const sheetIdIndex = pathParts.findIndex(part => part === 'd');
      
      if (sheetIdIndex !== -1 && pathParts[sheetIdIndex + 1]) {
        const sheetId = pathParts[sheetIdIndex + 1];
        // Preserve gid parameter if present
        const gid = urlObj.searchParams.get('gid') || urlObj.hash.match(/gid=([^&]+)/)?.[1];
        const embedUrl = gid 
          ? `https://docs.google.com/spreadsheets/d/${sheetId}/preview?gid=${gid}`
          : `https://docs.google.com/spreadsheets/d/${sheetId}/preview`;
        return embedUrl;
      }
      
      // If URL is already in embed format or different format, try to extract ID
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const gid = url.match(/[?&#]gid=([^&]+)/)?.[1];
        return gid
          ? `https://docs.google.com/spreadsheets/d/${match[1]}/preview?gid=${gid}`
          : `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
      }
      
      return url; // Return original if we can't parse it
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(sheetUrl);

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
      )}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <iframe
          src={embedUrl}
          title={title || 'Google Sheets Dashboard'}
          style={{ width: '100%', height, border: 'none' }}
          allowFullScreen
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 <strong>Note:</strong> If the dashboard doesn't load, make sure the Google Sheet is set to "Anyone with the link can view"
      </p>
    </div>
  );
}

