'use strict';

const fs   = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Ensure a directory (and all parents) exist.
 * @param {string} dirPath
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write a file safely – aborts if the file already exists.
 * @param {string} filePath
 * @param {string} content
 * @returns {boolean}  true = written, false = skipped
 */
function writeFileSafe(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(chalk.yellow(`  [skip] Already exists: ${filePath}`));
    return false;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(chalk.green(`  [create] ${filePath}`));
  return true;
}

/**
 * Load a template file and replace all {{placeholder}} tokens.
 * @param {string} templatePath  – absolute path to the template file
 * @param {Record<string,string>} vars
 * @returns {string}
 */
function renderTemplate(templatePath, vars = {}) {
  let tpl = fs.readFileSync(templatePath, 'utf8');
  for (const [key, value] of Object.entries(vars)) {
    tpl = tpl.replaceAll(`{{${key}}}`, value);
  }
  return tpl;
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to PascalCase (e.g. "blog-post" → "BlogPost").
 * @param {string} str
 * @returns {string}
 */
function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * Convert a string to camelCase (e.g. "BlogPost" → "blogPost").
 * @param {string} str
 * @returns {string}
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert a string to kebab-case (e.g. "BlogPost" → "blog-post").
 * @param {string} str
 * @returns {string}
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

module.exports = {
  ensureDir,
  writeFileSafe,
  renderTemplate,
  capitalize,
  toPascalCase,
  toCamelCase,
  toKebabCase,
};
