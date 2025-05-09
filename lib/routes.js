'use strict';

const Router = require('koa-router');
const authMiddleware = require('./middleware/auth');

const router = new Router();

//discovery and health check
router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

//user endpoints
//router.post('/register/admin', require('./api/auth').registerAdmin);
router.post('/register/superadmin', require('./api/auth').registerSuperAdmin); // Initial super admin creation
router.post('/register/admin', authMiddleware.authenticate, authMiddleware.authorize(['super_admin']), 
            require('./api/auth').registerAdmin);
router.post('/register/user', authMiddleware.authenticate, authMiddleware.authorize(['super_admin', 'admin']), 
            require('./api/auth').registerUser);

router.get('/users', authMiddleware.authenticate, authMiddleware.authorize(['super_admin', 'admin']), 
            require('./api/auth').getAllUsers);
router.get('/users/:id', authMiddleware.authenticate, authMiddleware.authorize(['super_admin', 'admin']),
            require('./api/auth').getUserById);

//login and logout
router.post('/login', require('./api/auth').login);

//New implementation for the issues by DS
router.get('/issues/:id', authMiddleware.authenticate, authMiddleware.authorize(['normal', 'admin']), 
            require('./api/issues').get);
router.post('/issues', authMiddleware.authenticate, authMiddleware.authorize(['normal', 'admin']),
            require('./api/issues').create);
router.patch('/issues/:id', authMiddleware.authenticate, authMiddleware.authorize(['normal', 'admin']),
            require('./api/issues').update);



module.exports = router;
