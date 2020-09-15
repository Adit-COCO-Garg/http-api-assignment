/* eslint-disable no-console */
import * as http from 'http';
import * as urlPackage from 'url';

import * as responseHandler from './responseHandler';

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = { // dispatch table
  '/': responseHandler.index,
  '/style.css': responseHandler.css,
  '/sucess': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unathorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
};

const onRequest = ({ headers, url }, response) => { // TODO: LESS EFF - CHANGE REQ
  const mimeType = headers.accept.split(',')[0];
  const uriPath = urlPackage.parse(url, true).pathname;
  const queryParams = urlPackage.parse(uriPath, true).query;

  console.log('request object: ', { uriPath, mimeType });
  if (urlStruct[uriPath]) {
    urlStruct[uriPath](response, mimeType, queryParams);
  }
};

http.createServer(onRequest).listen(port);
// console.log('Server starting');
// console.log(`Listening on 127.0.0.1:${port}`);
