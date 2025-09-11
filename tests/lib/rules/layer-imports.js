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
        name: 'From entities to shared with global ignore import pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['entities'],
        },
      },
      {
        name: 'From entities to shared with global ignore file pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/shared/ui/*'],
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
      {
        name: 'Without currect file path',
        code: "import { fetchData } from '@/services/api';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From shared to entities with local ignore import pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { StoreSchema } from '@/shared/providers/StoreProvider';",
        errors: [],
        options: [
          {
            ignoreImportsPattern: ['shared/providers/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From features to shared with global ignore file pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { something } from '@/features/getCard';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/shared/ui/*'],
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
        name: 'Node modules import',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import axios from 'axios';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to shared with local ignore files pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities/user';",
        errors: [],
        options: [
          {
            ignoreFilesPattern: ['**/shared/ui/*'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From features to shared with local ignore files pattern',
        filename: 'C:\\project\\src\\shared\\model\\Button',
        code: "import { something } from '@/features/getCard';",
        errors: [],
        options: [
          {
            ignoreFilesPattern: ['**/shared/model/*'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Custom shared layer name (shared-layer) import to entities',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { Button } from '@/shared-layer/ui/Button';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
            shared: 'shared-layer',
          },
        },
      },
      {
        name: 'Custom entities layer name (domain) import to custom features (modules)',
        filename: 'C:\\project\\src\\modules\\addCard\\ui\\Button',
        code: "import { UserType } from '@/domain/user';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
            features: 'modules',
          },
        },
      },
      {
        name: 'Custom features layer name (modules) import to widgets',
        filename: 'C:\\project\\src\\widgets\\header\\ui\\Header',
        code: "import { addCard } from '@/modules/addCard';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            features: 'modules',
          },
        },
      },
      {
        name: 'Custom widgets layer name (components) import to routes',
        filename: 'C:\\project\\src\\routes\\home\\ui\\HomePage',
        code: "import { Header } from '@/components/header';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            widgets: 'components',
            pages: 'routes',
          },
        },
      },
      {
        name: 'Custom entities layer (domain) cross-entity via @x folder',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { MessageType } from '@/domain/message/@x/user';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
          },
        },
      },
      {
        name: 'Custom pages layer name (routes) to custom app (application)',
        filename: 'C:\\project\\src\\application\\providers\\StoreProvider',
        code: "import { HomePage } from '@/routes/home';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            app: 'application',
            pages: 'routes',
          },
        },
      },
      {
        name: 'All custom layer names - from custom shared to custom entities',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { Button } from '@/shared-layer/ui/Button';",
        errors: [],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            app: 'application',
            pages: 'routes',
            widgets: 'components',
            features: 'modules',
            entities: 'domain',
            shared: 'shared-layer',
          },
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
        filename: 'C:\\project\\src\\features\\getCard\\ui\\Button',
        code: "import { something } from '@/widgets/footer';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From pages to widgets',
        filename: 'C:\\project\\src\\widgets\\footer\\ui\\Button',
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
        filename: 'C:\\project\\src\\pages\\home\\Button',
        code: "import { something } from '@/app/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From pages to shared',
        filename: 'C:\\project\\src\\shared\\ui\\BurgerMenu\\BurgerMenu',
        code: "import { something } from '@/pages/privacy';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to shared',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { something } from '@/entities/user/model';",
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
      {
        name: 'From entities to shared without global ignore patterns',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to shared with global ignore file pattern but incorrect file path',
        filename: 'C:\\project\\src\\shared\\model\\types',
        code: "import { UserType } from '@/entities';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/shared/ui/*'],
        },
      },
      {
        name: 'From entities to shared with global ignore import pattern but incorrect import path',
        filename: 'C:\\project\\src\\shared\\model\\types',
        code: "import { UserType } from '@/entities';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['features'],
        },
      },
      {
        name: 'From widgets to entities without ignore pattern',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { StoreSchema } from '@/widgets/footer/StoreProvider.tsx';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From pages to entities',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { something } from '@/pages/home';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From app to features',
        filename: 'C:\\project\\src\\features\\addCard\\ui\\Button',
        code: "import { something } from '@/app/providers';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From entities to shared with wrong global ignore import pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities/user';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['features'],
        },
      },
      {
        name: 'From entities to shared with wrong global ignore file pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities/user';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreFiles': ['**/shared/model/*'],
        },
      },
      {
        name: 'From features to shared with wrong local ignore import pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { something } from '@/features/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['widgets/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From widgets to features with wrong ignore patterns combined',
        filename: 'C:\\project\\src\\features\\getCard\\ui\\Button',
        code: "import { something } from '@/widgets/footer';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['pages/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/ignoreImports': ['app/**'],
          'feature-sliced-design-imports/ignoreFiles': ['**/features/auth/**'],
        },
      },
      {
        name: 'From entities to shared with wrong local ignore files pattern',
        filename: 'C:\\project\\src\\shared\\ui\\Button',
        code: "import { UserType } from '@/entities/user';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreFilesPattern: ['**/shared/model/*'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From features to shared with wrong local ignore files pattern',
        filename: 'C:\\project\\src\\shared\\model\\Button',
        code: "import { something } from '@/features/getCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreFilesPattern: ['**/shared/ui/*'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'From widgets to entities with combined wrong ignore patterns',
        filename: 'C:\\project\\src\\entities\\user\\ui\\UserForm',
        code: "import { StoreSchema } from '@/widgets/footer/StoreProvider.tsx';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        options: [
          {
            ignoreImportsPattern: ['pages/**'],
            ignoreFilesPattern: ['**/entities/message/**'],
          },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
        },
      },
      {
        name: 'Custom features (modules) to custom shared (shared-layer) - invalid',
        filename: 'C:\\project\\src\\shared-layer\\ui\\Button',
        code: "import { addCard } from '@/modules/addCard';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            features: 'modules',
            shared: 'shared-layer',
          },
        },
      },
      {
        name: 'Custom widgets (components) to custom features (modules) - invalid',
        filename: 'C:\\project\\src\\modules\\addCard\\ui\\Button',
        code: "import { Header } from '@/components/header';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            widgets: 'components',
            features: 'modules',
          },
        },
      },
      {
        name: 'Custom pages (routes) to custom widgets (components) - invalid',
        filename: 'C:\\project\\src\\components\\header\\ui\\Header',
        code: "import { HomePage } from '@/routes/home';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            pages: 'routes',
            widgets: 'components',
          },
        },
      },
      {
        name: 'Custom app (application) to custom pages (routes) - invalid',
        filename: 'C:\\project\\src\\routes\\home\\ui\\HomePage',
        code: "import { StoreProvider } from '@/application/providers';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            app: 'application',
            pages: 'routes',
          },
        },
      },
      {
        name: 'Custom entities (domain) to custom shared (shared-layer) - invalid',
        filename: 'C:\\project\\src\\shared-layer\\ui\\Button',
        code: "import { UserType } from '@/domain/user';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
            shared: 'shared-layer',
          },
        },
      },
      {
        name: 'Custom entities (domain) cross-entity without @x folder - invalid',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { MessageType } from '@/domain/message';",
        errors: [
          { messageId: 'incorrectEntityImports', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
          },
        },
      },
      {
        name: 'Custom entities (domain) cross-entity with incorrect @x target - invalid',
        filename: 'C:\\project\\src\\domain\\user\\ui\\UserForm',
        code: "import { MessageType } from '@/domain/message/@x/article';",
        errors: [
          { messageId: 'incorrectEntityImports', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            entities: 'domain',
          },
        },
      },
      {
        name: 'All custom layers - invalid upward import (application->routes)',
        filename: 'C:\\project\\src\\routes\\home\\ui\\HomePage',
        code: "import { StoreProvider } from '@/application/providers/StoreProvider';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            app: 'application',
            pages: 'routes',
            widgets: 'components',
            features: 'modules',
            entities: 'domain',
            shared: 'shared-layer',
          },
        },
      },
      {
        name: 'All custom layers - invalid cross-layer (components->modules)',
        filename: 'C:\\project\\src\\modules\\addCard\\ui\\Button',
        code: "import { Header } from '@/components/header';",
        errors: [
          { messageId: 'incorrectLayerImport', type: 'ImportDeclaration' },
        ],
        settings: {
          'feature-sliced-design-imports/alias': '@',
          'feature-sliced-design-imports/layers': {
            app: 'application',
            pages: 'routes',
            widgets: 'components',
            features: 'modules',
            entities: 'domain',
            shared: 'shared-layer',
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
