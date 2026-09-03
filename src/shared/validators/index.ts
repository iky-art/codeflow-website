export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

export function isStrongEnoughPassword(password: string): boolean {
  return password.length >= 8;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegisterInput(input: {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!input.name || input.name.trim().length < 2) errors.push({ field: "name", message: "Nama minimal 2 karakter" });
  if (!input.username || !isValidUsername(input.username))
    errors.push({ field: "username", message: "Username 3-20 karakter, huruf/angka/underscore" });
  if (!input.email || !isValidEmail(input.email)) errors.push({ field: "email", message: "Email tidak valid" });
  if (!input.password || !isStrongEnoughPassword(input.password))
    errors.push({ field: "password", message: "Password minimal 8 karakter" });
  if (input.password !== input.confirmPassword)
    errors.push({ field: "confirmPassword", message: "Konfirmasi password tidak cocok" });
  return errors;
}
