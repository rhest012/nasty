export const formatString = (string: string) => {
  if (typeof string !== "string") return "";
  const trimmed = string.trimStart();
  return trimmed.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default formatString;
