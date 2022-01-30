import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 9000

export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME

export const PUSHER_APPID = process.env.PUSHER_APPID
export const PUSHER_KEY = process.env.PUSHER_KEY
export const PUSHER_SECRET = process.env.PUSHER_SECRET
export const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER