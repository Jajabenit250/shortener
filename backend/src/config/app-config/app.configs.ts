import 'dotenv/config';

const { env } = process;
const {
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  PORT,
  JWT_SECRET,
} = env;

const DATABASE: any = {
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
};

const GLOBAL_CONFIGS = { DATABASE, PORT, JWT_SECRET };
export default GLOBAL_CONFIGS;
