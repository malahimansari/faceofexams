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

    institute.rooms.push(room._id);
    await institute.save();

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


const addStudentRole = async (userId, roomId) => {
  try {
    const existingRole = await User.findOne({
      _id: userId,
      "role.status": 0,
      "role.room_id": roomId,
    });

    if (existingRole) {
      console.log(`Student role already exists for user ${userId} in room ${roomId}`);
      return existingRole;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          role: {
            status: 0,
            room_id: roomId,
          },
        },
      },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding student role to user");
  }
};


// add student to room
const addStudentToRoom = async (req, res) => {
  const { room_id } = req.params;
  const { students } = req.body;

  try {
    // Get the existing students in the room
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const existingStudentIds = room.students.map((student) => student.user.toString());

    // Add students to the room
    const studentsToAdd = await Promise.all(
      students.map(async (student) => {
        const user = await User.findOne({ email: student.email });

        if (user) {
          const userId = user._id.toString();

          // Check if the user is already a teacher in the room
          const isTeacherInRoom = room.teachers.some((teacher) => teacher.user.toString() === userId);

          if (isTeacherInRoom) {
            console.log(`User ${userId} is already a teacher in room ${room_id}`);
            return null; // Skip adding as a student
          }

          // Check if the user is already a student in the room
          if (existingStudentIds.includes(userId)) {
            console.log(`User ${userId} is already a student in room ${room_id}`);
            return null; // Skip adding again as a student
          }

          return addStudentRole(user._id, room_id);
        }

        return null;
      })
    );

    const updatedStudents = studentsToAdd.filter((student) => student !== null);

    if (updatedStudents.length > 0) {
      // Update the students in the room
      room.students.push(...updatedStudents.map((student) => ({ user: student._id })));
      await room.save();

      return res.json({ msg: "Students added successfully", updatedStudents });
    }

    return res.status(400).json({ msg: "Invalid student email(s)" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};


export default { get_rooms, create_room, addStudentToRoom };