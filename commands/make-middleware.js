'use strict';

const path    = require('path');
const logger  = require('../utils/logger');
const { writeFileSafe, renderTemplate, toPascalCase, toKebabCase } = require('../utils/fs-helpers');

const TPL_DIR = path.join(__dirname, '../templates/middleware');

/**
 * poudwal make:middleware <n> [--ts]
 *
 * Generates:
 *   middlewares/<name>.(js|ts)
 */
module.exports = function makeMiddleware(name, options = {}) {
  const ext       = options.ts ? 'ts' : 'js';
  const pascalName = toPascalCase(name);
  const routeName  = toKebabCase(name);
  const outFile    = path.join(process.cwd(), 'middlewares', `${routeName}.${ext}`);
  const tplFile    = path.join(TPL_DIR, `middleware.${ext}.tpl`);

  logger.title(`make:middleware → ${pascalName}`);

  const content = renderTemplate(tplFile, { name: pascalName, routeName });
  writeFileSafe(outFile, content);

  logger.success(`Middleware created at middlewares/${routeName}.${ext}`);
  logger.info(`Apply it by importing into your root middleware.${ext}`);
};
