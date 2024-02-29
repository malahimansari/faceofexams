import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Institute from "../models/Institute.js";

const roleMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      msg: "Authorization denied!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    if (decoded.user) {
      const user = await User.findById(decoded.user.id); // Use decoded.user.id

      if (!user) {
        return res.status(403).json({ msg: "Unauthorized. User not found." });
      }

      if (user && user.role && user.role.length > 0) {
        const roomId = req.params.room_id;

        if (!roomId) {
          return res.status(400).json({ msg: "Room ID is required." });
        }
        
        const teacherRole = user.role.find(
          (role) =>
            role.status === 1 && String(role.room_id) === req.params.room_id
        );

        console.log(teacherRole);
        if (teacherRole) {
          console.log("Found teacher role:", teacherRole);

          req.user = user;
          return next();
        } else {
          console.log("No teacher role found");

          return res.status(403).json({
            msg: "Unauthorized. Only teachers can perform this action.",
          });
        }
      } else {
        return res.status(403).json({
          msg: "Unauthorized. User has no role information.",
        });
      }
    } else if (decoded.institute) {
      const institute = await Institute.findById(decoded.institute.id);

      if (institute) {
        req.institute = institute;
        return next();
      } else {
        return res.status(403).json({
          msg: "Unauthorized. Invalid institute information.",
        });
      }
    } else {
      return res.status(403).json({
        msg: "Unauthorized. Invalid token structure.",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ msg: "Authorization denied!" });
  }
};

export default roleMiddleware;
