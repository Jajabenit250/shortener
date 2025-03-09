import { DockerComposeEnvironment, Wait } from 'testcontainers';

module.exports = async function globalSetup(): Promise<void> {
  const composeFilePath = '.';

  const composeFile = ['test/docker-compose.test.yml'];

  const dbReady = Wait.forLogMessage('PostgreSQL init process complete');

  const redisReady = Wait.forLogMessage('Ready to accept connections');

  globalThis.composeEnv = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile,
  )
    .withStartupTimeout(60000)
    .withEnvironmentFile('.env.test')
    .withWaitStrategy('db', dbReady)
    .withWaitStrategy('redis', redisReady)
    .up();
};
