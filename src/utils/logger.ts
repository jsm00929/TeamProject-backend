import { createLogger, format, transports } from 'winston';
import { Config } from '../config/env';

const { combine, printf, colorize, timestamp } = format;

// const consoleOptions: transports.ConsoleTransportOptions = {
//   level: Config.env.env === 'dev' ? 'debug' : 'error',
//   format: combine(colorize({ all: true }),
//   timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),),
//   handleExceptions: true,
// };

export const log = (() => {
  return createLogger({
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf((info) => {
        if (info.stack) {
          return `[🦑${info.timestamp}🍜] ${info.level.toUpperCase()}: ${
            info.message
          }\n  [Error Stack]: ${info.stack}\n`;
        }
        return `[🦑${info.timestamp}🍜] ${info.level.toUpperCase()}: ${
          info.message
        }\n`;
      }),
    ),
    transports: [
      new transports.Console({
        level: Config.env.env === 'dev' ? 'debug' : 'error',
        format: combine(
          colorize({ all: true }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        ),
        handleExceptions: true,
      }),
    ],
  });
})();

// const { combine, printf, label, timestamp, json, colorize } = format;

// const logDir = `${process.cwd()}/.logs`;
// const logFormat = printf(
//   ({ level, message, timestamp }) => `[🦑${timestamp}🍜] ${level}: ${message}`,
// );

// export const logger = createLogger({
//   level: 'info',
//   // format: format.combine(format.timestamp(), format.splat(), format.simple()),
//   format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
//   transports: [
//     new transports.Console({
//       format: combine(colorize()),
//     }),
//     new transports.File({ filename: 'error.log' }),
//   ],
// });

// export const logger = createLogger({
//   level: 'info',
//   format: format.json(),
//   transports: [new transports.File({ filename: 'error.log' })],
// });
