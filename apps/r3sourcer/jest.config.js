module.exports = {
  name: 'r3sourcer',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/r3sourcer',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
