import joi from "joi";
export const searchSchema = {
  search: joi.string().trim().min(2).label("Search"),
};

export const loginSchema = {
  email: joi.string().trim().min(2),
  password: joi.string().trim().min(2),
};

export const registerSchema = {
  email: joi
    .string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .label("email"),
  name: joi.string().trim().min(1).max(40).label("name"),
  password: joi
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
    .label("password"),
  // .rule({
  //   message: "Your password requires at least one number and character",
  // }),
};
