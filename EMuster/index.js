var path = require("path");
var fs = require('fs');

var express = require("express");
var bodyParser = require("body-parser")
var morgan = require("morgan");
var cors = require("cors");
var rfs = require("rotating-file-stream");
var config = require("./app/utility/config");

var emusterRouter = require("./app/routes/emuster")
const {
    emusterCodes,
    errorCodes
} = require("./app/utility/errorCodes");

var app = express();
console.log()
// Configure Express application
var port = process.env.PORT;
app.use(bodyParser.json());

// Production Modules
if (process.env.NODENV === "PROD") {
    app.use(morgan('combined', {
        stream: accessLogStream
    }));
}

// Development Modules
if (process.env.NODENV === "DEV") {
    app.use(morgan('dev'))
}

// Coommon Modules
app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


/**
 * Method Used as part of Log file rotation for APi logging
 * @param {*} num
 */

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

/**
 * Method Used as part of Log file rotation for APi logging
 * @param {*} time 
 * @param {*} index 
 */
function generator(time, index) {
    if (!time)
        return "file.log";

    var month = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());
    var hour = pad(time.getHours());
    var minute = pad(time.getMinutes());

    return month + "/" + month +
        day + "-" + hour + minute + "-" + index + "-file.log";
}

// Code block for Log writing 
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs(generator, {
    interval: '1d',
    size: '10M',
    path: logDirectory
})

// Routes
app.use("/emuster/api", emusterRouter)


// handle 404 errors
app.use('*', function (req, res) {
    res.status(errorCodes.PAGE_NOT_FOUND.Value);
    res.send({
        ...emusterCodes.PAGE_NOT_FOUND,
        data: {}
    });
});

app.listen(port, () => {
    console.info(`Emuster API is @ ${port} and Environment is set to ${process.env.NODENV}`)
});

var app = express();