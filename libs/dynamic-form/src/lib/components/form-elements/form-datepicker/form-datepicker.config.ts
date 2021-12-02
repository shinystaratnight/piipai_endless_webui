export const getTimePickerConfig = config => {
  const dropdownRight = config.rightPosition === false ? false : true;

  return {
    mode: 'timebox',
    overrideTimeFormat: 24,
    overrideTimeOutput: '%H:%M',

    useClearButton: true,
    useCancelButton: true,
    useFocus: true,
    useHeader: false,
    calUsePickers: true,
    calHighToday: true,
    bootstrapDropdownRight: dropdownRight
  };
};
