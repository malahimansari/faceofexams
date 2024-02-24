import { Router } from "express";
import { check } from "express-validator";
const roomRouter = Router();

// Controller
import roomController from "../controllers/roomController.js";

// Middleware
import authMiddleware from "../middlewares/authMiddleware.js";
import instituteMiddleware from "../middlewares/instituteMiddleware.js";

roomRouter.use(authMiddleware);

/**
 * @route GET /api/v1/rooms
 * @desc Get all rooms
 * @access Private
 */
roomRouter.get("/", instituteMiddleware, roomController.get_rooms);

/**
 * @route POST /api/v1/institute/rooms
 * @desc Create room for institute
 * @access Private
 */
roomRouter.post(
  "/",
  instituteMiddleware,
  [check("name", "Please enter a room name").not().isEmpty()],
  roomController.create_room
);

export default roomRouter;
