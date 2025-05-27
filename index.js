const express = require("express")
const app = express()
const path = require("path");
const cors = require('cors')
const {logger} = require('./middleware/logEvent');
const errorHandler = require("./middleware/errorHandler")
const verifyJWT = require('./middleware/verifyJwt')
const corsOptions = require('./config/corsOptions')
const cookieParser = require("cookie-parser");
const PORT = 4000;

// Third-Party Middleware
//cross origin resourse sharing

app.use(cors(corsOptions));

// cudtom middlewar logger
app.use(logger);

//built in Middleware to handle urlencoded data
// in other word form data
app.use(express.urlencoded({ extended:false}))

//built in Middleware for json
app.use(express.json());
// server static files
app.use(express.static(path.join(__dirname, '/public')))
// custom middleware for logging events
// cookie parser middleware
app.use(cookieParser());
//
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use("/users", require('./routes/userRoute'))
app.use("/refresh", require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT) // Protect all routes after this middleware
app.use("/employees", require('./routes/api/employees'))

app.get("/Data.json", (req, res) => {
    res.sendFile(path.join(__dirname, "Data", "Data.json"));
})



app.get("/Student.json", (req, res) => {
    res.sendFile(path.join(__dirname, "Student", "Student.json"));
})


app.get("/404.html", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "404.html"))
})
app.get("/New-page.html", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "New-page.html"))
})

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})