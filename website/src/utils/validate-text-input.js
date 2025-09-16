/**
 * Validates the input text for the textarea input.
 * @param {string} text - The text to validate.
 * @param {function} setValidationError - The function to set the validation error.
 * @returns {boolean} - True if the text is valid, false otherwise.
 */
export const validateTextInput = (text, setValidationError) => {
  // Reset validation error
  setValidationError("");

  // Check length limits
  if (text.length > 2000) {
    setValidationError("Feedback must be less than 2000 characters");
    return false;
  }

  // Check for potential XSS patterns
  const xssPatterns = [
    /<script\b[^>]*>/gi, // matches <script ...>
    /<\/script\b[^>]*>/gi, // matches </script ...>
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
    /<link\b[^>]*>/gi,
    /<meta\b[^>]*>/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(text)) {
      setValidationError(
        "Invalid characters detected. Please remove HTML tags or scripts"
      );
      return false;
    }
  }

  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(--|\/\*|\*\/)/g,
    /('|(\\')|('')|(%27)|(%2527))/gi,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(text)) {
      setValidationError(
        "Invalid characters detected. Please use plain text only"
      );
      return false;
    }
  }

  // Check for excessive special characters (potential obfuscation)
  const specialCharRatio =
    (text.match(/[^a-zA-Z0-9\s.,!?()-]/g) || []).length / text.length;
  if (specialCharRatio > 0.3 && text.length > 10) {
    setValidationError("Too many special characters. Please use plain text");
    return false;
  }

  return true;
};
