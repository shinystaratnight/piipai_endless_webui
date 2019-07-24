module.exports = {
  name: 'metadata',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/metadata',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
