// For some reason, the response string is wrapped in `jsonFlickrApi(…)`
export default function unwrap (jsonString) {
  return jsonString
    .replace(/^jsonFlickrApi\(/, '')
    .replace(/\)$/, '');
}
