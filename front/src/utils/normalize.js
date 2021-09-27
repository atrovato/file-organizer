const normalize = (str) => {
  return str.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Z0-9 \-.]/gi, '-')
    .replace(/\s\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
}

export default normalize;
