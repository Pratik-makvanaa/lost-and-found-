export function validateEmail(email) {
  const value = email.trim();

  if (!value) {
    return "Email is required.";
  }

  if (!value.includes("@")) {
    return "Email must include @.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address, such as name@example.com.";
  }

  return "";
}

export function validateContactDetails(name, mobile, location) {
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters long.";
  }

  const mobileDigits = mobile.replace(/\D/g, "");
  if (mobileDigits.length < 7 || mobileDigits.length > 15) {
    return "Enter a valid mobile number with 7 to 15 digits.";
  }

  if (!location.trim()) {
    return "Hostel name or place name is required.";
  }

  return "";
}
