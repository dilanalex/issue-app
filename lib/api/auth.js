const User = require('../models/user');
const bcryptjs = require('bcryptjs'); // Import bcryptjs
const jwt = require('jsonwebtoken');
const config = require('../../config'); 

//This method is only for testing purpose, first user to be created in the system.
//Lets think about different approach to create super admin user in the system later.
async function registerSuperAdmin(ctx) {
    // Similar to registerAdmin, but defaults to super_admin
    const { username, password, email } = ctx.request.body;
    if (!username || !password || !email) {
      ctx.status = 400;
      ctx.body = { error: 'Username, password and email are required.' };
      return;
    }
    try {
      const userExists = await User.findOne({ where: { username } });
      if (userExists) {
        ctx.status = 409;
        ctx.body = { error: 'Username already exists.' };
        return;
      }
      //const hashedPassword = bcryptjs.hashSync(password, 10);
      //console.log("Hashed admin during registration:", hashedPassword);
      const user = await User.create({ username, password, email, user_group: 'super_admin' });
      ctx.status = 201;
      ctx.body = { message: 'Super admin user registered successfully.' };
    } catch (error) {
      console.error('Error registering super admin user:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to register super admin user.' };
    }
  }

async function registerAdmin(ctx) {
  const { username, password, email } = ctx.request.body;
  if (!username || !password, !email) {
    ctx.status = 400;
    ctx.body = { error: 'Username, password and email are required.' };
    return;
  }
  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      ctx.status = 409;
      ctx.body = { error: 'Username already exists.' };
      return;
    }
    //const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({ username, password, email, user_group: 'admin' });
    ctx.status = 201;
    ctx.body = { message: 'Admin user registered successfully.' };
  } catch (error) {
    console.error('Error registering admin user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to register admin user.' };
  }
}

async function registerUser(ctx) {
  // This endpoint will be protected for admin users
  const { username, password, email } = ctx.request.body;
  if (!username || !password, !email) {
    ctx.status = 400;
    ctx.body = { error: 'Username, password and email are required.' };
    return;
  }
  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      ctx.status = 409;
      ctx.body = { error: 'Username already exists.' };
      return;
    }
    //const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({ username, password, email, user_group: 'normal' });
    ctx.status = 201;
    ctx.body = { message: 'Normal user registered successfully.' };
  } catch (error) {
    console.error('Error registering normal user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to register normal user.' };
  }
}

async function login(ctx) {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Username and password are required.' };
      return;
    }
    try {
      const user = await User.findOne({ where: { username } });
      console.log("PASSWORDS");
      console.log(password); // Debugging line
      console.log(user.password);
      console.log("Comparison Result:", bcryptjs.compareSync(password, user.password)); // Debugging line
      if (!user || !bcryptjs.compareSync(password, user.password)) {
        ctx.status = 401;
        ctx.body = { error: 'Invalid username or password.' };
        return;
      }
      const token = jwt.sign({ userId: user.id, 
        username: user.username,
        userGroup: user.user_group }, config.jwtSecret, { expiresIn: '1h' });
        
      ctx.status = 200;
      ctx.body = { message: 'Login successful.', token };
    } catch (error) {
      console.error('Error logging in:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to login.' };
    }
  }

  //do we really need this ??
  // This is a placeholder for logout functionality. 
  // In a stateless JWT system, logout is typically handled on the client side by deleting the token.
  // remove bearer token from postman or client side, that means logout.
  async function logout(ctx) {
    ctx.status = 200;
    ctx.body = { message: 'Logout successful.' };
  }

async function getAllUsers(ctx) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'user_group', 'password'], // Exclude password for security in future
      });
      ctx.status = 200;
      ctx.body = { users };
    } catch (error) {
      console.error('Error fetching all users:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch users.' };
    }
  }

async function getUserById(ctx) {
  const userId = ctx.params.id;
  const requestingUserId = ctx.state.user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'user_group'],
    });

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: `User with ID ${userId} not found.` };
      return;
    }

    // Authorization logic: Allow admin to see all, user to see their own info
    if (ctx.state.user.userGroup === 'admin' || requestingUserId === parseInt(userId)) {
      ctx.status = 200;
      ctx.body = { user };
    } else {
      ctx.status = 403; // Forbidden
      ctx.body = { error: 'Unauthorized to access this user information.' };
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch user.' };
  }
}

module.exports = { registerAdmin, registerSuperAdmin, registerUser, login, logout, getAllUsers, getUserById };