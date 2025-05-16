// lib/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/user');

async function authenticate(ctx, next) {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication token is required.' };
    return;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid user.' };
      return;
    }
    ctx.state.user = { id: user.id,
      username: user.username, 
      userGroup: user.user_group };
      
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token.' };
  }
}

function authorize(roles) {
    return async (ctx, next) => {
      const userRole = ctx.state.user && ctx.state.user.userGroup;
      if (userRole && (typeof roles === 'string' ? userRole === roles : roles.includes(userRole))) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = { error: 'Unauthorized.' };
      }
    };
  }

module.exports = { authenticate, authorize };