module.exports = {
  name: 'manager',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/manager',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
