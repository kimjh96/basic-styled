export default function convertStringToHash(value: string) {
  let hashedValue = 0;
  for (let i = 0; i < value.length; i += 1) {
    hashedValue = Math.imul(31, hashedValue) + value.charCodeAt(i) || 0;
  }
  return Math.abs(hashedValue);
}
