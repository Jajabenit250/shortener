module.exports = async function globalTeardown(): Promise<void> {
  await globalThis.composeEnv.down({ timeout: 60000 });
};
