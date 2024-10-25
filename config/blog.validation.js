import Joi from "joi";

export const blogPostValidationSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),

  content: Joi.string().trim().required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content cannot be empty",
    "any.required": "Content is required",
  }),

  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validate ObjectId format
    .required()
    .messages({
      "string.base": "Author must be a valid ObjectId",
      "any.required": "Author is required",
    }),

  tags: Joi.array().items(Joi.string().trim()).default([]),

  categories: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)), // Validate ObjectId format
});
export const paginationDetailsValidationSchema = Joi.object({
  page: Joi.number().integer().required().min(1),
  limit: Joi.number().integer().required().min(1),
});
