export default function removeSpace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
