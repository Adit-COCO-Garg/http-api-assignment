const http = require('http');
const urlPackage = require('url');

const responseHandler = require('./responseHandler');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = { // dispatch table
  '/': responseHandler.index,
  '/style.css': responseHandler.css,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  '/notFound': responseHandler.pageNotFound,
};

const onRequest = (request, response) => { // TODO: LESS EFF - CHANGE REQ
  const mimeType = request.headers.accept.split(',')[0];
  const uriPath = urlPackage.parse(request.url, true).pathname;
  const queryParams = urlPackage.parse(request.url, true).query;
  // console.log({ uriPath, mimeType, queryParams });
  if (urlStruct[uriPath]) {
    urlStruct[uriPath](response, mimeType, queryParams);
  } else {
    responseHandler.pageNotFound(response, mimeType);
  }
};

http.createServer(onRequest).listen(port);
