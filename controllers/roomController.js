import Room from "../models/Room.js";
import Institute from "../models/Institute.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// get all rooms
const get_rooms = async (req, res) => {
  try {
    const rooms = await Room.find({ user: req.user.id }).sort({
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
  const { name, instituteId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const institute = await Institute.findById(instituteId);

    if (!user || !institute) {
      return res.status(404).json({ msg: "User or Institute not found" });
    }

    if (
      !(
        institute.teachers.includes(user.id) ||
        institute.admins.includes(user.id)
      )
    ) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    const room = new Room({
      name,
      teachers: [req.user.id],
      institute: instituteId,
    });

    await room.save();
    return res.json({ msg: "Room created successfully", room });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export default { get_rooms, create_room };
