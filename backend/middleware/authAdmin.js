module.exports = (req, res, next) => {console.log(req.auth);
  if (!req.user || req.user.role !== "admin") {
    
    return res.status(403).json({
      message: "Không có quyền admin",
    });
  }
  next();
};
