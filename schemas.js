const Joi=require('joi');


module.exports.ProductSchema=Joi.object({
    product:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        category:Joi.string().required(),
        description:Joi.string().required(),
        // image:Joi.string().required(),
        // rating:Joi.number().required().min(0).max(5)
    }).required(),
    deleteImages: Joi.array()
});

module.exports.ReviewSchema=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
});
