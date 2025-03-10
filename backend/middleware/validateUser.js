const validator = require('validator');
const yup = require('yup');
const jwt = require('jsonwebtoken');


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


const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
      return res.status(403).json({ error: 'Token is required' });
  }

  // Bearer token format
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(400).json({ error: 'Invalid token format' });
  }

  const tokenToVerify = tokenParts[1];

  console.log('Token:', tokenToVerify);  // Debugging token

  try {
      // Verify the token
      const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET);

      // Attach user info to the request
      req.user = decoded;

      // Proceed to the next middleware
      next();
  } catch (error) {
      console.error('Token verification error:', error);  // Log the error
      return res.status(401).json({ error: 'Invalid or expired token' });
  }
};



module.exports = { validateUser, validateLogin , verifyToken };
