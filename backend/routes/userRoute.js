const router = require("express").Router()
const { createUser, geAlltUser, getUser, updateUser, deleteUser, login } = require('../controllers/userController')
const { verifyToken, checkRole } = require('../middlewares/authMiddleware')


router.post('/create', createUser )
router.get('/getAll', verifyToken, geAlltUser ) // All authenticated users can view
router.get('/getUser/:id', verifyToken, getUser ) // All authenticated users can view single user
router.put('/updateUser/:id', verifyToken, checkRole('admin', 'manager'), updateUser ) // Admin and manager can edit
router.delete('/deleteUser/:id', verifyToken, checkRole('admin'), deleteUser ) // Only admin can delete
router.post('/login', login )


module.exports = router