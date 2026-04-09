'use strict';

const chalk = require('chalk');

const logger = {
  info:    (msg) => console.log(chalk.cyan('  ℹ  ') + msg),
  success: (msg) => console.log(chalk.green('  ✔  ') + msg),
  warn:    (msg) => console.log(chalk.yellow('  ⚠  ') + msg),
  error:   (msg) => console.log(chalk.red('  ✖  ') + msg),
  divider: ()    => console.log(chalk.gray('  ' + '─'.repeat(50))),
  title:   (msg) => {
    console.log('');
    console.log(chalk.bold.magenta(`  ▶ ${msg}`));
    console.log(chalk.gray('  ' + '─'.repeat(50)));
  },
};

module.exports = logger;
