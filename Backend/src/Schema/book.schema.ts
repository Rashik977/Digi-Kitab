import Joi from "joi";

// Define the schema for the user query
export const getBookQuerySchema = Joi.object({
  category: Joi.string().optional(),
  genre: Joi.string().optional(),
  rating: Joi.number().optional(),
  priceMin: Joi.number().optional(),
  priceMax: Joi.number().optional(),
  newlyAdded: Joi.number().optional(),

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

export const bookIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
