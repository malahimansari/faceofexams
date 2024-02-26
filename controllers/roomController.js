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
    const institute = await Institute.findById(req.institute.id);

    if (!institute) {
      return res.status(404).json({ msg: "Institute not found" });
    }

    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }

    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      return res
        .status(400)
        .json({ msg: "Teachers are required as a non-empty array" });
    }

    // Check if the room name is unique for the institute
    const existingRoom = await Room.findOne({
      name,
      institute: req.institute.id,
    });

    if (existingRoom) {
      return res.status(400).json({ msg: "Room with the same name already exists" });
    }

    // Create a new room if it doesn't exist
    const room = existingRoom || new Room({ name, institute: req.institute.id });

    // Find the users and update their roles to teacher
    const teacherEmails = teachers.map((teacher) => teacher.user);

    console.log("Teacher emails:", teacherEmails);

    const updatedUsers = await Promise.all(
      teacherEmails.map(async (email) => {
        try {
          const user = await User.findOneAndUpdate(
            { email },
            {
              $push: {
                role: {
                  status: 1, // Assuming 1 represents the "teacher" role
                  room_id: room._id,
                },
              },
            },
            { new: true }
          );
          return user;
        } catch (error) {
          console.error(`Failed to update user ${email}:`, error.message);
          return null;
        }
      })
    );

    if(updatedUsers.some(user => user === null)) {
      return res.status(500).json({ msg: "teacher don't exist" });
    }
    await room.save();

    console.log('Updated users:', updatedUsers);

    // Get the updated user IDs
    const updatedUserIds = updatedUsers
      .filter((user) => user && user._id)
      .map((user) => user._id);

    // Create the room with the teachers' IDs
    room.teachers = updatedUserIds.map((user) => ({ user }));
    await room.save();

    return res.json({ msg: "Room created successfully", room });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export default { get_rooms, create_room };



