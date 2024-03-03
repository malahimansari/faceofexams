const studentMiddleware = (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ msg: 'Authorization denied. User not authenticated.' });
      }
      console.log('User roles:', req.user.role);
  
  
      const room_id = String(req.params.room_id);
      console.log('req.params.room_id:', room_id);
  
      const isStudent = req.user.role.some((role) => {
        console.log('role.room_id:', String(role.room_id));
        console.log('Comparison:', String(role.room_id) === room_id);
        return role.status === 0 && String(role.room_id) === room_id;
      });
  
      console.log('Is student:', isStudent);
  
      if (!isStudent) {
        return res.status(403).json({ msg: 'Unauthorized. Only students can perform this action.' });
      }
  
      next();
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Server Error' });
    }
};
  
export default studentMiddleware;