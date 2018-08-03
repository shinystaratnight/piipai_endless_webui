const form = [
  {
    key: 'extend',
    type: 'extend'
  },
  // {
  //   key: 'autofill',
  //   read_only: false,
  //   templateOptions: { required: false, label: 'Autofill', type: 'checkbox' },
  //   type: 'checkbox'
  // },
  // {
  //   endpoint: '/ecore/api/v2/hr/joboffers/',
  //   collapsed: false,
  //   metadata_query: { editable_type: 'extend' },
  //   templateOptions: { label: 'Candidates', type: 'list', text: 'Candidates' },
  //   showIf: [{ autofill: true }],
  //   type: 'list',
  //   query: { shift_date: '{latest_date}' }
  // }
];

export const metadata = {
  form
};
