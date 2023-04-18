import { randomEmail, randomNumber, randomString } from '../../src/utils/rand';

describe('createRandomString', () => {
  test('returns a string of default length 8', () => {
    const str = randomString();
    expect(typeof str).toBe('string');
    expect(str.length).toBe(8);
  });

  test('returns a string of given length', () => {
    const len = 12;
    const str = randomString(len);
    expect(typeof str).toBe('string');
    expect(str.length).toBe(len);
  });

  test('returns a string consisting of allowed characters', () => {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const str = randomString();
    for (let i = 0; i < str.length; i++) {
      expect(allowedChars).toContain(str[i]);
    }
  });

  test('returns 10000 different random strings', () => {
    const strSet = new Set<string>();
    for (let i = 0; i < 10000; i++) {
      const str = randomString();
      expect(typeof str).toBe('string');
      expect(str.length).toBe(8);
      expect(strSet.has(str)).toBe(false);
      strSet.add(str);
    }
  });
});

describe('createRandomEmail', () => {
  it('should generate an email with the correct length and domain', () => {
    const len = 10;
    const domain = 'example';
    const tld = 'com';
    const email = randomEmail(len, domain, tld);

    const [randUsername, randHost] = email.split('@');
    const [createdDomain, createdTld] = randHost.split('.');
    expect(randUsername.length).toBe(len);
    expect(createdDomain.length).toBe(domain.length);
    expect(createdTld).toBe(tld);
  });

  it('should generate an email with default values', () => {
    const email = randomEmail();

    const [randUsername, randHost] = email.split('@');
    const [createdDomain, createdTld] = randHost.split('.');
    expect(randUsername.length).toBe(8);
    expect(createdDomain.length).toBe('gmail'.length);
    expect(createdTld).toBe('com');
  });
});

describe('randomNumber', () => {
  test('returns a number between min and max (inclusive)', () => {
    const min = 1;
    const max = 10;
    for (let i = 0; i < 10000; i++) {
      const num = randomNumber(min, max);
      expect(num).toBeGreaterThanOrEqual(min);
      expect(num).toBeLessThanOrEqual(max);
    }
  });
});
