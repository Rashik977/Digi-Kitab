import Joi from "joi";

// Define the schema for the user query
export const getUserQuerySchema = Joi.object({
  q: Joi.string().optional(),
  page: Joi.number()
    .min(1)
    .optional()
    .messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least 1",
    })
    .default(1),

  size: Joi.number()
    .min(1)
    .max(10)
    .optional()
    .messages({
      "number.base": "Size must be a number",
      "number.min": "Size must be at least 1",
      "number.max": "Size must be at most 10",
    })
    .default(10),
}).options({ stripUnknown: true });

// Define the schema for the user body
export const createUserBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name must be a string",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password required",
      "string.min": "Password must be at least 8 characters",
      "password.uppercase":
        "Password must contain at least one uppercase letter",
      "password.lowercase":
        "Password must contain at least one lowercase letter",
      "password.special":
        "Password must contain at least one special character",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }

      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }

      if (!/[!@#$]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    }),
}).options({ stripUnknown: true });

// Define the schema for the update user body
export const updateUserBodySchema = Joi.object({
  name: Joi.string().optional().messages({
    "any.required": "Name must be a string",
  }),
  email: Joi.string().email().optional().messages({
    "any.required": "Email required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string()
    .optional()
    .min(8)
    .messages({
      "any.required": "Password required",
      "string.min": "Password must be at least 8 characters",
      "password.uppercase":
        "Password must contain at least one uppercase letter",
      "password.lowercase":
        "Password must contain at least one lowercase letter",
      "password.special":
        "Password must contain at least one special character",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }

      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }

      if (!/[!@#$]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    }),
}).options({ stripUnknown: true });

// Define the schema for the user id
export const userIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
