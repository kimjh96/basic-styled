export default function camelToKebab(camelCase: string): string {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
