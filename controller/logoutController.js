const userDB = {
  users: require('../model/users.json'),
  setUsers: function(data) { this.users = data }
}
const path = require('path');
const fsPromises = require('fs').promises;
const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  // Is refresh token in db?
  const foundUser = userDB.users.find(person => person.refreshToken === cookies.jwt);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204); // No content
  }

  // Delete refreshToken in db
  const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  const currentUser = { ...foundUser, refreshToken: '' };
  userDB.setUsers([...otherUsers, currentUser]);
  
  // Save updated users to file
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(userDB.users)
  );

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // clear cookie
  res.sendStatus(204); // No content
};


module.exports = {handleLogout}