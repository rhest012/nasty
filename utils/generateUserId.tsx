const generateUserId = (surname: string) => {
  // Remove spaces and get first 3 characters
  const cleanedSurname = surname.replace(/\s/g, "");
  const prefix = cleanedSurname.slice(0, 3).toUpperCase();
  // Generate Random 3 Digits
  const numbers = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");

  return `${prefix}${numbers}`;
};

export default generateUserId;
