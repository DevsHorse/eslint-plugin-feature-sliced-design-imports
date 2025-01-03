/**
 * @fileoverview This rule enforces that imports from other layers should only access the public API of those modules.
 * @author Vladislav
 */
'use strict';

const rule = require('../../../lib/rules/public-api-imports'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();
ruleTester.run(
  'public-api-imports',
  rule,
  {
    valid: [
      {
        name: 'Relative import: ../model',
        filename: 'C:\\project\\src\\entities\\user\\ui\\Card',
        code: "import { UserType } from '../model/UserType';",
        errors: [],
      },
      {
        name: 'Absolute import: entities/user',
        filename: 'C:\\project\\src\\features\\addCard\\ui\\Card',
        code: "import { UserType } from '@/entities/user';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from testing public api to allowed pattern file',
        filename: 'C:\\project\\src\\entities\\StoreDecorator.tsx',
        code: "import { something } from '@/entities/user/testing';",
        errors: [],
        options: [
          {
            testFilePatterns: ['**/StoreDecorator.tsx'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from testing public api to allowed pattern file 2',
        filename: 'C:\\project\\src\\entities\\file.test.ts',
        code: "import { something } from '@/entities/user/testing';",
        errors: [],
        options: [
          {
            testFilePatterns: ['**/*.test.ts'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import between entities case via @x folder: @/entities/message/@x/user',
        filename: 'C:\\project\\src\\entities\\user\\model\\Type',
        code: "import { something } from '@/entities/message/@x/user';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from shared layer: shared/model/Id',
        filename: 'C:\\project\\src\\entities\\user\\model\\Type',
        code: "import { something } from '@/shared/model/Id';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from app layer: app/providers/Store',
        filename: 'C:\\project\\src\\app\\index.ts',
        code: "import { something } from '@/app/providers/Store';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
    ],

    invalid: [
      {
        name: 'Import not from public api: entities/user/model',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from incorrect testing public api: entities/user/testing/file.ts',
        filename: 'C:\\project\\src\\entities\\StoreDecorator.tsx',
        code: "import { something } from '@/entities/user/testing/file.ts';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            testFilePatterns: ['**/StoreDecorator.tsx'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from testing public api to incorrect pattern file',
        filename: 'C:\\project\\src\\entities\\StoreDecorator.tsx',
        code: "import { something } from '@/entities/user/testing';",
        errors: [
          { messageId: 'notTestingPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            testFilePatterns: ['**/*.test.ts'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Incorrect import between entities via @x folder: entities/message/@x',
        filename: 'C:\\project\\src\\entities\\user\\model\\Type',
        code: "import { something } from '@/entities/message/@x';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  }
);
