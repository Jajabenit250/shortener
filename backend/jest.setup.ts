import environment from 'dotenv';
import 'jest-extended';

/***
 * Please feel free to add anything you want to run or execute before tests starts here.
 */
 environment.config({ path: '.env.test' });

/**
 * Silence console logs noise
 */
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.setTimeout(20000);//In case you want to change the timeout...
