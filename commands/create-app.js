'use strict';

const path     = require('path');
const fs       = require('fs');
const inquirer = require('inquirer');
const ora      = require('ora');
const logger   = require('../utils/logger');
const { ensureDir, writeFileSafe, renderTemplate } = require('../utils/fs-helpers');

const TPL      = path.join(__dirname, '../templates/create');
const AUTH_TPL = path.join(__dirname, '../templates/auth');
const LIB_TPL  = path.join(__dirname, '../templates/lib');

/**
 * poudwal create <appName> [--ts]
 *
 * Scaffolds a complete Next.js 14 App Router project with:
 *   - MongoDB connection
 *   - JWT authentication
 *   - Example User model
 *   - .env.local stub
 *   - tsconfig (if --ts)
 */
module.exports = async function createApp(appName, options = {}) {
  const ext = options.ts ? 'ts' : 'js';
  const tsx = options.ts ? 'tsx' : 'jsx'; // for React files (unused directly, kept for clarity)

  logger.title(`create → ${appName}`);

  // ── Interactive prompts ───────────────────────────────────────────────────
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeAuth',
      message: 'Include JWT authentication scaffold?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Add a .gitignore file?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'proceed',
      message: `Create project in ./${appName}? This will create a new directory.`,
      default: true,
    },
  ]);

  if (!answers.proceed) {
    logger.warn('Aborted.');
    return;
  }

  const spinner = ora('Scaffolding project…').start();

  const root = path.join(process.cwd(), appName);

  try {
    // ── Directory skeleton ────────────────────────────────────────────────
    const dirs = [
      root,
      path.join(root, 'app'),
      path.join(root, 'app', 'api'),
      path.join(root, 'lib'),
      path.join(root, 'models'),
      path.join(root, 'middlewares'),
      path.join(root, 'public'),
    ];
    if (answers.includeAuth) {
      dirs.push(path.join(root, 'app', 'api', 'auth', 'register'));
      dirs.push(path.join(root, 'app', 'api', 'auth', 'login'));
    }
    dirs.forEach(ensureDir);

    // ── package.json ──────────────────────────────────────────────────────
    const tsDeps = options.ts
      ? `,\n    "typescript": "^5",\n    "@types/node": "^20",\n    "@types/react": "^18",\n    "@types/react-dom": "^18",\n    "@types/bcryptjs": "^2.4.6",\n    "@types/jsonwebtoken": "^9.0.6"`
      : '';
    writeFileSafe(
      path.join(root, 'package.json'),
      renderTemplate(path.join(TPL, 'package.json.tpl'), { appName, tsDeps })
    );

    // ── .env.local ────────────────────────────────────────────────────────
    writeFileSafe(
      path.join(root, '.env.local'),
      renderTemplate(path.join(TPL, 'env.tpl'), { appName })
    );

    // ── .gitignore ────────────────────────────────────────────────────────
    if (answers.initGit) {
      writeFileSafe(
        path.join(root, '.gitignore'),
        fs.readFileSync(path.join(TPL, 'gitignore.tpl'), 'utf8')
      );
    }

    // ── Next.js config ────────────────────────────────────────────────────
    writeFileSafe(
      path.join(root, `next.config.${ext === 'ts' ? 'ts' : 'js'}`),
      fs.readFileSync(path.join(TPL, `next.config.${ext === 'ts' ? 'ts' : 'js'}.tpl`), 'utf8')
    );

    // ── tsconfig.json (TS only) ───────────────────────────────────────────
    if (options.ts) {
      writeFileSafe(
        path.join(root, 'tsconfig.json'),
        fs.readFileSync(path.join(TPL, 'tsconfig.json.tpl'), 'utf8')
      );
    }

    // ── app/globals.css ───────────────────────────────────────────────────
    writeFileSafe(
      path.join(root, 'app', 'globals.css'),
      fs.readFileSync(path.join(TPL, 'globals.css.tpl'), 'utf8')
    );

    // ── app/layout.(js|tsx) ───────────────────────────────────────────────
    const layoutExt = options.ts ? 'tsx' : 'jsx';
    // We store both as .js.tpl / .ts.tpl but write with correct extension
    writeFileSafe(
      path.join(root, 'app', `layout.${layoutExt}`),
      renderTemplate(path.join(TPL, `layout.${ext}.tpl`), { appName })
    );

    // ── app/page.(js|tsx) ─────────────────────────────────────────────────
    writeFileSafe(
      path.join(root, 'app', `page.${layoutExt}`),
      renderTemplate(path.join(TPL, 'page.tpl'), {
        appName,
        ext: layoutExt,
      })
    );

    // ── lib/mongo ─────────────────────────────────────────────────────────
    writeFileSafe(
      path.join(root, 'lib', `mongo.${ext}`),
      fs.readFileSync(path.join(LIB_TPL, `mongo.${ext}.tpl`), 'utf8')
    );

    // ── Auth scaffold (optional) ──────────────────────────────────────────
    if (answers.includeAuth) {
      // lib/jwt
      writeFileSafe(
        path.join(root, 'lib', `jwt.${ext}`),
        fs.readFileSync(path.join(AUTH_TPL, `jwt.lib.${ext}.tpl`), 'utf8')
      );
      // models/User
      writeFileSafe(
        path.join(root, 'models', `User.${ext}`),
        fs.readFileSync(path.join(AUTH_TPL, `User.model.${ext}.tpl`), 'utf8')
      );
      // app/api/auth/register/route
      writeFileSafe(
        path.join(root, 'app', 'api', 'auth', 'register', `route.${ext}`),
        fs.readFileSync(path.join(AUTH_TPL, `register.route.${ext}.tpl`), 'utf8')
      );
      // app/api/auth/login/route
      writeFileSafe(
        path.join(root, 'app', 'api', 'auth', 'login', `route.${ext}`),
        fs.readFileSync(path.join(AUTH_TPL, `login.route.${ext}.tpl`), 'utf8')
      );
      // root middleware
      writeFileSafe(
        path.join(root, `middleware.${ext}`),
        fs.readFileSync(path.join(AUTH_TPL, `auth.middleware.${ext}.tpl`), 'utf8')
      );
    }

    spinner.succeed('Project scaffolded successfully!');
  } catch (err) {
    spinner.fail('Scaffolding failed.');
    logger.error(err.message);
    process.exit(1);
  }

  // ── Next steps ────────────────────────────────────────────────────────────
  logger.divider();
  logger.success(`Project "${appName}" is ready!`);
  logger.divider();
  logger.info('Next steps:');
  console.log(`\n        cd ${appName}`);
  console.log('        npm install');
  console.log('        # Edit .env.local → set MONGODB_URI & JWT_SECRET');
  console.log('        npm run dev\n');
  logger.info('Generate more files with poudwal:');
  console.log(`        poudwal make:model Post${options.ts ? ' --ts' : ''}`);
  console.log(`        poudwal make:crud  Post${options.ts ? ' --ts' : ''}`);
  console.log(`        poudwal make:lib   redis${options.ts ? ' --ts' : ''}\n`);
};
