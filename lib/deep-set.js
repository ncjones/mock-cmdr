function deepSet(target, path, value) {
  const [ step, ...rest ] = path;
  if (rest.length) {
    target[step] = target[step] || {};
    deepSet(target[step], rest, value);
  } else {
    target[step] = value;
  }
}

module.exports = deepSet;
