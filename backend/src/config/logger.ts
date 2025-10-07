import winston from 'winston';

/**
 * Create winston logger instance with appropriate configuration
 */
const createLogger = () => {
  const nodeEnv = process.env['NODE_ENV'] || 'development';
  const logLevel = process.env['LOG_LEVEL'] || 'info';

  const formats = [
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
  ];

  // Add pretty printing for development
  if (nodeEnv === 'development') {
    formats.push(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    );
  } else {
    // JSON format for production
    formats.push(winston.format.json());
  }

  const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(...formats),
    defaultMeta: {
      service: 'analytics-platform-backend',
      environment: nodeEnv,
    },
    transports: [
      // Console output
      new winston.transports.Console(),
    ],
  });

  // Add file transport for production
  if (nodeEnv === 'production') {
    logger.add(new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }));
    
    logger.add(new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }));
  }

  return logger;
};

export const logger = createLogger();

// Create a stream for Morgan HTTP request logging
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};