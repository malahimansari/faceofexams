import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      msg: "Authorization Denied",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    if (!decoded.institute) {
      return res.status(401).json({ msg: "Invalid token structure" });
    }

    req.institute = decoded.institute;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ msg: "Authorization denied!" });
  }
}
