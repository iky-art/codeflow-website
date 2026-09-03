import { describe, it, expect } from "vitest";
import { isValidEmail, isValidUsername, isStrongEnoughPassword, validateRegisterInput } from "../../src/shared/validators";

describe("validators", () => {
  it("validates email format", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("validates username format", () => {
    expect(isValidUsername("iky_art")).toBe(true);
    expect(isValidUsername("ab")).toBe(false); // too short
    expect(isValidUsername("has space")).toBe(false);
  });

  it("validates password strength", () => {
    expect(isStrongEnoughPassword("short")).toBe(false);
    expect(isStrongEnoughPassword("longenough123")).toBe(true);
  });

  it("collects all register validation errors", () => {
    const errors = validateRegisterInput({
      name: "A",
      username: "x",
      email: "bad-email",
      password: "123",
      confirmPassword: "456",
    });
    const fields = errors.map((e) => e.field);
    expect(fields).toContain("name");
    expect(fields).toContain("username");
    expect(fields).toContain("email");
    expect(fields).toContain("password");
    expect(fields).toContain("confirmPassword");
  });

  it("passes with valid input", () => {
    const errors = validateRegisterInput({
      name: "Risky Pratama",
      username: "iky_art",
      email: "iky@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(errors).toHaveLength(0);
  });
});
