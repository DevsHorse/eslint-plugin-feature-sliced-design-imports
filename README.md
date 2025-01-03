# eslint-plugin-feature-sliced-design-imports

Custom ESLint plugin designed to enforce strict import rules in projects following the [Feature-Sliced Design](https://feature-sliced.design/) architecture. 

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

Add custom layers or alias if needed:

```json
{
    "settings": [
        "feature-sliced-design-imports/layers": {
            "app": "app-layer",
            "pages": "pages-layer",
            "entities": "custom-entities-layer-name",
        },
        "feature-sliced-design-imports/alias": "@"
    ]
}
```

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

---
### 1. **`layer-imports`**

### **Purpose**
This rule enforces strict import order between defined architectural layers (e.g., `app`, `shared`, `features`, `entities`, etc.) in a **feature-sliced design architecture**. It ensures that higher-level layers only import from allowed lower-level layers to maintain a clear dependency hierarchy.

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

### **Configuration example**
```json
{
    "feature-sliced-design-imports/layer-imports": ["error", {
        "ignoreImportsPattern": ["**/Store", "**/*.test.ts"]
    }],
}
```
---

### 2. **`relative-imports`**

### **Purpose**
This rule enforces that imports within the same entity and layer use **relative paths**. This helps improve modularity and reduce coupling between slices of the same layer.

### **Key Features**
- **Relative Path Check**: Ensures that imports within the same layer and entity are always relative.
- **Layer Awareness**: The rule understands custom layers defined in the configuration and applies relative path checks accordingly.
- **Cross-Slice Restriction**: Prevents absolute imports within the same entity.

### **Examples**
- ✅ **Valid**: 
  ```javascript
  // @/entities/user/ui/UserCard
  import { UserType } from '../model/UserType'; // Relative import within the same entity
  ```
- ❌ **Invalid**: 
  ```javascript
  // @/entities/user/ui/UserCard
  import { UserType } from '@/entities/user/model/UserType'; // Absolute import within the same entity
  import { UserType } from '@/entities/user'; // Absolute import from public api within the same entity
  ```

### **Configuration example**
```json
{
    "feature-sliced-design-imports/relative-imports": "error",
}
```
---

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

### **Configuration example**
```json
{
    "feature-sliced-design-imports/public-api-imports": ["error", {
        "testFilePatterns": ["**/*.test.ts", "**/*-test.{ts,js}"]
    }],
}
```