'use strict';

const rule = require('../../../lib/rules/no-test-return-value');
const RuleTester = require('eslint').RuleTester;

const { DEFAULT_TEST_HOOKS, ERROR_MESSAGE } = rule;

const TEST_FILE_NAME = 'some-test.js';
const NON_TEST_FILE_NAME = 'some-file.js';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-test-return-value', rule, {
  valid: [
    {
      code: 'describe(function() { 1; })',
      filename: TEST_FILE_NAME,
    },
    {
      code: 'describe(function() { return; })',
      filename: TEST_FILE_NAME,
    },
    {
      code: `
        foo(function() {
          bar('test');
          return 1;
        })`,
      filename: TEST_FILE_NAME,
    },
    {
      code: 'describe(function() { return true; })',
      filename: NON_TEST_FILE_NAME,
    },
  ],
  invalid: [
    ...DEFAULT_TEST_HOOKS.map((testHook) => ({
      code: `${testHook}(function() { return 1; })`,
      filename: TEST_FILE_NAME,
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    })),
    {
      code: `
        testHook(function(condition) {
          return condition ? 1 : 2;
        })`,
      filename: TEST_FILE_NAME,
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
      options: [{ testHooks: ['testHook'] }],
    },
  ],
});
