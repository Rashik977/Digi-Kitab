import express from "express";
import {
  createUser,
  getUsers,
  updateUsers,
  deleteUsers,
} from "../Controller/user.controller";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../Middleware/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserBodySchema,
  userIdSchema,
} from "../Schema/user.schema";

const userRoutes = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Username to filter users
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email to filter users
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
userRoutes.get(
  "/",
  authenticate,
  authorize("users.get"),
  validateReqQuery(getUserQuerySchema),
  getUsers
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
userRoutes.post("/", validateReqBody(createUserBodySchema), createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updateduser
 *               email:
 *                 type: string
 *                 example: updateduser@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
userRoutes.put(
  "/:id",
  authenticate,
  authorize("users.put"),
  validateReqParams(userIdSchema),
  validateReqBody(updateUserBodySchema),
  updateUsers
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
userRoutes.delete(
  "/:id",
  authenticate,
  authorize("users.delete"),
  validateReqParams(userIdSchema),
  deleteUsers
);

export default userRoutes;
