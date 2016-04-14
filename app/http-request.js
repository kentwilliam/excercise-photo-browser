/// *Barebones* tool to encapsulate the XHR details around running http requests

export default function httpRequest (
  method = 'get',
  url,
  onSuccess = noOp,
  onError = noOp
) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function() {
    httpSuccess(xhr.status) ? onSuccess(xhr) : onError(xhr);
  }

  xhr.open(method, url, true);

  return xhr.send();
}

function httpSuccess (status) {
  return status >= 200 && status < 300;
}

function noOp () {}
