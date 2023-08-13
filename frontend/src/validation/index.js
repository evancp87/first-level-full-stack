import joi from "joi";
import { searchSchema, loginSchema, registerSchema } from "./schema";

export const validate = async (payload) => {
  const searchBox = joi.object(searchSchema);

  try {
    const results = await searchBox.validateAsync(payload, {
      abortEarly: false,
    });

    console.log(results);
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

export const validateLogin = async (payload) => {
  const searchBox = joi.object(loginSchema);

  try {
    const results = await searchBox.validateAsync(payload, {
      abortEarly: false,
    });

    console.log(results);
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

export const validateRegister = async (payload) => {
  const searchBox = joi.object(registerSchema);

  try {
    const results = await searchBox.validateAsync(payload, {
      abortEarly: false,
    });

    console.log(results);
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
