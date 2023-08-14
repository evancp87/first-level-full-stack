import joi from "joi";
export const searchSchema = {
  search: joi.string().trim().allow("").min(2).label("Search"),
};

export const loginSchema = {
  email: joi.string().trim().min(2).label("Your email"),
  password: joi.string().trim().min(2).label("Your password"),
};

export const registerSchema = {
  email: joi
    .string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .label("Your email"),
  name: joi.string().trim().min(1).max(40).label("Your name"),
  password: joi
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
    .label("Your password")
    .messages({
      "object.regex": "Must have at one number",
      "string.pattern.base": "Passwords require at least one number",
    }),
};
