import { Router } from "express";
import userController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";
import { marvelController } from "../controllers/MarvelController";

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/confirm/:link', userController.confirmEmail);
router.get('/refresh', userController.refresh);
// router.get('/users', authMiddleware, userController.getUsers);

router.get('/character/:name', authMiddleware, marvelController.getCharacterByName);

export default router;