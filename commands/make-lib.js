'use strict';

const path     = require('path');
const fs       = require('fs');
const logger   = require('../utils/logger');
const { writeFileSafe, renderTemplate, toKebabCase } = require('../utils/fs-helpers');

const TPL_DIR = path.join(__dirname, '../templates/lib');

// Known first-party lib templates
const KNOWN_LIBS = ['mongo'];

/**
 * poudwal make:lib <n> [--ts]
 *
 * Generates:
 *   lib/<n>.(js|ts)
 *
 * If a named template exists (e.g. mongo.js.tpl) it is used;
 * otherwise a blank utility stub is generated.
 */
module.exports = function makeLib(name, options = {}) {
  const ext      = options.ts ? 'ts' : 'js';
  const libName  = toKebabCase(name);
  const outFile  = path.join(process.cwd(), 'lib', `${libName}.${ext}`);

  logger.title(`make:lib → lib/${libName}.${ext}`);

  // Try named template first, fall back to a generic stub
  const namedTpl  = path.join(TPL_DIR, `${libName}.${ext}.tpl`);
  const hasNamed  = fs.existsSync(namedTpl);

  let content;
  if (hasNamed) {
    content = renderTemplate(namedTpl, { libName });
    logger.info(`Using built-in template for "${libName}"`);
  } else {
    // Generic stub
    content = ext === 'ts'
      ? `// lib/${libName}.ts\n// TODO: implement ${libName} utility\n\nexport {};\n`
      : `// lib/${libName}.js\n// TODO: implement ${libName} utility\n`;
    logger.info(`No built-in template for "${libName}" – generating blank stub`);
    logger.info(`Built-in templates available: ${KNOWN_LIBS.join(', ')}`);
  }

  writeFileSafe(outFile, content);

  logger.success(`Lib created at lib/${libName}.${ext}`);

  if (libName === 'mongo') {
    logger.info('Add MONGODB_URI to your .env.local file');
    logger.info(`Import with: import dbConnect from '@/lib/mongo'`);
  }
};
