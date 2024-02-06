/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parts = path.split('.');

  return (obj) => {
    let value = obj;

    for (const part of parts) {
      if (value[part] === undefined) {
        return;
      }

      value = value[part];
    }

    return value;
  };
}
