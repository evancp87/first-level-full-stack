import joi from "joi";
export const searchSchema = {
  search: joi.string().trim().min(2).required().label("Search"),
};

// export const addUser = {
//   username: joi.string().trim(),
//   firstName: joi.string().trim().min(2).required.pattern().lowercase().messages(),
//   lastName: joi.string().trim().min(2).required,
//   email: joi.string().trim().min(2).required,
//   password: joi.string().trim().min(2).required,
//   address: joi.string().trim().min(2).required,

// }
