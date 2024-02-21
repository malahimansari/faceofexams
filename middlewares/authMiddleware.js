import jwt from 'jsonwebtoken';
export default function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({
      msg: "Authorization denied!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({msg: "Authorization denied!"});
  }
};