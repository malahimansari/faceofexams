import { Router } from "express";
import { check } from "express-validator";
const roomRouter = Router();

// Controller
import roomController from "../controllers/roomController.js";

// Middleware
import instituteMiddleware from "../middlewares/instituteMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

/**
 * @route GET /api/v1/rooms
 * @desc Get all rooms
 * @access Private
 */


/**
 *  @swagger
 * /api/v1/room/:
 *   get:
 *     summary: Get Room
 *     tags: [Room]
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *             
 *       409:
 *         description:  Bad request ( user not exists)
 *         
 *       500:
 *         description: Internal server error
 */



roomRouter.get("/", instituteMiddleware, roomController.get_rooms);

/**
 * @route POST /api/v1/institute/rooms
 * @desc Create room for institute
 * @access Private
 */

/**
 *  @swagger
 * /api/v1/room/:
 *   post:
 *     summary: Create Room 
 *     tags: [Room]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 format: text
 *                 description: enter room name
 *               teachers:
 *                 type: string
 *                 format: text
 *                 description: enter teacher name
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               token: <JWT_TOKEN>
 *       400:
 *         description: Bad request (validation errors)
 *             
 *       409:
 *         description:  Bad request ( user not exists)
 *         
 *       500:
 *         description: Internal server error
 */



roomRouter.post(
  "/",
  instituteMiddleware,
  [check("name", "Please enter a room name").not().isEmpty()],
  roomController.create_room
);


/**
 *  @swagger
 * /api/v1/room/{room_id}/students:
 *   post:
 *     summary: add students
 *     tags: [Institute]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: text
 *         description: ID of the room where subjects are being added
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the subject
 *                   teachers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           format: email
 *                           description: Email of the teacher
 *     responses:
 *       200:
 *         description: Successful subject creation
 *         content:
 *           application/json:
 *             example:
 *               message: Subject created successfully
 *       400:
 *         description: Bad request (validation errors)
 *       409:
 *         description: Conflict (user already exists)
 *       500:
 *         description: Internal server error
 */




roomRouter.post(
  '/:room_id/students',
  roleMiddleware,
  [check("email", "Please add a students valid email").isEmail()],
  roomController.addStudentToRoom
)

export default roomRouter;
