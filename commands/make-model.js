'use strict';

const path    = require('path');
const logger  = require('../utils/logger');
const { writeFileSafe, renderTemplate, toPascalCase } = require('../utils/fs-helpers');

const TPL_DIR = path.join(__dirname, '../templates/model');

/**
 * poudwal make:model <name> [--ts]
 *
 * Generates:
 *   models/<ModelName>.(js|ts)
 */
module.exports = function makeModel(name, options = {}) {
  const ext       = options.ts ? 'ts' : 'js';
  const modelName = toPascalCase(name);
  const outFile   = path.join(process.cwd(), 'models', `${modelName}.${ext}`);
  const tplFile   = path.join(TPL_DIR, `model.${ext}.tpl`);

  logger.title(`make:model → ${modelName}`);

  const content = renderTemplate(tplFile, { name: modelName });
  writeFileSafe(outFile, content);

  logger.success(`Model ${modelName} created at models/${modelName}.${ext}`);
  logger.info(`Import it with: import ${modelName} from '@/models/${modelName}'`);
};
