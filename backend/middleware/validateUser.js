const validator = require('validator');
const yup = require('yup');

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

  next();
};

const validateLogin = async (req, res, next) => {
  try {
    const Schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    await Schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.errors || "Validation failed" });
  }
};
const validateUserr = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = { validateUser, validateLogin , validateUserr };
