/**
 * Health check controller to verify API is running
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const checkHealth = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running correctly',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
};
