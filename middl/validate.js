const yup=require('yup')

async function validate(req, res, next) {
    try {
        const Schema = yup.object().shape({
            password: yup.string().required(),
            email: yup.string().email().required(),
        });
        await Schema.validate(req.body);
        next(); // Ensure the request proceeds to the next middleware
    } catch (err) {
        res.status(400).json({ error: err.errors || "Validation failed" });
    }
}

module.exports=validate