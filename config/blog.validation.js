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
  tags: Joi.array()
    .items(Joi.string().trim())
    .default([]) // Default to an empty array if missing
    .optional(),

  categories: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // ObjectId validation
    .optional(),
});

export const updateBlogValidationSchema = Joi.object({
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
});
