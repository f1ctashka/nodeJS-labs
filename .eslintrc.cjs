module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['@typescript-eslint', 'sonarjs', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {},
};
