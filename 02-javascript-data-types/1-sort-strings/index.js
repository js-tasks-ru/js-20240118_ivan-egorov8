/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const collator = new Intl.Collator(
    ['ru', 'en-US'],
    {
      sensitivity: 'variant',
      caseFirst: 'upper',
    },
  );
  const arrCopy = [...arr];
  const sortingMap = {
    asc: (items) => items.sort(collator.compare),
    desc: (items) => items.sort((a, b) => collator.compare(b, a)),
  };
  return sortingMap[param](arrCopy);
}
