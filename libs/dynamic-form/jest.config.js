module.exports = {
  name: 'dynamic-form',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/dynamic-form',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
