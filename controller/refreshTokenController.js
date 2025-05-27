const userDB = {
  users: require('../model/users.json'),
  setUsers: function(data) { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config()


const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401) //Unauthorized

  const refreshToken = cookies.jwt

  // Is refresh token in db?
  const foundUser = userDB.users.find(person => person.refreshToken === refreshToken)
  if (!foundUser) return res.sendStatus(403) //Forbidden

  // Verify refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403)

      // Create new access token
     const roles = Object.values(foundUser.roles)
     
         const accessToken = jwt.sign(
           {
             "UserInfo": {
               "username": foundUser.username,
               "roles": roles
             }
            },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      
      )

      res.json({ accessToken })
    }
  )
}

module.exports = { handleRefreshToken }
// This code handles the refresh token functionality in a Node.js application.