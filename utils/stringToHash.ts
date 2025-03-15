export default function stringToHash(value: string) {
  let hash = 5381;
  let i = value.length;

  while (i) {
    hash = (hash * 33) ^ value.charCodeAt(--i);
  }

  return (hash >>> 0).toString(36);
}
