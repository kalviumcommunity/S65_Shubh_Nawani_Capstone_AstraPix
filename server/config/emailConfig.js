const validateEmailConfig = () => {
  const requiredVars = ["EMAIL_USER", "EMAIL_PASS"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      "Missing required email configuration:",
      missingVars.join(", "),
    );
    throw new Error("Email configuration incomplete");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(process.env.EMAIL_USER)) {
    throw new Error("Invalid EMAIL_USER format");
  }
};

module.exports = validateEmailConfig;
