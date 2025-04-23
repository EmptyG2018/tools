const iFrameStyle = {
  border: 'none',
  margin: 0,
  padding: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  display: 'block',
};

function CurlTransform() {
  return <iframe style={iFrameStyle} src="/curlconverter/index.html" />;
}

export default CurlTransform;
