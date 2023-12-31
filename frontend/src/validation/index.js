import joi from "joi";
import { searchSchema, loginSchema, registerSchema } from "./schema";

const validateWithSchema = async (payload, schema) => {
  const schemaObject = joi.object(schema);

  try {
    const results = await schemaObject.validateAsync(payload, {
      abortEarly: false,
    });
    // console.log(results);

    return null;
  } catch (error) {
    console.log(error);
    if (error.details) {
      // configures Joi's slightly unusual data structure to be more useful
      const errorsMod = error.details.map((error) => ({
        key: error.context.key,
        message: error.message,
      }));
      return errorsMod;
    }
    return [error.message];
  }
};

export const validate = async (payload) => {
  return validateWithSchema(payload, searchSchema);
};

export const validateLogin = async (payload) => {
  return validateWithSchema(payload, loginSchema);
};

export const validateRegister = async (payload) => {
  return validateWithSchema(payload, registerSchema);
};
