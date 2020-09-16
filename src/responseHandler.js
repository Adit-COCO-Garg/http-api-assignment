const fs = require('fs'); // pull in the file system module

const indexFile = fs.readFileSync(`${__dirname}/../client/client.html`);
const cssFile = fs.readFileSync(`${__dirname}/../client/style.css`);

// eslint-disable-next-line object-curly-newline
const headerMaker = (response, mimeType) => {
  const isXMLtype = mimeType === 'text/xml';
  const contentType = isXMLtype ? 'text/xml' : 'application/json';
  response.setHeader('Content-Type', contentType);
  return { isXMLtype }; // semantic returns (obj field makes it obvious what it is)
};

const XMLmaker = (response, ResObj, isFaliure) => {
  let xmlRes = '<response>';
  if (isFaliure) xmlRes += `<id>${ResObj[0]}</id>`;
  xmlRes += `<message>${ResObj[1]}</message>`;
  xmlRes += '</response>';
  response.write(xmlRes);
};

const jsonMaker = (response, ResObj, isFaliure) => {
  if (!isFaliure) {
    response.write(JSON.stringify({ message: ResObj[1] }));
  } else {
    response.write(JSON.stringify({ id: ResObj[0], message: ResObj[1] }));
  }
};
/**
 * Creates an apt response depending on the params. Does not end response OBJ!
 */
const responseMaker = (isXMLtype, response, ResObj, isFaliure) => {
  if (isXMLtype) {
    XMLmaker(response, ResObj, isFaliure);
  } else {
    jsonMaker(response, ResObj, isFaliure);
  }
};

const ResObjs = {
  success: ['success', 'This is a successful reponse'],
  badRequest: ['badRequest', 'Missing valid query parameter set to true'],
  badRequest2: ['badRequest', 'The Request has the require parameter'],
  unauthorized: ['unauthorized', 'Missing loggedIn query parameter set to yes'],
  unauthorized2: ['unauthorized', 'You have successfully viewed the content'],
  forbidden: ['forbidden', 'You do not have access to this content.'],
  internal: ['internal', 'Internal Server Error. Something went wrong'],
  notImplemented: ['notImplemented', 'A get request for this page has not been implemented yet. Check again later for updated content'],
  notFound: ['notFound', 'The page you are looking for was not found.'],
};

// eslint-disable-next-line no-unused-vars
const index = (response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(indexFile);
  response.end();
};

// eslint-disable-next-line no-unused-vars
const css = (response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(cssFile);
  response.end();
};

const success = (response, mimeType) => {
  response.statusCode = 200;
  const { isXMLtype } = headerMaker(response, mimeType);
  responseMaker(isXMLtype, response, ResObjs.success, false);
  response.end();
};

const badRequest = (response, mimeType, queryParams) => {
  let isQueryValid = 'valid' in queryParams;
  if (isQueryValid) {
    isQueryValid = queryParams.valid === 'true';
  }
  response.statusCode = isQueryValid ? 200 : 400;
  const { isXMLtype } = headerMaker(response, mimeType);
  const ResObj = isQueryValid ? ResObjs.badRequest2 : ResObjs.badRequest;
  responseMaker(isXMLtype, response, ResObj, true);
  response.end();
};

const unauthorized = (response, mimeType, queryParams) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  let isQueryValid = 'loggedIn' in queryParams;
  if (isQueryValid) {
    isQueryValid = queryParams.loggedIn === 'yes';
  }
  response.statusCode = queryParams.loggedIn === 'yes' ? 200 : 401;
  const ResObj = isQueryValid ? ResObjs.unauthorized2 : ResObjs.unauthorized;
  responseMaker(isXMLtype, response, ResObj, true);
  response.end();
};

const forbidden = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 403;
  responseMaker(isXMLtype, response, ResObjs.forbidden, true);
  response.end();
};

const internal = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 500;
  responseMaker(isXMLtype, response, ResObjs.internal, true);
  response.end();
};

const notImplemented = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 501;
  responseMaker(isXMLtype, response, ResObjs.notImplemented, true);
  response.end();
};

const pageNotFound = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 404;
  responseMaker(isXMLtype, response, ResObjs.notFound, true);
  response.end();
};

module.exports = {
  index,
  css,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  pageNotFound,
};
