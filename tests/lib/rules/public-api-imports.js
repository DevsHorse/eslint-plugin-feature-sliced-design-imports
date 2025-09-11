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
      {
        name: "Without currect file path",
        code: "import { fetchData } from '@/services/api';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities/user/model to widgets with global ignore import pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['entities/user/model'],
        },
      },
      {
        name: 'From entities/user/model to widgets with global ignore file pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/widgets/footer'],
        },
      },
      {
        name: 'From entities/user/model to widgets with local ignore import pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [],
        options: [
          {
            ignoreImportsPattern: ['entities/user/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Relative import within same layer',
        filename: 'C:\\project\\src\\entities\\user\\ui\\Card',
        code: "import { UserType } from '../model/UserType';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from external library',
        filename: 'C:\\project\\src\\entities\\user\\ui\\Card',
        code: "import { useState } from 'react';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities/user/model to widgets with local ignore files pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [],
        options: [
          {
            ignoreFilesPattern: ['**/widgets/footer'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From features/auth/model to pages with local ignore files pattern',
        filename: 'C:\\project\\src\\pages\\login',
        code: "import { AuthType } from '@/features/auth/model/types';",
        errors: [],
        options: [
          {
            ignoreFilesPattern: ['**/pages/login'],
          },
        ],
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
      {
        name: 'Import from features internal API without ignore',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/features/user/model/selectors';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from widgets internal API',
        filename: 'C:\\project\\src\\pages\\home',
        code: "import { UserType } from '@/widgets/footer/ui/components/Button';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from pages internal API',
        filename: 'C:\\project\\src\\app\\App',
        code: "import { UserType } from '@/pages/home/ui/components/Header';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Import from testing API without test file pattern',
        filename: 'C:\\project\\src\\entities\\regular-file.tsx',
        code: "import { something } from '@/entities/user/testing';",
        errors: [
          { messageId: 'notTestingPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Deep import into testing API',
        filename: 'C:\\project\\src\\entities\\file.test.tsx',
        code: "import { something } from '@/entities/user/testing/mocks/user';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            testFilePatterns: ['**/*.test.*'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities/user/model to widgets with wrong global ignore import pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['entities/message/model'],
        },
      },
      {
        name: 'From entities/user/model to widgets with wrong global ignore file pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/widgets/header'],
        },
      },
      {
        name: 'From entities/user/model to widgets with wrong local ignore import pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['features/user/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From features/auth/model to pages with wrong ignore patterns',
        filename: 'C:\\project\\src\\pages\\login',
        code: "import { AuthType } from '@/features/auth/model/types';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['features/user/**'],
          'feature-sliced-design-imports/ignoreFiles': ['**/pages/home'],
        },
      },
      {
        name: 'From entities/user/model to widgets with wrong local ignore files pattern',
        filename: 'C:\\project\\src\\widgets\\footer',
        code: "import { UserType } from '@/entities/user/model';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreFilesPattern: ['**/widgets/header'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From features/auth/model to pages with wrong local ignore files pattern',
        filename: 'C:\\project\\src\\pages\\login',
        code: "import { AuthType } from '@/features/auth/model/types';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreFilesPattern: ['**/pages/home'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From widgets/footer/ui to pages with combined wrong ignore patterns',
        filename: 'C:\\project\\src\\pages\\home',
        code: "import { UserType } from '@/widgets/footer/ui/components/Button';",
        errors: [
          { messageId: 'notPublicApiImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['entities/**'],
            ignoreFilesPattern: ['**/pages/auth'],
          },
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
