import { createLogger, format, transports } from 'winston';

const loggerFactory = (label) => {
  return createLogger({
    level: 'info',
    format: format.combine(
      format.label({ label }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => {
        return `[🦑${info.timestamp}🍜] [${
          info.label
        }] ${info.level.toUpperCase()}: ${info.message}`;
      }),
    ),
    transports: [new transports.Console()],
  });
};

export const logger = loggerFactory('server');

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
