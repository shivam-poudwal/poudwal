#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');

// ─── Banner ───────────────────────────────────────────────────────────────────
console.log(
  chalk.cyan.bold(`
  ██████╗  ██████╗ ██╗   ██╗██████╗ ██╗    ██╗ █████╗ ██╗     
  ██╔══██╗██╔═══██╗██║   ██║██╔══██╗██║    ██║██╔══██╗██║     
  ██████╔╝██║   ██║██║   ██║██║  ██║██║ █╗ ██║███████║██║     
  ██╔═══╝ ██║   ██║██║   ██║██║  ██║██║███╗██║██╔══██║██║     
  ██║     ╚██████╔╝╚██████╔╝██████╔╝╚███╔███╔╝██║  ██║███████╗
  ╚═╝      ╚═════╝  ╚═════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝
  `)
);
console.log(chalk.gray(`  Next.js Artisan CLI  v${pkg.version}\n`));

// ─── Commands ─────────────────────────────────────────────────────────────────
const makeModel      = require('../commands/make-model');
const makeApi        = require('../commands/make-api');
const makeCrud       = require('../commands/make-crud');
const makeMiddleware = require('../commands/make-middleware');
const makeLib        = require('../commands/make-lib');
const installAuth    = require('../commands/install-auth');
const createApp      = require('../commands/create-app');

program
  .name('poudwal')
  .description(chalk.yellow('Laravel Artisan-style CLI for Next.js + MongoDB projects'))
  .version(pkg.version);

// poudwal make:model <Name> [--ts]
program
  .command('make:model <name>')
  .description('Generate a Mongoose model')
  .option('--ts', 'Generate TypeScript file')
  .action((name, options) => makeModel(name, options));

// poudwal make:api <name> [--ts]
program
  .command('make:api <name>')
  .description('Generate a Next.js App Router API route')
  .option('--ts', 'Generate TypeScript file')
  .action((name, options) => makeApi(name, options));

// poudwal make:crud <name> [--ts]
program
  .command('make:crud <name>')
  .description('Generate a full CRUD (model + API route)')
  .option('--ts', 'Generate TypeScript files')
  .action((name, options) => makeCrud(name, options));

// poudwal make:middleware <name> [--ts]
program
  .command('make:middleware <name>')
  .description('Generate a Next.js middleware')
  .option('--ts', 'Generate TypeScript file')
  .action((name, options) => makeMiddleware(name, options));

// poudwal make:lib <name> [--ts]
program
  .command('make:lib <name>')
  .description('Generate a lib utility (e.g. mongo, redis)')
  .option('--ts', 'Generate TypeScript file')
  .action((name, options) => makeLib(name, options));

// poudwal install:auth [--ts]
program
  .command('install:auth')
  .description('Scaffold JWT authentication (model + routes + middleware)')
  .option('--ts', 'Generate TypeScript files')
  .action((options) => installAuth(options));

// poudwal create <app-name> [--ts]
program
  .command('create <appName>')
  .description('Scaffold a full Next.js project with MongoDB + Auth')
  .option('--ts', 'Use TypeScript')
  .action((appName, options) => createApp(appName, options));

program.parse(process.argv);

// Show help if no command given
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
