import { categorySchema } from "../models/categories.model.js";

export function categoryMiddleware(req, res, next){
    const { error } = categorySchema.validate(req.body, { abortEarly: false });
    
    if(error){
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }
    next();
}