/**
 * @fileoverview This rule enforces that imports within the same entity and layer use relative paths.
 * @author Vladislav
 */
'use strict';

const rule = require('../../../lib/rules/relative-imports'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run(
  'relative-imports',
  rule,
  {
    valid: [
      {
        name: 'To: shared, Import: ../model/Type',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { Type } from '../model/Type';",
        errors: [],
      },
      {
        name: 'To: shared, Import: @/shared/model/Type',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { Type } from '@/shared/model/Type';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'To: entities, Import: ../model/UserType',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '../model/UserType';",
        errors: [],
      },
      {
        name: 'To: features, Import: ./Type2',
        filename: 'C:\\project\\src\\features\\add\\model\\Type',
        code: "import { Type } from './Type2';",
        errors: [],
      },
      {
        name: 'To: widgets, Import: ./Type2',
        filename: 'C:\\project\\src\\widgets\\add\\model\\Type',
        code: "import { Type } from './Type2';",
        errors: [],
      },
      {
        name: 'To: pages, Import: ./Type2',
        filename: 'C:\\project\\src\\pages\\add\\model\\Type',
        code: "import { Type } from './Type2';",
        errors: [],
      },
      {
        name: 'To: app, Import: ../model/Type',
        filename: 'C:\\project\\src\\app\\providers\\Store',
        code: "import { Type } from '../model/Type';",
        errors: [],
      },
      {
        name: 'To: app, Import: @app/model/Type',
        filename: 'C:\\project\\src\\app\\providers\\Store',
        code: "import { Type } from '@app/model/Type';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
    ],

    invalid: [
      {
        name: 'Without alias. To: entities/user/ui/UserForm, Import: entities/user/model/UserType',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from 'entities/user/model/UserType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
      },
      {
        name: 'With alias @. To: entities/user/ui/UserForm, Import: @/entities/user/model/UserType',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'With custom layer (pages-layer) and alias @. To: pages-layer/home/ui/Page, Import: @/pages-layer/home',
        filename: 'C:\\project\\src\\pages-layer\\home\\ui\\Page',
        code: "import { UserType } from '@/pages-layer/home';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/layers': {
            pages: 'pages-layer',
          },
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
