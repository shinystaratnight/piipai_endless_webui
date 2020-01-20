export const getDatePickerConfig = (config, isBirthday) => {
  const { customDatepicker } = config;
  const { clear, change } = config.templateOptions;

  return {
    mode: 'calbox',
    dateFormat: customDatepicker
      ? customDatepicker.datepickerFormat
      : '%d/%m/%Y',
    overrideDateFormat: customDatepicker
      ? customDatepicker.datepickerFormat
      : '%d/%m/%Y',
    useClearButton: clear === false ? false : true,
    useFocus: true,
    useHeader: false,
    calHighToday: true,
    bootstrapDropdownRight: false,
    calUsePickers: change === false ? false : true,
    calNoHeader: change === false,
    calOnlyMonth: change === false,
    useCancelButton: true,
    overrideCalStartDay: 1,
    calYearPickRelative: false,
    calYearPickMax: isBirthday ? 0 : 6,
    calYearPickMin: -100,
    maxDays: isBirthday && -1
  };
};

export const getTimePickerConfig = config => {
  const dropdownRight = config.rightPosition === false ? false : true;

  return {
    mode: 'timebox',
    overrideTimeFormat: 12,
    overrideTimeOutput: '%I:%M %p',

    useClearButton: true,
    useCancelButton: true,
    useFocus: true,
    useHeader: false,
    calUsePickers: true,
    calHighToday: true,
    bootstrapDropdownRight: dropdownRight
  };
};
