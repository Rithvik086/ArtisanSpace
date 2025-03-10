const authorizerole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).render("accessdenied");
    }
    next();
  };
};

export default authorizerole;

