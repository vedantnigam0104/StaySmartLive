export default function Image({src, ...rest}) {
  // Check if src is not empty and does not already include 'http' or 'uploads'
  if (src && !src.includes('http') && !src.startsWith('uploads/')) {
    src = 'https://staysmart-uxcc.onrender.com/uploads/' + src;
  }
  else
  {
    src = 'https://staysmart-uxcc.onrender.com/' + src;
  }

  //console.log('Image source:', 'https://staysmart-uxcc.onrender.com/' + src); // Debugging line

  return (
    <img {...rest} src={src} alt={'Image not available'} />
  );
}
