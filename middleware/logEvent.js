const {format} = require("date-fns");
const {v4:uuid} = require("uuid");
const fs = require("fs");
const fsPromises = require("fs/promises")
const path = require("path");


const logEvents = async(message, logName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\t\tHH:mm:ss')
    const logItems = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItems);
    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'Logs'))) {
            await fs.mkdir(path.join(__dirname, '..', 'Logs'), (err) => {
                if(err) throw err;
                console.log('Directory Successfully Created');

            })

        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'Logs', logName), logItems)
    } catch (error) {
        console.log(err)
    }
}
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`)
  next()

}



module.exports = {logEvents, logger}