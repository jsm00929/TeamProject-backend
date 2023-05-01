const allowedChars = 'abcdefghijklmnopqrstuvwxyz1234567890';

export function randomChar() {
  return allowedChars[Math.floor(Math.random() * allowedChars.length)];
}

export function randomString(len = 8) {
  return new Array(len)
    .fill(null)
    .map(() => randomChar())
    .join('');
}

export function randomEmail(len = 8, domain = 'gmail', tld = 'com') {
  return `${randomString(len)}@${domain}.${tld}`;
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
