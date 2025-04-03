/**
 * Enhanced logger utility for the application
 */

// Set this to false in production
const DEBUG_MODE = true;

/**
 * Log levels
 */
export const LogLevel = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

/**
 * Format the current timestamp
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString();
};

/**
 * Generic log function
 * @param {string} level - Log level
 * @param {string} module - Module name
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 */
const log = (level, module, message, data = null) => {
    if (!DEBUG_MODE && level === LogLevel.DEBUG) return;

    const timestamp = getTimestamp();
    const prefix = `[${timestamp}] [${level}] [${module}]`;

    if (data) {
        console.log(`${prefix} ${message}`, data);
    } else {
        console.log(`${prefix} ${message}`);
    }
};

/**
 * Create a logger instance for a specific module
 * @param {string} moduleName - Name of the module using the logger
 * @returns {Object} Logger object with methods for each log level
 */
export const createLogger = (moduleName) => {
    return {
        debug: (message, data) => log(LogLevel.DEBUG, moduleName, message, data),
        info: (message, data) => log(LogLevel.INFO, moduleName, message, data),
        warn: (message, data) => log(LogLevel.WARN, moduleName, message, data),
        error: (message, data) => log(LogLevel.ERROR, moduleName, message, data),

        // Log API request data
        logRequest: (endpoint, method, payload) => {
            log(LogLevel.DEBUG, moduleName, `API ${method} Request to ${endpoint}`, payload);
        },

        // Log API response data
        logResponse: (endpoint, method, response) => {
            log(LogLevel.DEBUG, moduleName, `API ${method} Response from ${endpoint}`, response);
        },

        // Log API error
        logError: (endpoint, method, error) => {
            log(LogLevel.ERROR, moduleName, `API ${method} Error from ${endpoint}`, error);
        }
    };
};

export default {
    createLogger,
    LogLevel
};
