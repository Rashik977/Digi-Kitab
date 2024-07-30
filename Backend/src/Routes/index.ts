import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import bookRoutes from "./book.route";
import staffRoutes from "./staff.route";
import orderRoutes from "./order.route";
import libraryRoutes from "./library.route";

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication related endpoints
 *   - name: Users
 *     description: User related endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/staff", staffRoutes);
router.use("/orders", orderRoutes);
router.use("/library", libraryRoutes);

export default router;
