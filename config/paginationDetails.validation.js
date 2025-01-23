import Joi from "joi"
export const paginationDetailsValidationSchema=Joi.object({
    page:Joi.number().integer().required().min(1),
    limit:Joi.number().integer().required().min(1)
})