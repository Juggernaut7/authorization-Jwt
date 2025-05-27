const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401); // Unauthorized

    const rolesArray = [...allowedRoles];
    const result = req.roles.some(role => rolesArray.includes(role));
    if (!result) return res.sendStatus(403); // Forbidden

    next();
  };
};

module.exports = verifyRoles;
