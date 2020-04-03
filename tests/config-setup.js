'use strict';
/* eslint-env node */

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const assert = require('assert');
const configs = require('../lib').configs;

const CONFIG_NAMES = Object.keys(configs);

describe('config setup is correct', function () {
  it('should have a list of exported configs and config directory that match', function () {
    const path = join(__dirname, '..', 'lib', 'config');
    const files = readdirSync(path);

    assert.deepStrictEqual(
      CONFIG_NAMES,
      files
        .filter((file) => !file.startsWith('.'))
        .map((file) => file.replace('.js', ''))
    );
  });

  it('should mention all configs in the README', function () {
    const path = join(__dirname, '..', 'README.md');
    const file = readFileSync(path);

    CONFIG_NAMES.forEach((configName) => assert.ok(file.includes(configName)));
  });
});
