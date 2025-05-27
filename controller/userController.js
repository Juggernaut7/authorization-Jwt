const userDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data; }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const fsPromises = require('fs').promises;

// === REGISTER NEW USER ===
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  const duplicate = userDB.users.find(
    person => person.username.toLowerCase() === user.toLowerCase()
  );
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = {
      username: user,
      roles: { User: 2001 },
      password: hashedPwd
    };

    userDB.setUsers([...userDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(userDB.users, null, 2)
    );

    res.status(201).json({ success: `New user '${user}' created!` });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === LOGIN EXISTING USER ===
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  const foundUser = userDB.users.find(
    person => person.username.toLowerCase() === user.toLowerCase()
  );
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (!match) return res.sendStatus(401); // Unauthorized

  try {
    const roles = foundUser.roles ? Object.values(foundUser.roles) : [];

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Save refreshToken to userDB
    const updatedUser = { ...foundUser, refreshToken };
    const otherUsers = userDB.users.filter(
      person => person.username !== foundUser.username
    );

    userDB.setUsers([...otherUsers, updatedUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(userDB.users, null, 2)
    );

    // Set secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only secure in prod
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send access token in response
    res.json({ accessToken });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
  handleLogin
};
