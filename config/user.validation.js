import Joi from "joi";
export const registerUserValidationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(8)
    .max(30)
    .required()
    .trim()
    .lowercase(),
  email: Joi.string().required().email().trim().lowercase().min(5).max(50),
  password: Joi.string()
    .min(8)
    .max(20)
    .required()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
  profilepicture: Joi.required(),
  bio: Joi.string().min(8).max(160).required(),
  role: Joi.string()
    .valid("user", "author") // Restricts role to either 'user' or 'admin'
    .default("user"),
});
export const loginUserValidationSchema = Joi.object({
  email: Joi.string().email().trim().required().lowercase(),
  password: Joi.string().required().trim(),
});
