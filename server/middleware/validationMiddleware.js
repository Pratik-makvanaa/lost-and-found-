// middleware/validationMiddleware.js
const { body, validationResult } = require("express-validator");

// User validations
const validateSignup = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("rollno").trim().notEmpty().withMessage("Roll number is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .custom((email) => typeof email === "string" && email.includes("@"))
    .withMessage("Email must include @")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .custom((email) => typeof email === "string" && email.includes("@"))
    .withMessage("Email must include @")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Item validations

const validateItem = [
  body("itemname")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Item name must be between 3 and 100 characters"),

  body("itemdescription")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("concerntype")
    .isIn(["lost", "found"])
    .withMessage("Concern type must be lost or found"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    next();
  }
];


// Claimant validations
const validateClaimant = [
  body("claimantname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("mobilenumber")
    .trim()
    .custom((mobile) => {
      if (!/^[+\d\s().-]+$/.test(mobile)) return false;
      const digitCount = mobile.replace(/\D/g, "").length;
      return digitCount >= 7 && digitCount <= 15;
    })
    .withMessage("Enter a valid mobile number"),
  body("hostelname")
    .trim()
    .notEmpty()
    .withMessage("Hostel name or place name is required"),
  body("proofofclaim")
    .trim()
    .notEmpty()
    .withMessage("Proof of claim is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Helper validations
const validateHelper = [
  body("helpername")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("mobilenumber")
    .trim()
    .custom((mobile) => {
      if (!/^[+\d\s().-]+$/.test(mobile)) return false;
      const digitCount = mobile.replace(/\D/g, "").length;
      return digitCount >= 7 && digitCount <= 15;
    })
    .withMessage("Enter a valid mobile number"),
  body("hostelname")
    .trim()
    .notEmpty()
    .withMessage("Hostel name or place name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateSignup,
  validateLogin,
  validateItem,
  validateClaimant,
  validateHelper,
};
