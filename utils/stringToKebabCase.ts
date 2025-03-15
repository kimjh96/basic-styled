export default function stringToKebabCase(value: string) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}
