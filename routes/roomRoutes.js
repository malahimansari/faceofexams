import { Router } from "express";
import { check } from "express-validator";
const room_router = Router();

// Controller
import roomController from "../controllers/roomController.js";

//Middleware
import authMiddleware from "../middlewares/authMiddleware.js";
// import instituteMiddleware from "../middlewares/instituteMiddleware.js";

room_router.use(authMiddleware);

/**
 * @route GET /api/v1/institute/rooms
 * @desc get all rooms
 * @access private
 */

room_router.get("/", roomController.get_rooms);

/**
 * @route POST /api/v1/institute/create_room
 * @desc create room for institute
 * @access private
 */

room_router.post(
  "/",
  [check("name", "Please enter a room name").not().isEmpty()],
  roomController.create_room
);

export default room_router;
