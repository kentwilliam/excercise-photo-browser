/// Looks up an object property chain, if the property is not found it returns undefined.
///
/// Ex: getProperty({ a: { b: { c: true } } }, 'a.b.c') // true

export default function getProperty (object, path) {
  var pathSegments = path.split('.');
  var currentContext = object;

  while (pathSegments.length > 0) {
    var segment = pathSegments.shift();
    if (typeof currentContext !== 'object') {
      return;
    }
    currentContext = currentContext[segment];
  };

  return currentContext;
}
