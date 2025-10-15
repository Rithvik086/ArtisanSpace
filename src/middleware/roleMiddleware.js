import path from 'path';

const authorizerole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).sendFile(path.join(process.cwd(), 'src', 'public', 'accessdenied.html'));
    }
    next();
  };
};

export default authorizerole;
