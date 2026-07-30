const path = require('path');
const fs = require('fs');
const { help } = require('./commands/help');
const { init } = require('./commands/init');
const { start } = require('./commands/start');
const { status } = require('./commands/status');
const { switchSpec } = require('./commands/switch');
const { doctor } = require('./commands/doctor');

const COMMANDS = {
  help,
  init,
  start,
  status,
  switch: switchSpec,
  doctor,
};

async function run(args) {
  const [commandName, ...rest] = args;
  const name = commandName || 'help';

  if (!COMMANDS[name]) {
    console.error(`Unknown command: ${name}`);
    help([]);
    process.exit(1);
  }

  await COMMANDS[name](rest, { cwd: process.cwd() });
}

module.exports = { run, COMMANDS };
