// eslint-disable-next-line object-curly-newline
import { headerMaker, ResObjs, jsonMaker, XMLmaker } from './responseUtilities';

const fs = require('fs'); // pull in the file system module

const indexFile = fs.readFileSync(`${__dirname}/../client/client.html`);
const cssFile = fs.readFileSync(`${__dirname}/../client/style.css`);

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

// const success = (queryParams, response, mimeType) => {
//   const isXMLtype = mimeType === 'text/xml';
//   const contentType = isXMLtype ? 'text/xml' : 'application/json';
//   response.writeHead(200, { 'Content-Type': contentType });
//   if (isXMLtype) {
// eslint-disable-next-line max-len
//     response.write('<response><id>Sucess</id><message>This is a successful reponse</message></response>');
//   } else {
//     response.write(JSON.stringify({ id: 'Success', message: 'This is a successful reponse' }));
//   }
//   response.end();
// };

const success = (response, mimeType) => {
  response.statusCode = 200;
  const { isXMLtype } = headerMaker(response, mimeType);
  if (isXMLtype) {
    XMLmaker(response, ResObjs.success);
  } else {
    jsonMaker(response, ResObjs.success);
  }
  response.end();
};

const badRequest = (response, mimeType, queryParams) => {
  response.statusCode = queryParams.valid === 'true' ? 200 : 400;
  const { isXMLtype } = headerMaker(response, mimeType);
  if (isXMLtype) {
    XMLmaker(response, ResObjs.badRequest);
  } else {
    jsonMaker(response, ResObjs.badRequest);
  }
  response.end();
};

const unauthorized = (response, mimeType, queryParams) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = queryParams.loggedIn === 'yes' ? 200 : 401;
  if (isXMLtype) {
    XMLmaker(response, ResObjs.unauthorized);
  } else {
    jsonMaker(response, ResObjs.unauthorized);
  }
  response.end();
};

const forbidden = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 403;
  if (isXMLtype) {
    XMLmaker(response, ResObjs.forbidden);
  } else {
    jsonMaker(response, ResObjs.forbidden);
  }
  response.end();
};

const internal = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 500;
  if (isXMLtype) {
    XMLmaker(response, ResObjs.internalError);
  } else {
    jsonMaker(response, ResObjs.internalError);
  }
  response.end();
};

const notImplemented = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 501;
  if (isXMLtype) {
    XMLmaker(response, ResObjs.notImplemented);
  } else {
    jsonMaker(response, ResObjs.notImplemented);
  }
  response.end();
};

const pageNotFound = (response, mimeType) => {
  const { isXMLtype } = headerMaker(response, mimeType);
  response.statusCode = 404;
  if (isXMLtype) {
    XMLmaker(response, ResObjs.notFound);
  } else {
    jsonMaker(response, ResObjs.notFound);
  }
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
