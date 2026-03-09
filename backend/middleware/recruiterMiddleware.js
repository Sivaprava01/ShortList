module.exports = (req, res, next) => {

  if (req.user && req.user.role === "recruiter") {
    next();
  } else {
    res.status(403).json({
      message: "Recruiter access only"
    });
  }

};
