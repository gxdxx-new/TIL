exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.send(
      "<script>alert('권한이 없습니다.');location.href='/';</script>"
    );
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login/" + req.user.id);
  }
};
