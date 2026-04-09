'use strict';

const path    = require('path');
const logger  = require('../utils/logger');
const { writeFileSafe, renderTemplate, toPascalCase, toKebabCase } = require('../utils/fs-helpers');

const MODEL_TPL_DIR = path.join(__dirname, '../templates/model');
const API_TPL_DIR   = path.join(__dirname, '../templates/api');
const CRUD_TPL_DIR  = path.join(__dirname, '../templates/crud');

/**
 * poudwal make:crud <n> [--ts]
 *
 * Generates:
 *   models/<ModelName>.(js|ts)
 *   app/api/<kebab-name>/route.(js|ts)          ← GET list + POST create
 *   app/api/<kebab-name>/[id]/route.(js|ts)     ← GET one + PUT + DELETE
 */
module.exports = function makeCrud(name, options = {}) {
  const ext       = options.ts ? 'ts' : 'js';
  const modelName = toPascalCase(name);
  const routeName = toKebabCase(name);
  const cwd       = process.cwd();

  logger.title(`make:crud → ${modelName} (model + full CRUD API)`);

  // ── 1. Model ──────────────────────────────────────────────────────────────
  const modelOut = path.join(cwd, 'models', `${modelName}.${ext}`);
  const modelTpl = path.join(MODEL_TPL_DIR, `model.${ext}.tpl`);
  writeFileSafe(modelOut, renderTemplate(modelTpl, { name: modelName }));

  // ── 2. Collection route  GET /api/<name>   POST /api/<name> ────────────
  const listOut = path.join(cwd, 'app', 'api', routeName, `route.${ext}`);
  const listTpl = path.join(API_TPL_DIR, `route.${ext}.tpl`);
  writeFileSafe(listOut, renderTemplate(listTpl, { modelName, routeName }));

  // ── 3. Item route  GET/PUT/DELETE /api/<name>/[id] ────────────────────
  const itemOut = path.join(cwd, 'app', 'api', routeName, '[id]', `route.${ext}`);
  const itemTpl = path.join(CRUD_TPL_DIR, `[id].route.${ext}.tpl`);
  writeFileSafe(itemOut, renderTemplate(itemTpl, { modelName, routeName }));

  logger.divider();
  logger.success(`CRUD scaffolding complete for ${modelName}`);
  logger.info(`Endpoints:`);
  console.log(`        GET    /api/${routeName}        → list all`);
  console.log(`        POST   /api/${routeName}        → create`);
  console.log(`        GET    /api/${routeName}/[id]   → get one`);
  console.log(`        PUT    /api/${routeName}/[id]   → update`);
  console.log(`        DELETE /api/${routeName}/[id]   → delete`);
};
