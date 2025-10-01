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
      {
        name: "Without currect file path",
        code: "import { fetchData } from '@/services/api';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Same layer import with global ignore import pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['entities/user/model/**'],
        },
      },
      {
        name: 'Same layer import with global ignore file pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/entities/user/ui/*'],
        },
      },
      {
        name: 'Same layer import with local ignore import pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
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
        name: 'Different layers (shared to entities)',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { Button } from '@/shared/ui/Button';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'External library import',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { useState } from 'react';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Same layer, different slice (entities/message to entities/user)',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { MessageType } from '@/entities/message';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Same layer import with local ignore files pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
        errors: [],
        options: [
          {
            ignoreFilesPattern: ['**/entities/user/ui/*'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Features same slice with local ignore files pattern',
        filename: 'C:\\project\\src\\features\\addCard\\ui\\Button',
        code: "import { UserType } from '@/features/addCard/model/Type';",
        errors: [],
        options: [
          {
            ignoreFilesPattern: ['**/features/addCard/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Relative import within same slice (entities/user)',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '../model/UserType';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Relative import within shared layer',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { theme } from '../../config/theme';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Relative import within app layer',
        filename: 'C:\\project\\src\\app\\providers\\StoreProvider',
        code: "import { store } from '../store/store';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Relative import within custom shared layer (shared -> shared-layer)',
        filename: 'C:\\project\\src\\shared-layer\\ui\\Button',
        code: "import { theme } from '../../config/theme';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            shared: 'shared-layer',
          },
        },
      },
      {
        name: 'Relative import within custom pages layer same slice (pages -> pages-layer)',
        filename: 'C:\\project\\src\\pages-layer\\home\\ui\\HomePage',
        code: "import { HomeType } from '../model/HomeType';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            pages: 'pages-layer',
          },
        },
      },
      {
        name: 'Custom layers with entities->domain and app->application',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { UserType } from '../model/UserType';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
            app: 'application',
          },
        },
      },
      {
        name: 'Invalid filename path',
        filename: 'C:\\project\\ui\\UserForm',
        code: "import { Button } from '@/shared/ui/Button';",
        errors: [],
      },
      {
        name: 'Relative import in non-FSD folder (i18n)',
        filename: 'C:\\project\\src\\i18n\\locales\\en',
        code: "import { ru } from '../locales/ru';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Relative import from non-FSD folder to another non-FSD folder',
        filename: 'C:\\project\\src\\i18n\\config',
        code: "import { locales } from '../utils/index';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Absolute import in non-FSD folder (i18n)',
        filename: 'C:\\project\\src\\i18n\\config',
        code: "import { locales } from '@/i18n/locales';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'import in non-FSD folder from FSD folder',
        filename: 'C:\\project\\src\\i18n\\config',
        code: "import { locales } from '../shared/config/locales';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'import in FSD folder from non-FSD folder',
        filename: 'C:\\project\\src\\shared\\config',
        code: "import { locales } from '../18n/config/locales';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross "folder" relative import in non-FSD folders (i18n to utils)',
        filename: 'C:\\project\\src\\i18n\\config\\i18n',
        code: "import { format } from '../../utils/helpers/format';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      }
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
      {
        name: 'Features layer same slice import without alias',
        filename: 'C:\\project\\src\\features\\addCard\\ui\\Button',
        code: "import { UserType } from 'features/addCard/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
      },
      {
        name: 'Widgets layer same slice import',
        filename: 'C:\\project\\src\\widgets\\header\\ui\\Header',
        code: "import { HeaderType } from '@/widgets/header/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Pages layer same slice import',
        filename: 'C:\\project\\src\\pages\\home\\ui\\Page',
        code: "import { HomeType } from '@/pages/home/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Shared layer same slice import',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { ButtonType } from '@/shared/ui/types/ButtonType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'App layer same slice import',
        filename: 'C:\\project\\src\\app\\providers\\Store',
        code: "import { StoreType } from '@/app/providers/types/StoreType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Entities same slice with wrong global ignore import pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['entities/message/**'],
        },
      },
      {
        name: 'Features same slice with wrong global ignore file pattern',
        filename: 'C:\\project\\src\\features\\addCard\\ui\\Button',
        code: "import { UserType } from '@/features/addCard/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/features/auth/**'],
        },
      },
      {
        name: 'Widgets same slice with wrong local ignore import pattern',
        filename: 'C:\\project\\src\\widgets\\header\\ui\\Header',
        code: "import { HeaderType } from '@/widgets/header/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['widgets/footer/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Shared same slice with all wrong ignore patterns',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { ButtonType } from '@/shared/ui/types/ButtonType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['entities/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['features/**'],
          'feature-sliced-design-imports/ignoreFiles': ['**/widgets/**'],
        },
      },
      {
        name: 'Pages same slice with partial matching wrong pattern',
        filename: 'C:\\project\\src\\pages\\home\\ui\\Page',
        code: "import { HomeType } from '@/pages/home/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['pages/auth/**'],
        },
      },
      {
        name: 'Entities same slice with wrong local ignore files pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { UserType } from '@/entities/user/model/UserType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreFilesPattern: ['**/entities/message/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Features same slice with wrong local ignore files pattern',
        filename: 'C:\\project\\src\\features\\addCard\\ui\\Button',
        code: "import { UserType } from '@/features/addCard/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreFilesPattern: ['**/features/auth/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Widgets same slice with combined wrong ignore patterns',
        filename: 'C:\\project\\src\\widgets\\header\\ui\\Header',
        code: "import { HeaderType } from '@/widgets/header/model/Type';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['entities/**'],
            ignoreFilesPattern: ['**/widgets/footer/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Shared same slice with all types of wrong patterns',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { ButtonType } from '@/shared/ui/types/ButtonType';",
        errors: [
          { messageId: 'shouldBeRelativePath', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['pages/**'],
            ignoreFilesPattern: ['**/widgets/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['entities/**'],
          'feature-sliced-design-imports/ignoreFiles': ['**/features/**'],
        },
      },
      {
        name: 'Cross-slice relative import in entities (user to article)',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { ArticleType } from '../../article/model/Article';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-slice relative import in features (auth to profile)',
        filename: 'C:\\project\\src\\features\\auth\\ui\\LoginForm',
        code: "import { ProfileType } from '../../profile/model/Profile';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-slice relative import in widgets (header to footer)',
        filename: 'C:\\project\\src\\widgets\\header\\ui\\Header',
        code: "import { FooterType } from '../../footer/model/Footer';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-slice relative import in pages (home to about)',
        filename: 'C:\\project\\src\\pages\\home\\ui\\HomePage',
        code: "import { AboutType } from '../../about/model/About';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-layer relative import from entities to shared',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '../../entities/user/model/User';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-layer relative import from pages to entities',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { HomeType } from '../../../pages/home/model/Home';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-layer relative import from shared to app',
        filename: 'C:\\project\\src\\app\\providers\\StoreProvider',
        code: "import { theme } from '../../shared/config/theme';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-layer relative import from app to shared',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { store } from '../../app/providers/store';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Cross-slice relative import with custom entities layer (entities -> domain)',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { ArticleType } from '../../article/model/Article';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
          },
        },
      },
      {
        name: 'Cross-layer relative import with custom layers (shared-layer -> pages-layer)',
        filename: 'C:\\project\\src\\pages-layer\\home\\ui\\HomePage',
        code: "import { theme } from '../../../shared-layer/config/theme';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            shared: 'shared-layer',
            pages: 'pages-layer',
          },
        },
      },
      {
        name: 'Cross-layer relative import with multiple custom layers',
        filename: 'C:\\project\\src\\application\\providers\\StoreProvider',
        code: "import { UserType } from '../../domain/user/model/User';",
        errors: [
          { messageId: 'crossSliceRelativeImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            app: 'application',
            entities: 'domain',
          },
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
