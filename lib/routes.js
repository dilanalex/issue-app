'use strict';

const Router = require('koa-router');
const authMiddleware = require('./middleware/auth');

const router = new Router();

//discovery and health check
router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

//user endpoints
//router.post('/register/admin', require('./api/auth').registerAdmin);
/**
 * @swagger
 * /register/superadmin:
 *   post:
 *     summary: Register the initial super admin user
 *     tags:
 *       - Auth
 *     description: Creates the first super admin account. This endpoint does not require authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: superadmin
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               email:
 *                 type: string
 *                 example: superadmin@example.com
 *     responses:
 *       201:
 *         description: Super admin created successfully
 *       400:
 *         description: Invalid input or super admin already exists
 */
router.post('/register/superadmin', require('./api/auth').registerSuperAdmin); // Initial super admin creation
/**
 * @swagger
 * /register/admin:
 *   post:
 *     summary: Register a new admin user
 *     tags:
 *       - Auth
 *     description: Creates a new admin user. Only super admins can access this endpoint. Requires Bearer token authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: adminuser
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Invalid input or admin already exists
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not a super admin)
 */
router.post('/register/admin', authMiddleware.authenticate, authMiddleware.authorize(['super_admin']), 
            require('./api/auth').registerAdmin);
/**
 * @swagger
 * /register/user:
 *   post:
 *     summary: Register a new normal user
 *     tags:
 *       - Auth
 *     description: Creates a new normal user. Only admins and super admins can access this endpoint. Requires Bearer token authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: normaluser
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Normal user created successfully
 *       400:
 *         description: Invalid input or user already exists
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not an admin or super admin)
 */
router.post('/register/user', authMiddleware.authenticate, authMiddleware.authorize(['super_admin', 'admin']), 
            require('./api/auth').registerUser);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Returns a list of all users. Only admins and super admins can access this endpoint. Requires Bearer token authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   user_group:
 *                     type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not an admin or super admin)
 */
router.get('/users', authMiddleware.authenticate, authMiddleware.authorize(['super_admin', 'admin']), 
            require('./api/auth').getAllUsers);
router.get('/users/:id', authMiddleware.authenticate, authMiddleware.authorize(['super_admin', 'admin']),
            require('./api/auth').getUserById);

//login endpoint
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post('/login', require('./api/auth').login);

//New implementation for the issues by DS
router.get('/issues/:id', authMiddleware.authenticate, authMiddleware.authorize(['normal', 'admin']), 
            require('./api/issues').get);
router.post('/issues', authMiddleware.authenticate, authMiddleware.authorize(['normal', 'admin']),
            require('./api/issues').create);
router.patch('/issues/:id', authMiddleware.authenticate, authMiddleware.authorize(['normal', 'admin']),
            require('./api/issues').update);
router.get('/issues/:issueId/revisions', authMiddleware.authenticate, authMiddleware.authorize(['admin', 'normal']),
            require('./api/issues').getRevisions);


module.exports = router;
