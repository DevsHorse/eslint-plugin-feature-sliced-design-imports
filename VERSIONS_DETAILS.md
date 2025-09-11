# Versions

# 1.1.0

### 🚀 New Features
- **Cross-Layer and Cross-Slice Relative Import Detection**: Prevents relative imports that cross architectural boundaries
- **Global Ignore Patterns**: Support for project-wide ignore patterns via settings
- **Local Ignore Patterns**: Rule-specific ignore patterns for fine-grained control
- **File-based Ignore Patterns**: New **`ignoreFilesPattern`** option for all rules
- **Custom Layer Names**: Full support for custom FSD layer naming

### 🔧 Enhancements
- **Better Error Messages**: More specific error messages for different violation types
- **Comprehensive Testing**: Extensive test coverage for custom layer configurations
- **Enhanced Documentation**: Detailed inline comments and improved examples

### 🐛 Bug Fixes
- Fixed custom layer name resolution in cross-slice validation
- Improved path resolution for shared and app layers
- Enhanced ignore pattern matching accuracy 


## **Migration from 1.0.x to 1.1.0**

### Breaking Changes
- None! Version 1.1.0 is fully backward compatible.

### New Features You Can Use
1. **Add global ignore patterns** in settings for project-wide exclusions
2. **Use `ignoreFilesPattern`** in addition to **`ignoreImportsPattern`** for more granular control  
3. **Leverage enhanced cross-slice detection** - the plugin now catches more boundary violations
4. **Take advantage of better error messages** to understand exactly what needs to be fixed