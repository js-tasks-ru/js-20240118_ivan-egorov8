/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const objEntries = Object.entries(obj);
  const omitedObjEntires = objEntries.filter(([key]) => !fields.includes(key));

  return Object.fromEntries(omitedObjEntires);
};
