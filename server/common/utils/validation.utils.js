import { matchedData, validationResult } from 'express-validator';
import Errors from './errors.utils.js';

/**
 * Validates the request based on the provided validation rules.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} validationRules - A function that returns an array of validation rules.
 * @returns {Object} - The validated and sanitized data.
 * @throws {ValidationError} - If validation fails.
 */
export const validate = async (req, res, validationRules) => {
  await Promise.all(validationRules().map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => err.msg)
      .join('\n');
    throw new Errors.ValidationError({
      message: errorMessages,
      details: errors.array(),
    });
  }
  return matchedData(req);
};

/**
 * Checks if a field value is unique in the database.
 * @param {Object} model - The model to check against.
 * @param {string} field - The field to check.
 * @param {string} value - The value to check.
 * @param {string} excludeId - The ID to exclude from the check.
 * @param {Object} filter - The filter to apply to the check.
 * @returns {Promise<void>} - A promise that resolves when the check is complete.
 */
export const unique = async (model, field, value, excludeId, filter) => {
  const record = await model.findOne({
    [field]: value,
    _id: { $ne: excludeId },
    ...filter,
  });
  if (record) {
    throw new Error(`${field} must be unique`);
  }
};
