const headerMaker = (response, mimeType) => {
  const isXMLtype = mimeType === 'text/xml';
  const contentType = isXMLtype ? 'text/xml' : 'application/json';
  response.setHeader('Content-Type', contentType);
  return { isXMLtype }; // semantic returns (obj field makes it obvious what it is)
};

const XMLmaker = (response, { id, message }) => {
  response.write(`<response><id>${id}</id><message>${message}</message></response>`);
};

const jsonMaker = (response, { id, message }) => {
  response.write(JSON.stringify({ id, message }));
};

const ResObjs = {
  success: ['success', 'This is a successful reponse'],
  badRequest: ['badRequest', 'Missing stuff'],
  unauthorized: ['unauthorized', 'Missing stuff'],
  forbidden: ['forbidden', 'You do not have access to this content.'],
  internal: ['internalError', 'Internal Server Error. Something went wrong'],
  notImplemented: ['notImplemented', 'A get request for this page has not been implemented yet. Check again later for updated content'],
  pageNotFound: ['notFound', 'The page you are looking for was not found.'],
};

export {
  headerMaker, jsonMaker, XMLmaker, ResObjs,
};
