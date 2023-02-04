const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, colorize } = format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  levels: logLevels,
  transports: [new transports.Console()],
  format: combine(timestamp(), myFormat, colorize({ all: true })),
});

module.exports = logger;
