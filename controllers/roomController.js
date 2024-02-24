import Room from "../models/Room.js";
import Institute from "../models/Institute.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// get all rooms
const get_rooms = async (req, res) => {
  try {
    const rooms = await Room.find({ institute: req.institute.user_id }).sort({
      created_at: -1,
    });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

// create room
const create_room = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, teachers } = req.body;

  try {
    const user = await User.findById(req.institute.user_id);
    const institute = await Institute.findById(req.institute.id);

    if (!user || !institute) {
      return res.status(404).json({ msg: "User or Institute not found" });
    }

    // if (!institute.admins.includes(req.institute.user_id)) {
    //   return res.status(403).json({ msg: "Unauthorized access" });
    // }

    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }

    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ msg: "Teachers are required as a non-empty array" });
    }

    // Check if the room name is unique for the institute
    const existingRoom = await Room.findOne({ name, institute: req.institute.id });
    if (existingRoom) {
      return res.status(400).json({ msg: "Room with the same name already exists" });
    }

    // Check if the provided teachers are valid users
    // const invalidTeachers = teachers.filter((teacherId) => !user.teachers.includes(teacherId));
    // if (invalidTeachers.length > 0) {
    //   return res.status(400).json({ msg: "Invalid teacher IDs provided" });
    // }

    const room = new Room({
      name,
      teachers,
      institute: req.institute.id,
    });

    await room.save();
    return res.json({ msg: "Room created successfully", room });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};


export default { get_rooms, create_room };
