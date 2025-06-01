import chalk from 'chalk';
import { format } from 'date-fns';

const logLevelColors = {
  debug: chalk.blue,
  info: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  success: chalk.cyan
};

const logLevels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  success: 5
};

const envLogLevel = process.env.LOG_LEVEL || 'info';
const currentLogLevel = logLevels[envLogLevel] || logLevels.info;

export const logger = {
  debug: (message, metadata = {}) => {
    if (logLevels.debug >= currentLogLevel) {
      console.log(
        `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${logLevelColors.debug('[DEBUG]')} ${message}`,
        metadata
      );
    }
  },

  info: (message, metadata = {}) => {
    if (logLevels.info >= currentLogLevel) {
      console.log(
        `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${logLevelColors.info('[INFO]')} ${message}`,
        metadata
      );
    }
  },

  warn: (message, metadata = {}) => {
    if (logLevels.warn >= currentLogLevel) {
      console.log(
        `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${logLevelColors.warn('[WARN]')} ${message}`,
        metadata
      );
    }
  },

  error: (error, metadata = {}) => {
    if (logLevels.error >= currentLogLevel) {
      console.error(
        `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${logLevelColors.error('[ERROR]')} ${error.message}`,
        {
          stack: error.stack,
          ...metadata
        }
      );
    }
  },

  success: (message, metadata = {}) => {
    if (logLevels.success >= currentLogLevel) {
      console.log(
        `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] ${logLevelColors.success('[SUCCESS]')} ${message}`,
        metadata
      );
    }
  },

  setLevel: (level) => {
    const newLevel = logLevels[level];
    if (newLevel) {
      currentLogLevel = newLevel;
    }
  }
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 500 ? logLevelColors.error :
                       res.statusCode >= 400 ? logLevelColors.warn :
                       res.statusCode >= 300 ? logLevelColors.info :
                       logLevelColors.success;

    logger.info(
      `${statusColor(`${req.method} ${req.path} ${res.statusCode}`)} - ${duration}ms`,
      {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`
      }
    );
  });

  next();
};
