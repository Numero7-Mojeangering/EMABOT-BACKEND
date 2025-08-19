const path = require('path');
const fs = require('fs');
const winston = require('winston');

// Ensure logs directory exists
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Base logger factory
function createLogger(moduleName) {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.label({ label: moduleName }), // 👈 add module name
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, label }) =>
                `${timestamp} [${level.toUpperCase()}] [${label}]: ${message}`
            )
        ),
        transports: [
            new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
            new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
            new winston.transports.Console()
        ]
    });
}

module.exports = createLogger;
