const validator = require('validator');
const yup=require('yup')

const validateUser = (req, res, next) => {
  const { name, surname, email, password, role } = req.body;

  if (!name || !surname || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields must be filled' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email not valid' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long, with uppercase, lowercase, number, and symbol'
    });
  }

  
  next(); // Passe au middleware suivant si tout est valide
};

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


module.exports = {validateUser,validate};
