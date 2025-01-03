/**
 * @fileoverview This rule enforces strict import order between defined architectural layers.
 * @author Vladislav
 */
'use strict';

const rule = require('../../../lib/rules/layer-imports'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run(
  'layer-imports',
  rule,
  {
    valid: [
      {
        name: 'From shared to entities',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/shared/ui/Button';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'React (any lib) to entities',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import {useState} from 'react';",
        errors: [],
      },
      {
        name: 'From app to app',
        filename: 'C:\\project\\src\\app\\model\\Type',
        code: "import { UserType } from '@/app/model/Type2';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to entities via @x folder',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/message/@x/user';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From shared to shared',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/shared/ui/Icon';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From app to index.ts',
        filename: 'C:\\project\\src\\index.ts',
        code: "import { UserType } from '@/app/providers/Provider';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From app to any layer (entities this case) with ignore pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { StoreSchema } from '@/app/providers/StoreProvider';",
        errors: [],
        options: [
          {
            ignoreImportsPattern: ['**/StoreProvider'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From widgets to entities with ignore pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { StoreSchema } from '@/widgets/footer/StoreProviderIgnored.tsx';",
        errors: [],
        options: [
          {
            ignoreImportsPattern: ['**/*Ignored.{ts,tsx,js,jsx}'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: "Import from undefined layer 'services' to 'entities'",
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { fetchData } from '@/services/api';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
    ],

    invalid: [
      {
        name: 'From features to shared',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { something } from '@/features/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From widgets to features',
        filename: 'C:\\project\\src\\features\\ui\\Button',
        code: "import { something } from '@/widgets/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From pages to widgets',
        filename: 'C:\\project\\src\\widgets\\ui\\Button',
        code: "import { something } from '@/pages/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From app to pages',
        filename: 'C:\\project\\src\\pages\\ui\\Button',
        code: "import { something } from '@/app/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to entities without @x folder',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { something } from '@/entities/message';",
        errors: [
          { messageId: 'incorrectEntityImports', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to entities without @x folder and alias',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from 'entities/message';",
        errors: [
          { messageId: 'incorrectEntityImports', type: 'ImportDeclaration' },
        ],
      },
      {
        name: 'From entities to entities with @x folder and incorrect entity name',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { something } from '@/entities/message/@x/userEntity';",
        errors: [
          { messageId: 'incorrectEntityImports', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to entities with @x folder and index.ts file',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { something } from '@/entities/message/@x';",
        errors: [
          { messageId: 'incorrectEntityImports', type: 'ImportDeclaration' },
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
