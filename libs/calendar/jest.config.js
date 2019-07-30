module.exports = {
  name: 'calendar',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/calendar',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
