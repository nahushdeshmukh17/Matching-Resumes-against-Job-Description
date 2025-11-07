const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  next();
};

const requireUserType = (userType) => {
  return (req, res, next) => {
    if (req.session.userType !== userType) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${userType} role required.` 
      });
    }
    next();
  };
};

module.exports = { requireAuth, requireUserType };