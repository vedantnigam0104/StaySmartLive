export default function Image({src, ...rest}) {
  // Check if src is not empty and does not already include 'http' or 'uploads'
  if (src && !src.includes('http') && !src.startsWith('uploads/')) {
    src = 'https://stay-smart-live-dzqc.vercel.app/uploads/' + src;
  }
  else
  {
    src = 'https://stay-smart-live-dzqc.vercel.app/' + src;
  }

  //console.log('Image source:', 'https://stay-smart-live-dzqc.vercel.app/' + src); // Debugging line

  return (
    <img {...rest} src={src} alt={'Image not available'} />
  );
}
