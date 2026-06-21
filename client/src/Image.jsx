export default function Image({ src, ...rest }) {
  if (!src) {
    return <img {...rest} alt="Image not available" />;
  }

  // If it's a relative image uploaded locally (not a full URL)
  if (!src.includes('http') && !src.startsWith('uploads/')) {
    src = 'https://staysmartlive.onrender.com/uploads/' + src;
  } else if (src.startsWith('uploads/')) {
    src = 'https://staysmartlive.onrender.com/' + src;
  }
  // Else, it's a full external URL – do nothing

  return (
    <img {...rest} src={src} alt="Image not available" />
  );
}
