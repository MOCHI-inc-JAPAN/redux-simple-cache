module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],

  moduleNameMapper: {
    // src ディレクトリをエイリアスのルートに設定
    '^~/(.+)': '<rootDir>/src/$1',
    // test 時に CSS ファイルを読み込まないようにする設定
    '\\.css$': '<rootDir>/node_modules/jest-css-modules',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '.*': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    // test 時に TypeScript の設定を一部変更して実行する設定
    'ts-jest': {
      tsConfig: '<rootDir>/jest/tsconfig.json',
    },
  },
}
