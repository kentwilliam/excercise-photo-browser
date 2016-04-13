/// Barebones tool to run a single http request
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
