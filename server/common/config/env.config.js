/* eslint-disable no-undef */
import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || null;
export const JWT_SECRET = process.env.JWT_SECRET || null;
export const JWT_EXPIRE = process.env.JWT_EXPIRE || null;
export const SMTP_HOST = process.env.SMTP_HOST || null;
export const SMTP_PORT = process.env.SMTP_PORT || null;
export const SMTP_USER = process.env.SMTP_USER || null;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || null;
export const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || null;
export const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || null;
