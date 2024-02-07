/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  // массив массивов с повторяющимися символами
  // и с применением ограничения по допустимому размеру
  // Например, для "xxxaxxx" будет [["x", "x"], ["a"], ["x", "x"]]
  const repeatedChars = [];

  string.split('').forEach((char, idx, chars) => {
    const previousChar = chars[idx - 1];
    if (char !== previousChar) {
      repeatedChars.push([]);
    }
    const lastRepeatedCharsItem = repeatedChars.at(-1);
    if (lastRepeatedCharsItem.length < size) {
      lastRepeatedCharsItem.push(char);
    }
  });

  return repeatedChars.flat().join("");
}
