import { Router } from "express";
import userController from "../controllers/UserController";

const router: Router = Router();

router.post('/registration', userController.registration)
router.post('/login')
router.post('/logout')
router.get('/confirm/:link', userController.confirmEmail)
router.get('/refresh')
// router.get('/users', userController.getUsers)

export default router;