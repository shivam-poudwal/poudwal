'use strict';

const path     = require('path');
const inquirer = require('inquirer');
const logger   = require('../utils/logger');
const { writeFileSafe, renderTemplate } = require('../utils/fs-helpers');

const TPL_DIR = path.join(__dirname, '../templates/auth');
const LIB_TPL = path.join(__dirname, '../templates/lib');

/**
 * poudwal install:auth [--ts]
 *
 * Scaffolds full JWT authentication:
 *   lib/mongo.(js|ts)
 *   lib/jwt.(js|ts)
 *   models/User.(js|ts)
 *   app/api/auth/register/route.(js|ts)
 *   app/api/auth/login/route.(js|ts)
 *   middleware.(js|ts)   ← root Next.js middleware
 */
module.exports = async function installAuth(options = {}) {
  const ext = options.ts ? 'ts' : 'js';
  const cwd = process.cwd();

  logger.title('install:auth → JWT Authentication Scaffold');

  // ── Confirm ───────────────────────────────────────────────────────────────
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: `This will scaffold JWT auth (${ext}). Continue?`,
      default: true,
    },
  ]);

  if (!proceed) {
    logger.warn('Aborted.');
    return;
  }

  // ── 1. lib/mongo ──────────────────────────────────────────────────────────
  writeFileSafe(
    path.join(cwd, 'lib', `mongo.${ext}`),
    renderTemplate(path.join(LIB_TPL, `mongo.${ext}.tpl`), {})
  );

  // ── 2. lib/jwt ────────────────────────────────────────────────────────────
  writeFileSafe(
    path.join(cwd, 'lib', `jwt.${ext}`),
    renderTemplate(path.join(TPL_DIR, `jwt.lib.${ext}.tpl`), {})
  );

  // ── 3. models/User ────────────────────────────────────────────────────────
  writeFileSafe(
    path.join(cwd, 'models', `User.${ext}`),
    renderTemplate(path.join(TPL_DIR, `User.model.${ext}.tpl`), {})
  );

  // ── 4. app/api/auth/register/route ────────────────────────────────────────
  writeFileSafe(
    path.join(cwd, 'app', 'api', 'auth', 'register', `route.${ext}`),
    renderTemplate(path.join(TPL_DIR, `register.route.${ext}.tpl`), {})
  );

  // ── 5. app/api/auth/login/route ───────────────────────────────────────────
  writeFileSafe(
    path.join(cwd, 'app', 'api', 'auth', 'login', `route.${ext}`),
    renderTemplate(path.join(TPL_DIR, `login.route.${ext}.tpl`), {})
  );

  // ── 6. Root middleware ────────────────────────────────────────────────────
  writeFileSafe(
    path.join(cwd, `middleware.${ext}`),
    renderTemplate(path.join(TPL_DIR, `auth.middleware.${ext}.tpl`), {})
  );

  // ── Summary ───────────────────────────────────────────────────────────────
  logger.divider();
  logger.success('Auth scaffold complete!');
  logger.info('Files created:');
  console.log('        lib/mongo.' + ext);
  console.log('        lib/jwt.' + ext);
  console.log('        models/User.' + ext);
  console.log('        app/api/auth/register/route.' + ext);
  console.log('        app/api/auth/login/route.' + ext);
  console.log('        middleware.' + ext);
  logger.divider();
  logger.info('Next steps:');
  console.log('        1. Add MONGODB_URI, JWT_SECRET, JWT_EXPIRES to .env.local');
  console.log('        2. Install deps:  npm install mongoose bcryptjs jsonwebtoken');
  if (ext === 'ts') {
    console.log('        3. Install types: npm install -D @types/bcryptjs @types/jsonwebtoken');
  }
  console.log('        4. POST /api/auth/register  →  create account');
  console.log('        5. POST /api/auth/login     →  get JWT token');
};
