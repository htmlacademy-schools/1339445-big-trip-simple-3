export function getRandomInt(from, to) {
  // Get random Int in range: [from, to)
  if (to < from) {
    throw Error('Incorrect range');
  }
  return Math.floor(Math.random() * (to - from)) + from;
}

export function getTrueWithChance(chance = 0.5) {
  // Gets true with given chance. chance is float between 0 and 1
  return Math.random() < chance;
}

export function getLoremIpsum(wordsNumber) {
  // Get lorem ipsum text with given words number
  const loremIpsumText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
  `;
  const loremIpsumWords = loremIpsumText.trim().split(/\s+/);
  const result = [];
  const k = Math.floor(wordsNumber / loremIpsumWords.length);
  for (let i = 0; i < k; ++i) {
    result.push(...loremIpsumWords);
  }
  result.push(...loremIpsumWords.slice(0, wordsNumber % loremIpsumWords.length));
  return result.join(' ');
}

export function getRandomElement(array) {
  const index = getRandomInt(0, array.length);
  return array[index];
}

export function sample(array, k) {
  // Gets k random unique elements from array.
  // Similar to python random.sample()

  const n = array.length;
  if (n < k) {
    throw new Error(`Can't get ${k} unique elements from array with length ${n}`);
  } else if (n === k) {
    return [...array];
  }

  // not very optimal solution
  const resultIndexes = new Set();
  for (let i = 0; i < k; ++i) {
    let currentIndex;
    do {
      currentIndex = getRandomInt(0, n);
    } while (resultIndexes.has(currentIndex));
    resultIndexes.add(currentIndex);
  }
  const result = [];
  for (const index of resultIndexes) {
    result.push(array[index]);
  }
  return result;
}

export function capitalize(string) {
  if (!string) {
    return '';
  }
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
}
