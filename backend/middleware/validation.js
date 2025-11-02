import Joi from "joi";

// Registration validation
export const registerValidation = (data) => {
  const schema = Joi.object({
    fname: Joi.string().min(2).max(50).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
    }),
    lname: Joi.string().allow("").min(2).max(50).messages({
      "string.min": "Last name must be at least 2 characters",
    }),
    mname: Joi.string().allow("").max(50),
    gender: Joi.string().valid("Male", "Female").required().messages({
      "any.only": "Gender must be either Male or Female",
      "string.empty": "Gender is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
    }),
    zone: Joi.string()
      .valid("West Hararghe", "East Hararghe")
      .required()
      .messages({
        "any.only": "Zone must be either West Hararghe or East Hararghe",
        "string.empty": "Zone is required",
      }),
    woreda: Joi.string().required().messages({
      "string.empty": "Woreda is required",
    }),
    year: Joi.string()
      .valid("Freshman", "2nd", "3rd", "4th", "5th")
      .required()
      .messages({
        "any.only": "Year must be a valid year of study",
        "string.empty": "Year is required",
      }),
    college: Joi.string().required().messages({
      "string.empty": "College is required",
    }),
    department: Joi.string().required().messages({
      "string.empty": "Department is required",
    }),
  });

  return schema.validate(data);
};

// User login validation
export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });
  return schema.validate(data);
};

// File validation
export const validateFile = (file, type) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const resourceTypes = [
    "image/jpeg", "image/png", "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (type === "profile") return imageTypes.includes(file.mimetype);
  if (type === "resource") return resourceTypes.includes(file.mimetype);
  return false;
};
