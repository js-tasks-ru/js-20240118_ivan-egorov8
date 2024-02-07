/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  // массив массивов с повторяющимися символами
  // Например, для "xxxaxxx" будет [["x", "x", "x"], ["a"], ["x", "x", "x"]]
  const repeatedChars = [];

  string.split('').forEach((char, idx, chars) => {
    const previousChar = chars[idx - 1];
    if (char !== previousChar) {
      repeatedChars.push([]);
    }
    repeatedChars.at(-1).push(char);
  });

  // массив со строками, обрезанными по допустимому размеру
  const trimedStrings = repeatedChars.map((chars) => {
    if (chars.length > size) {
      chars.length = size;
    }
    return chars.join('');
  });

  return trimedStrings.join('');
}
