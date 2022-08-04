const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      error: 'Authorization token is required',
    });
  }

  // 'Bearer token'
  const token = authorization.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById({ _id }).select('_id');
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Authorization token is invalid' });
  }
};

module.exports = requireAuth;
