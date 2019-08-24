module.exports = {
  "extends": [
      "standard",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
      "@typescript-eslint"
  ],
  "parserOptions": {
      "sourceType": "module",
      "project": "./tsconfig.json"
  },
  "rules": {
      "lines-between-class-members": ["error", "always", {
          "exceptAfterSingleLine": true
      }],
      "comma-dangle": ["error", "only-multiline"],
      "@typescript-eslint/no-unused-vars": "off", // duplicate tsconfig
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "no-useless-constructor": "off", // duplicate "@typescript-eslint/no-useless-constructor"
      "@typescript-eslint/member-delimiter-style": ["error", {
          "multiline": {
              "delimiter": "comma",
              "requireLast": true
          },
          "singleline": {
              "delimiter": "comma",
              "requireLast": false
          },
      }],
      "@typescript-eslint/explicit-member-accessibility": ["error", {
          "accessibility": 'no-public',
          "overrides": {
            "parameterProperties": 'off',
          }
      }],
      // "@typescript-eslint/explicit-function-return-type": "off",
  }
}