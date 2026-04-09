'use strict';

const path    = require('path');
const logger  = require('../utils/logger');
const { writeFileSafe, renderTemplate, toPascalCase, toKebabCase } = require('../utils/fs-helpers');

const TPL_DIR = path.join(__dirname, '../templates/api');

/**
 * poudwal make:api <n> [--ts]
 *
 * Generates:
 *   app/api/<kebab-name>/route.(js|ts)
 */
module.exports = function makeApi(name, options = {}) {
  const ext       = options.ts ? 'ts' : 'js';
  const modelName = toPascalCase(name);
  const routeName = toKebabCase(name);
  const outFile   = path.join(process.cwd(), 'app', 'api', routeName, `route.${ext}`);
  const tplFile   = path.join(TPL_DIR, `route.${ext}.tpl`);

  logger.title(`make:api → /api/${routeName}`);

  const content = renderTemplate(tplFile, { modelName, routeName });
  writeFileSafe(outFile, content);

  logger.success(`API route created at app/api/${routeName}/route.${ext}`);
  logger.info(`Endpoint: GET|POST http://localhost:3000/api/${routeName}`);
};
