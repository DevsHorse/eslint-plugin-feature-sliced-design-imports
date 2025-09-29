# eslint-plugin-feature-sliced-design-imports

Custom ESLint plugin designed to enforce strict import rules in projects following the [Feature-Sliced Design](https://feature-sliced.design/) architecture.

### [Versions](https://github.com/DevsHorse/eslint-plugin-feature-sliced-design-imports/blob/main/VERSIONS_DETAILS.md)

---

## Installation

Install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next install `eslint-plugin-feature-sliced-design-imports`:

```sh
npm install eslint-plugin-feature-sliced-design-imports --save-dev
```

## Usage

Add `feature-sliced-design-imports` to the plugins section of your eslint configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "feature-sliced-design-imports"
    ]
}
```

## **Settings**

The plugin supports global settings that apply to all rules:

```json
{
    "settings": {
        "feature-sliced-design-imports/alias": "@",
        "feature-sliced-design-imports/layers": {
            "app": "application",
            "pages": "routes", 
            "widgets": "components",
            "features": "modules",
            "entities": "domain",
            "shared": "shared-lib"
        },
        "feature-sliced-design-imports/ignoreImports": [
            "**/testing/**",
            "**/*.test.*",
            "**/stories/**"
        ],
        "feature-sliced-design-imports/ignoreFiles": [
            "**/config/**",
            "**/*.config.*",
            "**/tests/**"
        ]
    }
}
```

### Settings Options

#### `alias` (string)
- **Purpose**: Defines the import alias used in your project
- **Example**: `"@"` for imports like `@/shared/ui/Button`
- **Default**: `""` (no alias)

#### `layers` (object)
- **Purpose**: Maps default FSD layer names to your custom names
- **Format**: `{ "standard-name": "your-custom-name" }`
- **Supported layers**: `app`, `pages`, `widgets`, `features`, `entities`, `shared`
- **Example**: `{ "entities": "domain", "shared": "common" }`

#### `ignoreImports` (string[])
- **Purpose**: Global patterns for **import paths** to ignore across all rules
- **What it does**: Skips validation of specific import statements that match the patterns
- **Target**: The **imported path** (what you're importing FROM)
- **Format**: Array of glob patterns
- **Example**: `["**/*.stories.*", "**/testing/**"]`

#### `ignoreFiles` (string[])
- **Purpose**: Global patterns for **file paths** to ignore across all rules  
- **What it does**: Skips validation entirely for files that match the patterns
- **Target**: The **current file** (where the import statement is located)
- **Format**: Array of glob patterns
- **Example**: `["**/config/**", "**/*.test.*"]`

### **Detailed Explanation of Ignore Behavior**

#### `ignoreImports` - Import Path Matching
When an import statement is found, the plugin checks if the **import path** matches any `ignoreImports` pattern. If it matches, that specific import is ignored.

```javascript
// With ignoreImports: ["**/testing/**", "**/config.*"]

// ✅ These imports will be IGNORED (no validation)
import { mockUser } from '@/entities/user/testing/mocks';  // matches **/testing/**
import { API_URL } from '@/shared/config.ts';             // matches **/config.*

// ❌ These imports will be VALIDATED (don't match patterns)  
import { UserType } from '@/entities/user/model/User';     // doesn't match any pattern
import { Button } from '@/shared/ui/Button';               // doesn't match any pattern
```

#### `ignoreFiles` - File Path Matching  
When processing a file, the plugin checks if the **current file path** matches any `ignoreFiles` pattern. If it matches, the entire file is skipped (no imports in that file are validated).

```javascript
// With ignoreFiles: ["**/*.test.*", "**/storybook/**"]

// ✅ These FILES will be completely IGNORED (no validation for any imports)
// File: src/entities/user/model/User.test.ts    - matches **/*.test.*
// File: src/shared/storybook/decorators/Theme.tsx      - matches **/storybook/**

// ❌ These FILES will be VALIDATED (don't match patterns)
// File: src/entities/user/ui/UserCard.tsx       - doesn't match any pattern  
// File: src/shared/ui/Button.stories.ts         - doesn't match any pattern
// File: src/shared/ui/Button.tsx                - doesn't match any pattern
```

### **Practical Example: When to Use Each**

#### Scenario: You want to ignore testing-related imports and skip validation for test files

```json
{
  "settings": {
    "feature-sliced-design-imports/ignoreImports": [
      "**/testing/**",     // Ignore imports from testing folders
      "**/*.mock.*"        // Ignore imports from mock files  
    ],
    "feature-sliced-design-imports/ignoreFiles": [
      "**/*.test.*",       // Skip validation for all test files
      "**/*.spec.*"        // Skip validation for all spec files
    ]
  }
}
```

**Result:**
```javascript
// File: src/components/Button.tsx (VALIDATED - not a test file)
import { mockUser } from '@/entities/user/testing/mocks';  // ✅ IGNORED (ignoreImports)
import { UserType } from '@/entities/user/model/User';     // ❌ VALIDATED (no pattern match)

// File: src/components/Button.test.tsx (COMPLETELY SKIPPED - ignoreFiles)  
import { UserType } from '@/entities/user/model/User';     // ✅ IGNORED (entire file skipped)
import { mockUser } from '@/entities/user/testing/mocks';  // ✅ IGNORED (entire file skipped)
import { HomePage } from '@/pages/home';                   // ✅ IGNORED (entire file skipped)
```

#### Key Difference Summary:
- **`ignoreImports`**: Selective - ignores specific imports while still validating the file
- **`ignoreFiles`**: Complete - ignores everything in matching files (more performant for test files)

---

## **Rules**

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "feature-sliced-design-imports/layer-imports": "error",
        "feature-sliced-design-imports/public-api-imports": "error",
        "feature-sliced-design-imports/relative-imports": "error",
    }
}
```

### 1. **`layer-imports`**

### **Purpose**
This rule enforces strict import order between defined architectural layers (e.g., `app`, `shared`, `features`, `entities`, etc.) in a **feature-sliced design architecture**. It ensures that higher-level layers only import from allowed lower-level layers to maintain a clear dependency hierarchy. The `proccess` layer isn't supported.

### **Key Features**
- **Allowed Layers**: Each layer has a defined set of layers it can import from, based on the plugin configuration.
- **Cross-Entity Imports**: Imports between entities must use the `@x` folder convention to encapsulate shared logic or functionality.
- **Alias Support**: Handles imports with aliases defined in the global configuration.
- **Ignored Patterns**: Specific imports can be ignored based on patterns provided in the configuration.

### **Examples**
- ✅ **Valid**: 
  ```javascript
  // @/entities/user/ui/UserForm
  import { Button } from '@/shared/ui/Button'; // shared -> entities
  // @/entities/message/ui/MessageCard
  import { UserType } from '@/entities/user/@x/message'; // Cross-entity via @x folder
  ```
- ❌ **Invalid**: 
  ```javascript
  // @/entities/user/ui/UserForm
  import { SomeType } from '@/features/auth-user'; // features -> entities
  //  @/entities/message/ui/MessageCard
  import { UserType } from '@/entities/user'; // Cross-entity without @x folder
  ```

### **Configuration Options**

#### Local Rule Options
- **`ignoreImportsPattern`** (string[]): Import patterns to ignore for this rule only
- **`ignoreFilesPattern`** (string[]): File patterns to ignore for this rule only

#### Configuration Examples
```json
{
    // Basic configuration
    "feature-sliced-design-imports/layer-imports": "error",
    
    // With local ignore patterns
    "feature-sliced-design-imports/layer-imports": ["error", {
        "ignoreImportsPattern": ["**/constants/**", "**/*.config.*"],
        "ignoreFilesPattern": ["**/test-utils/**", "**/*.stories.*"]
    }]
}
```

#### Combined Global + Local Patterns
```json
{
    "settings": {
        "feature-sliced-design-imports/ignoreImports": ["**/testing/**"],
        "feature-sliced-design-imports/ignoreFiles": ["**/*.test.*"]
    },
    "rules": {
        "feature-sliced-design-imports/layer-imports": ["error", {
            "ignoreImportsPattern": ["**/config/**"], // Additional local ignores
            "ignoreFilesPattern": ["**/stories/**"]    // Additional local ignores
        }]
    }
}
```

### 2. **`relative-imports`**

### **Purpose**
This rule enforces that imports within the same entity and layer use **relative paths**, while preventing relative imports that cross architectural boundaries (cross-layer or cross-slice violations).

### **Key Features**
- **Relative Path Enforcement**: Ensures imports within the same layer and slice use relative paths
- **Cross-Boundary Detection**: Prevents relative imports that cross layer or slice boundaries
- **Layer Awareness**: Supports custom layer names defined in configuration
- **Enhanced Validation**: Distinguishes between different types of violations with specific error messages

### **Error Types**
1. **`shouldBeRelativePath`**: Absolute import should be relative (same layer/slice)
2. **`crossSliceRelativeImport`**: Relative import crosses layer or slice boundaries

### **Examples**
- ✅ **Valid**: 
  ```javascript
  // @/entities/user/ui/UserCard
  import { UserType } from '../model/UserType'; // Relative import within same slice
  
  // @/shared/ui/Button  
  import { theme } from '../../config/theme'; // Relative import within shared layer
  
  // @/entities/user/ui/UserCard
  import { ArticleType } from '@/entities/article/@x/user'; // Absolute import across slices
  ```
- ❌ **Invalid**: 
  ```javascript
  // @/entities/user/ui/UserCard
  import { UserType } from '@/entities/user/model/UserType'; // Should be relative (same slice)
  
  // @/entities/user/ui/UserCard  
  import { ArticleType } from '../../article'; // Cross-slice relative import

  // @/entities/user/ui/UserCard
  import { ArticleType } from '../../../entities/article'; // Cross-slice relative import
  
  // @/shared/ui/Button
  import { UserType } from '../../entities/user/model/User'; // Cross-layer relative import
  ```

### **Configuration Options**

#### Local Rule Options
- **`ignoreImportsPattern`** (string[]): Import patterns to ignore for this rule only
- **`ignoreFilesPattern`** (string[]): File patterns to ignore for this rule only

#### Configuration Examples
```json
{
    // Basic configuration
    "feature-sliced-design-imports/relative-imports": "error",
    
    // With local ignore patterns
    "feature-sliced-design-imports/relative-imports": ["error", {
        "ignoreImportsPattern": ["**/constants/**", "**/*.enum.*"],
        "ignoreFilesPattern": ["**/index.*", "**/*.stories.*"]
    }]
}
```

### 3. **`public-api-imports`**

### **Purpose**
This rule enforces that imports from other layers or entities should only access the **public API** of those modules. For test files, it allows importing from a dedicated **public testing API**.

### **Key Features**
- **Public API Enforcement**: Ensures that imports from other entities or layers only access public APIs (`index.ts` or equivalent).
- **Testing API**: Allows test files to access public testing APIs via `testing.{ts,js}` point, ensuring test isolation.
- **Pattern-Based Validation**: Uses configurable patterns to identify test files and validate their imports.
- **Cross-Entity Encapsulation**: Validates that cross-entity imports use the `@x` folder when necessary.

### **Examples**
- ✅ **Valid**: 
  ```javascript
  import { Button } from '@/entities/user'; // Importing from public API
  // myFile.test.ts or any file -> "should be allowed in configuration"
  import { mockUser } from '@/entities/user/testing'; // Importing from testing public API in an allowed test file
  ```
- ❌ **Invalid**: 
  ```javascript
  import { UserType } from '@/entities/user/model/UserType'; // Importing from private module
  // @/pages/home/ui/Page
  import { mockUser } from '@/entities/user/testing'; // Testing API imported in a production file
  ```

### **Configuration Options**

#### Local Rule Options
- **`testFilePatterns`** (string[]): File patterns that are ALLOWED to import from testing APIs (`/testing` folders)
- **`ignoreImportsPattern`** (string[]): Import patterns to ignore for this rule only  
- **`ignoreFilesPattern`** (string[]): File patterns to ignore for this rule only

### **Testing API Convention**

#### Purpose
FSD architecture supports special `/testing` folders (e.g., `entities/user/testing`, `widgets/header/testing`) that contain test utilities, mocks, and helpers. The `testFilePatterns` option ensures these testing APIs are only used in appropriate test files, not in production code.

#### How it Works
- **Testing API paths**: Any import from paths containing `/testing` (like `@/entities/user/testing`)
- **File whitelist**: Only files matching `testFilePatterns` can import from testing APIs
- **Production safety**: Prevents accidentally importing test code into production bundles

#### Configuration Examples
```json
{
    // No testing API imports allowed (strict mode)
    "feature-sliced-design-imports/public-api-imports": "error",
    
    // Allow testing API imports only in test files
    "feature-sliced-design-imports/public-api-imports": ["error", {
        "testFilePatterns": [
            "**/*.test.*",      // Button.test.ts, utils.test.js
            "**/*.spec.*",      // Button.spec.ts, api.spec.js  
            "**/tests/**",      // Any file in tests/ folders
        ]
    }]
}
```

#### Testing API Usage Examples
```javascript
// ✅ ALLOWED - Test files can import from /testing
// File: Button.test.tsx (matches **/*.test.*)
import { mockUser } from '@/entities/user/testing'; 
import { createMockStore } from '@/shared/testing';

// File: user.spec.ts (matches **/*.spec.*)
import { userTestData } from '@/entities/user/testing';

// ❌ FORBIDDEN - Production files cannot import from /testing  
// File: HomePage.tsx (doesn't match testFilePatterns)
import { mockUser } from '@/entities/user/testing'; // Error!

// File: Button.stories.tsx (doesn't match testFilePatterns)  
import { mockUser } from '@/entities/user/testing'; // Error!
```

#### Common Patterns
```json
// For Jest projects
"testFilePatterns": ["**/*.test.*", "**/__tests__/**"]

// For Vitest projects  
"testFilePatterns": ["**/*.test.*", "**/*.spec.*"]

// Include Storybook if you use testing utilities there
"testFilePatterns": ["**/*.test.*", "**/*.stories.*"]
```

---

## **Complete Configuration Example**

Here's a comprehensive example showing all available configuration options:

```json
{
  "plugins": ["feature-sliced-design-imports"],
  "settings": {
    "feature-sliced-design-imports/alias": "@",
    "feature-sliced-design-imports/layers": {
      "app": "application",
      "pages": "routes",
      "widgets": "components", 
      "features": "modules",
      "entities": "domain",
      "shared": "common"
    },
    "feature-sliced-design-imports/ignoreImports": [
      "**/testing/**",
      "**/*.test.*",
      "**/*.stories.*",
      "**/constants/**"
    ],
    "feature-sliced-design-imports/ignoreFiles": [
      "**/config/**",
      "**/*.config.*",
      "**/tests/**",
      "**/storybook/**"
    ]
  },
  "rules": {
    "feature-sliced-design-imports/layer-imports": [
      "error",
      {
        "ignoreImportsPattern": ["**/store/**", "**/providers/**"],
        "ignoreFilesPattern": ["**/test-utils/**"]
      }
    ],
    "feature-sliced-design-imports/public-api-imports": [
      "error", 
      {
        "testFilePatterns": ["**/*.test.*", "**/*.spec.*", "**/tests/**"],
        "ignoreImportsPattern": ["**/mocks/**"],
        "ignoreFilesPattern": ["**/*.stories.*"]
      }
    ],
    "feature-sliced-design-imports/relative-imports": [
      "error",
      {
        "ignoreImportsPattern": ["**/types/**", "**/*.enum.*"],
        "ignoreFilesPattern": ["**/index.*"]
      }
    ]
  }
}
```
