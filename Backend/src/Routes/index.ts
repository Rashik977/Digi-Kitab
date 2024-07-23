import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";

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

export default router;
