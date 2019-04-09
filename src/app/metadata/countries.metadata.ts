const list = {
  list: {
    list: 'country',
    label: 'Country',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Country'
      }
    ],
    pagination_label: 'Country',
    search_enabled: true,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Country',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contacts',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'candidate_contacts',
    many: true
  },
  {
    key: 'name_ascii',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Name ascii',
      max: 200,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'slug',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Slug',
      type: 'text'
    },
    read_only: true
  },
  {
    key: 'geoname_id',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Geoname id',
      max: 2147483647,
      type: 'number',
      min: -2147483648
    },
    read_only: false
  },
  {
    key: 'alternate_names',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Alternate names',
      type: 'textarea'
    },
    read_only: false
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Name',
      max: 200,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'code2',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Code2',
      max: 2,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'code3',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Code3',
      max: 3,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'continent',
    type: 'select',
    templateOptions: {
      required: true,
      label: 'Continent',
      type: 'select',
      options: [
        {
          value: 'OC',
          label: 'Oceania'
        },
        {
          value: 'EU',
          label: 'Europe'
        },
        {
          value: 'AF',
          label: 'Africa'
        },
        {
          value: 'NA',
          label: 'North America'
        },
        {
          value: 'AN',
          label: 'Antarctica'
        },
        {
          value: 'SA',
          label: 'South America'
        },
        {
          value: 'AS',
          label: 'Asia'
        }
      ]
    },
    read_only: false
  },
  {
    key: 'tld',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Tld',
      max: 5,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'phone',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Phone',
      max: 20,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'currency',
    default: 'USD',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Currency',
      type: 'select',
      options: [
        {
          value: 'AFN',
          label: 'Afghani'
        },
        {
          value: 'DZD',
          label: 'Algerian Dinar'
        },
        {
          value: 'ARS',
          label: 'Argentine Peso'
        },
        {
          value: 'AMD',
          label: 'Armenian Dram'
        },
        {
          value: 'AWG',
          label: 'Aruban Guilder'
        },
        {
          value: 'AUD',
          label: 'Australian Dollar'
        },
        {
          value: 'AZN',
          label: 'Azerbaijanian Manat'
        },
        {
          value: 'BSD',
          label: 'Bahamian Dollar'
        },
        {
          value: 'BHD',
          label: 'Bahraini Dinar'
        },
        {
          value: 'THB',
          label: 'Baht'
        },
        {
          value: 'BBD',
          label: 'Barbados Dollar'
        },
        {
          value: 'BYR',
          label: 'Belarussian Ruble'
        },
        {
          value: 'BZD',
          label: 'Belize Dollar'
        },
        {
          value: 'BMD',
          label: 'Bermudian Dollar (customarily known as Bermuda Dollar)'
        },
        {
          value: 'BTN',
          label: 'Bhutanese ngultrum'
        },
        {
          value: 'VEF',
          label: 'Bolivar Fuerte'
        },
        {
          value: 'XBA',
          label: 'Bond Markets Units European Composite Unit (EURCO)'
        },
        {
          value: 'BRL',
          label: 'Brazilian Real'
        },
        {
          value: 'BND',
          label: 'Brunei Dollar'
        },
        {
          value: 'BGN',
          label: 'Bulgarian Lev'
        },
        {
          value: 'BIF',
          label: 'Burundi Franc'
        },
        {
          value: 'XOF',
          label: 'CFA Franc BCEAO'
        },
        {
          value: 'XAF',
          label: 'CFA franc BEAC'
        },
        {
          value: 'XPF',
          label: 'CFP Franc'
        },
        {
          value: 'CAD',
          label: 'Canadian Dollar'
        },
        {
          value: 'CVE',
          label: 'Cape Verde Escudo'
        },
        {
          value: 'KYD',
          label: 'Cayman Islands Dollar'
        },
        {
          value: 'CLP',
          label: 'Chilean peso'
        },
        {
          value: 'XTS',
          label: 'Codes specifically reserved for testing purposes'
        },
        {
          value: 'COP',
          label: 'Colombian peso'
        },
        {
          value: 'KMF',
          label: 'Comoro Franc'
        },
        {
          value: 'CDF',
          label: 'Congolese franc'
        },
        {
          value: 'BAM',
          label: 'Convertible Marks'
        },
        {
          value: 'NIO',
          label: 'Cordoba Oro'
        },
        {
          value: 'CRC',
          label: 'Costa Rican Colon'
        },
        {
          value: 'HRK',
          label: 'Croatian Kuna'
        },
        {
          value: 'CUP',
          label: 'Cuban Peso'
        },
        {
          value: 'CUC',
          label: 'Cuban convertible peso'
        },
        {
          value: 'CZK',
          label: 'Czech Koruna'
        },
        {
          value: 'GMD',
          label: 'Dalasi'
        },
        {
          value: 'DKK',
          label: 'Danish Krone'
        },
        {
          value: 'MKD',
          label: 'Denar'
        },
        {
          value: 'DJF',
          label: 'Djibouti Franc'
        },
        {
          value: 'STD',
          label: 'Dobra'
        },
        {
          value: 'DOP',
          label: 'Dominican Peso'
        },
        {
          value: 'VND',
          label: 'Dong'
        },
        {
          value: 'XCD',
          label: 'East Caribbean Dollar'
        },
        {
          value: 'EGP',
          label: 'Egyptian Pound'
        },
        {
          value: 'ETB',
          label: 'Ethiopian Birr'
        },
        {
          value: 'EUR',
          label: 'Euro'
        },
        {
          value: 'XBB',
          label: 'European Monetary Unit (E.M.U.-6)'
        },
        {
          value: 'XBD',
          label: 'European Unit of Account 17(E.U.A.-17)'
        },
        {
          value: 'XBC',
          label: 'European Unit of Account 9(E.U.A.-9)'
        },
        {
          value: 'FKP',
          label: 'Falkland Islands Pound'
        },
        {
          value: 'FJD',
          label: 'Fiji Dollar'
        },
        {
          value: 'HUF',
          label: 'Forint'
        },
        {
          value: 'GHS',
          label: 'Ghana Cedi'
        },
        {
          value: 'GIP',
          label: 'Gibraltar Pound'
        },
        {
          value: 'XAU',
          label: 'Gold'
        },
        {
          value: 'XFO',
          label: 'Gold-Franc'
        },
        {
          value: 'PYG',
          label: 'Guarani'
        },
        {
          value: 'GNF',
          label: 'Guinea Franc'
        },
        {
          value: 'GYD',
          label: 'Guyana Dollar'
        },
        {
          value: 'HTG',
          label: 'Haitian gourde'
        },
        {
          value: 'HKD',
          label: 'Hong Kong Dollar'
        },
        {
          value: 'UAH',
          label: 'Hryvnia'
        },
        {
          value: 'ISK',
          label: 'Iceland Krona'
        },
        {
          value: 'INR',
          label: 'Indian Rupee'
        },
        {
          value: 'IRR',
          label: 'Iranian Rial'
        },
        {
          value: 'IQD',
          label: 'Iraqi Dinar'
        },
        {
          value: 'IMP',
          label: 'Isle of Man pount'
        },
        {
          value: 'JMD',
          label: 'Jamaican Dollar'
        },
        {
          value: 'JOD',
          label: 'Jordanian Dinar'
        },
        {
          value: 'KES',
          label: 'Kenyan Shilling'
        },
        {
          value: 'PGK',
          label: 'Kina'
        },
        {
          value: 'LAK',
          label: 'Kip'
        },
        {
          value: 'KWD',
          label: 'Kuwaiti Dinar'
        },
        {
          value: 'AOA',
          label: 'Kwanza'
        },
        {
          value: 'MMK',
          label: 'Kyat'
        },
        {
          value: 'GEL',
          label: 'Lari'
        },
        {
          value: 'LVL',
          label: 'Latvian Lats'
        },
        {
          value: 'LBP',
          label: 'Lebanese Pound'
        },
        {
          value: 'ALL',
          label: 'Lek'
        },
        {
          value: 'HNL',
          label: 'Lempira'
        },
        {
          value: 'SLL',
          label: 'Leone'
        },
        {
          value: 'LSL',
          label: 'Lesotho loti'
        },
        {
          value: 'LRD',
          label: 'Liberian Dollar'
        },
        {
          value: 'LYD',
          label: 'Libyan Dinar'
        },
        {
          value: 'SZL',
          label: 'Lilangeni'
        },
        {
          value: 'LTL',
          label: 'Lithuanian Litas'
        },
        {
          value: 'MGA',
          label: 'Malagasy Ariary'
        },
        {
          value: 'MWK',
          label: 'Malawian Kwacha'
        },
        {
          value: 'MYR',
          label: 'Malaysian Ringgit'
        },
        {
          value: 'TMM',
          label: 'Manat'
        },
        {
          value: 'MUR',
          label: 'Mauritius Rupee'
        },
        {
          value: 'MZN',
          label: 'Metical'
        },
        {
          value: 'MXN',
          label: 'Mexican peso'
        },
        {
          value: 'MDL',
          label: 'Moldovan Leu'
        },
        {
          value: 'MAD',
          label: 'Moroccan Dirham'
        },
        {
          value: 'NGN',
          label: 'Naira'
        },
        {
          value: 'ERN',
          label: 'Nakfa'
        },
        {
          value: 'NAD',
          label: 'Namibian Dollar'
        },
        {
          value: 'NPR',
          label: 'Nepalese Rupee'
        },
        {
          value: 'ANG',
          label: 'Netherlands Antillian Guilder'
        },
        {
          value: 'ILS',
          label: 'New Israeli Sheqel'
        },
        {
          value: 'RON',
          label: 'New Leu'
        },
        {
          value: 'TWD',
          label: 'New Taiwan Dollar'
        },
        {
          value: 'NZD',
          label: 'New Zealand Dollar'
        },
        {
          value: 'KPW',
          label: 'North Korean Won'
        },
        {
          value: 'NOK',
          label: 'Norwegian Krone'
        },
        {
          value: 'PEN',
          label: 'Nuevo Sol'
        },
        {
          value: 'MRO',
          label: 'Ouguiya'
        },
        {
          value: 'TOP',
          label: 'Paanga'
        },
        {
          value: 'PKR',
          label: 'Pakistan Rupee'
        },
        {
          value: 'XPD',
          label: 'Palladium'
        },
        {
          value: 'MOP',
          label: 'Pataca'
        },
        {
          value: 'PHP',
          label: 'Philippine Peso'
        },
        {
          value: 'XPT',
          label: 'Platinum'
        },
        {
          value: 'GBP',
          label: 'Pound Sterling'
        },
        {
          value: 'BWP',
          label: 'Pula'
        },
        {
          value: 'QAR',
          label: 'Qatari Rial'
        },
        {
          value: 'GTQ',
          label: 'Quetzal'
        },
        {
          value: 'ZAR',
          label: 'Rand'
        },
        {
          value: 'OMR',
          label: 'Rial Omani'
        },
        {
          value: 'KHR',
          label: 'Riel'
        },
        {
          value: 'MVR',
          label: 'Rufiyaa'
        },
        {
          value: 'IDR',
          label: 'Rupiah'
        },
        {
          value: 'RUB',
          label: 'Russian Ruble'
        },
        {
          value: 'RWF',
          label: 'Rwanda Franc'
        },
        {
          value: 'XDR',
          label: 'SDR'
        },
        {
          value: 'SHP',
          label: 'Saint Helena Pound'
        },
        {
          value: 'SAR',
          label: 'Saudi Riyal'
        },
        {
          value: 'RSD',
          label: 'Serbian Dinar'
        },
        {
          value: 'SCR',
          label: 'Seychelles Rupee'
        },
        {
          value: 'XAG',
          label: 'Silver'
        },
        {
          value: 'SGD',
          label: 'Singapore Dollar'
        },
        {
          value: 'SBD',
          label: 'Solomon Islands Dollar'
        },
        {
          value: 'KGS',
          label: 'Som'
        },
        {
          value: 'SOS',
          label: 'Somali Shilling'
        },
        {
          value: 'TJS',
          label: 'Somoni'
        },
        {
          value: 'LKR',
          label: 'Sri Lanka Rupee'
        },
        {
          value: 'SDG',
          label: 'Sudanese Pound'
        },
        {
          value: 'SRD',
          label: 'Surinam Dollar'
        },
        {
          value: 'SEK',
          label: 'Swedish Krona'
        },
        {
          value: 'CHF',
          label: 'Swiss Franc'
        },
        {
          value: 'SYP',
          label: 'Syrian Pound'
        },
        {
          value: 'BDT',
          label: 'Taka'
        },
        {
          value: 'WST',
          label: 'Tala'
        },
        {
          value: 'TZS',
          label: 'Tanzanian Shilling'
        },
        {
          value: 'KZT',
          label: 'Tenge'
        },
        {
          value: 'TTD',
          label: 'Trinidad and Tobago Dollar'
        },
        {
          value: 'MNT',
          label: 'Tugrik'
        },
        {
          value: 'TND',
          label: 'Tunisian Dinar'
        },
        {
          value: 'TRY',
          label: 'Turkish Lira'
        },
        {
          value: 'TVD',
          label: 'Tuvalu dollar'
        },
        {
          value: 'AED',
          label: 'UAE Dirham'
        },
        {
          value: 'XFU',
          label: 'UIC-Franc'
        },
        {
          value: 'USD',
          label: 'US Dollar'
        },
        {
          value: 'UGX',
          label: 'Uganda Shilling'
        },
        {
          value: 'UYU',
          label: 'Uruguayan peso'
        },
        {
          value: 'UZS',
          label: 'Uzbekistan Sum'
        },
        {
          value: 'VUV',
          label: 'Vatu'
        },
        {
          value: 'KRW',
          label: 'Won'
        },
        {
          value: 'YER',
          label: 'Yemeni Rial'
        },
        {
          value: 'JPY',
          label: 'Yen'
        },
        {
          value: 'CNY',
          label: 'Yuan Renminbi'
        },
        {
          value: 'ZMK',
          label: 'Zambian Kwacha'
        },
        {
          value: 'ZMW',
          label: 'Zambian Kwacha'
        },
        {
          value: 'ZWD',
          label: 'Zimbabwe Dollar A/06'
        },
        {
          value: 'ZWN',
          label: 'Zimbabwe dollar A/08'
        },
        {
          value: 'ZWL',
          label: 'Zimbabwe dollar A/09'
        },
        {
          value: 'PLN',
          label: 'Zloty'
        }
      ]
    },
    read_only: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contacts',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'candidate_contacts',
    many: true
  },
  {
    key: 'name_ascii',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Name ascii',
      max: 200,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'slug',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Slug',
      type: 'text'
    },
    read_only: true
  },
  {
    key: 'geoname_id',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Geoname id',
      max: 2147483647,
      type: 'number',
      min: -2147483648
    },
    read_only: false
  },
  {
    key: 'alternate_names',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Alternate names',
      type: 'textarea'
    },
    read_only: false
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Name',
      max: 200,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'code2',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Code2',
      max: 2,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'code3',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Code3',
      max: 3,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'continent',
    type: 'select',
    templateOptions: {
      required: true,
      label: 'Continent',
      type: 'select',
      options: [
        {
          value: 'OC',
          label: 'Oceania'
        },
        {
          value: 'EU',
          label: 'Europe'
        },
        {
          value: 'AF',
          label: 'Africa'
        },
        {
          value: 'NA',
          label: 'North America'
        },
        {
          value: 'AN',
          label: 'Antarctica'
        },
        {
          value: 'SA',
          label: 'South America'
        },
        {
          value: 'AS',
          label: 'Asia'
        }
      ]
    },
    read_only: false
  },
  {
    key: 'tld',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Tld',
      max: 5,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'phone',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Phone',
      max: 20,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'currency',
    default: 'USD',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Currency',
      type: 'select',
      options: [
        {
          value: 'AFN',
          label: 'Afghani'
        },
        {
          value: 'DZD',
          label: 'Algerian Dinar'
        },
        {
          value: 'ARS',
          label: 'Argentine Peso'
        },
        {
          value: 'AMD',
          label: 'Armenian Dram'
        },
        {
          value: 'AWG',
          label: 'Aruban Guilder'
        },
        {
          value: 'AUD',
          label: 'Australian Dollar'
        },
        {
          value: 'AZN',
          label: 'Azerbaijanian Manat'
        },
        {
          value: 'BSD',
          label: 'Bahamian Dollar'
        },
        {
          value: 'BHD',
          label: 'Bahraini Dinar'
        },
        {
          value: 'THB',
          label: 'Baht'
        },
        {
          value: 'BBD',
          label: 'Barbados Dollar'
        },
        {
          value: 'BYR',
          label: 'Belarussian Ruble'
        },
        {
          value: 'BZD',
          label: 'Belize Dollar'
        },
        {
          value: 'BMD',
          label: 'Bermudian Dollar (customarily known as Bermuda Dollar)'
        },
        {
          value: 'BTN',
          label: 'Bhutanese ngultrum'
        },
        {
          value: 'VEF',
          label: 'Bolivar Fuerte'
        },
        {
          value: 'XBA',
          label: 'Bond Markets Units European Composite Unit (EURCO)'
        },
        {
          value: 'BRL',
          label: 'Brazilian Real'
        },
        {
          value: 'BND',
          label: 'Brunei Dollar'
        },
        {
          value: 'BGN',
          label: 'Bulgarian Lev'
        },
        {
          value: 'BIF',
          label: 'Burundi Franc'
        },
        {
          value: 'XOF',
          label: 'CFA Franc BCEAO'
        },
        {
          value: 'XAF',
          label: 'CFA franc BEAC'
        },
        {
          value: 'XPF',
          label: 'CFP Franc'
        },
        {
          value: 'CAD',
          label: 'Canadian Dollar'
        },
        {
          value: 'CVE',
          label: 'Cape Verde Escudo'
        },
        {
          value: 'KYD',
          label: 'Cayman Islands Dollar'
        },
        {
          value: 'CLP',
          label: 'Chilean peso'
        },
        {
          value: 'XTS',
          label: 'Codes specifically reserved for testing purposes'
        },
        {
          value: 'COP',
          label: 'Colombian peso'
        },
        {
          value: 'KMF',
          label: 'Comoro Franc'
        },
        {
          value: 'CDF',
          label: 'Congolese franc'
        },
        {
          value: 'BAM',
          label: 'Convertible Marks'
        },
        {
          value: 'NIO',
          label: 'Cordoba Oro'
        },
        {
          value: 'CRC',
          label: 'Costa Rican Colon'
        },
        {
          value: 'HRK',
          label: 'Croatian Kuna'
        },
        {
          value: 'CUP',
          label: 'Cuban Peso'
        },
        {
          value: 'CUC',
          label: 'Cuban convertible peso'
        },
        {
          value: 'CZK',
          label: 'Czech Koruna'
        },
        {
          value: 'GMD',
          label: 'Dalasi'
        },
        {
          value: 'DKK',
          label: 'Danish Krone'
        },
        {
          value: 'MKD',
          label: 'Denar'
        },
        {
          value: 'DJF',
          label: 'Djibouti Franc'
        },
        {
          value: 'STD',
          label: 'Dobra'
        },
        {
          value: 'DOP',
          label: 'Dominican Peso'
        },
        {
          value: 'VND',
          label: 'Dong'
        },
        {
          value: 'XCD',
          label: 'East Caribbean Dollar'
        },
        {
          value: 'EGP',
          label: 'Egyptian Pound'
        },
        {
          value: 'ETB',
          label: 'Ethiopian Birr'
        },
        {
          value: 'EUR',
          label: 'Euro'
        },
        {
          value: 'XBB',
          label: 'European Monetary Unit (E.M.U.-6)'
        },
        {
          value: 'XBD',
          label: 'European Unit of Account 17(E.U.A.-17)'
        },
        {
          value: 'XBC',
          label: 'European Unit of Account 9(E.U.A.-9)'
        },
        {
          value: 'FKP',
          label: 'Falkland Islands Pound'
        },
        {
          value: 'FJD',
          label: 'Fiji Dollar'
        },
        {
          value: 'HUF',
          label: 'Forint'
        },
        {
          value: 'GHS',
          label: 'Ghana Cedi'
        },
        {
          value: 'GIP',
          label: 'Gibraltar Pound'
        },
        {
          value: 'XAU',
          label: 'Gold'
        },
        {
          value: 'XFO',
          label: 'Gold-Franc'
        },
        {
          value: 'PYG',
          label: 'Guarani'
        },
        {
          value: 'GNF',
          label: 'Guinea Franc'
        },
        {
          value: 'GYD',
          label: 'Guyana Dollar'
        },
        {
          value: 'HTG',
          label: 'Haitian gourde'
        },
        {
          value: 'HKD',
          label: 'Hong Kong Dollar'
        },
        {
          value: 'UAH',
          label: 'Hryvnia'
        },
        {
          value: 'ISK',
          label: 'Iceland Krona'
        },
        {
          value: 'INR',
          label: 'Indian Rupee'
        },
        {
          value: 'IRR',
          label: 'Iranian Rial'
        },
        {
          value: 'IQD',
          label: 'Iraqi Dinar'
        },
        {
          value: 'IMP',
          label: 'Isle of Man pount'
        },
        {
          value: 'JMD',
          label: 'Jamaican Dollar'
        },
        {
          value: 'JOD',
          label: 'Jordanian Dinar'
        },
        {
          value: 'KES',
          label: 'Kenyan Shilling'
        },
        {
          value: 'PGK',
          label: 'Kina'
        },
        {
          value: 'LAK',
          label: 'Kip'
        },
        {
          value: 'KWD',
          label: 'Kuwaiti Dinar'
        },
        {
          value: 'AOA',
          label: 'Kwanza'
        },
        {
          value: 'MMK',
          label: 'Kyat'
        },
        {
          value: 'GEL',
          label: 'Lari'
        },
        {
          value: 'LVL',
          label: 'Latvian Lats'
        },
        {
          value: 'LBP',
          label: 'Lebanese Pound'
        },
        {
          value: 'ALL',
          label: 'Lek'
        },
        {
          value: 'HNL',
          label: 'Lempira'
        },
        {
          value: 'SLL',
          label: 'Leone'
        },
        {
          value: 'LSL',
          label: 'Lesotho loti'
        },
        {
          value: 'LRD',
          label: 'Liberian Dollar'
        },
        {
          value: 'LYD',
          label: 'Libyan Dinar'
        },
        {
          value: 'SZL',
          label: 'Lilangeni'
        },
        {
          value: 'LTL',
          label: 'Lithuanian Litas'
        },
        {
          value: 'MGA',
          label: 'Malagasy Ariary'
        },
        {
          value: 'MWK',
          label: 'Malawian Kwacha'
        },
        {
          value: 'MYR',
          label: 'Malaysian Ringgit'
        },
        {
          value: 'TMM',
          label: 'Manat'
        },
        {
          value: 'MUR',
          label: 'Mauritius Rupee'
        },
        {
          value: 'MZN',
          label: 'Metical'
        },
        {
          value: 'MXN',
          label: 'Mexican peso'
        },
        {
          value: 'MDL',
          label: 'Moldovan Leu'
        },
        {
          value: 'MAD',
          label: 'Moroccan Dirham'
        },
        {
          value: 'NGN',
          label: 'Naira'
        },
        {
          value: 'ERN',
          label: 'Nakfa'
        },
        {
          value: 'NAD',
          label: 'Namibian Dollar'
        },
        {
          value: 'NPR',
          label: 'Nepalese Rupee'
        },
        {
          value: 'ANG',
          label: 'Netherlands Antillian Guilder'
        },
        {
          value: 'ILS',
          label: 'New Israeli Sheqel'
        },
        {
          value: 'RON',
          label: 'New Leu'
        },
        {
          value: 'TWD',
          label: 'New Taiwan Dollar'
        },
        {
          value: 'NZD',
          label: 'New Zealand Dollar'
        },
        {
          value: 'KPW',
          label: 'North Korean Won'
        },
        {
          value: 'NOK',
          label: 'Norwegian Krone'
        },
        {
          value: 'PEN',
          label: 'Nuevo Sol'
        },
        {
          value: 'MRO',
          label: 'Ouguiya'
        },
        {
          value: 'TOP',
          label: 'Paanga'
        },
        {
          value: 'PKR',
          label: 'Pakistan Rupee'
        },
        {
          value: 'XPD',
          label: 'Palladium'
        },
        {
          value: 'MOP',
          label: 'Pataca'
        },
        {
          value: 'PHP',
          label: 'Philippine Peso'
        },
        {
          value: 'XPT',
          label: 'Platinum'
        },
        {
          value: 'GBP',
          label: 'Pound Sterling'
        },
        {
          value: 'BWP',
          label: 'Pula'
        },
        {
          value: 'QAR',
          label: 'Qatari Rial'
        },
        {
          value: 'GTQ',
          label: 'Quetzal'
        },
        {
          value: 'ZAR',
          label: 'Rand'
        },
        {
          value: 'OMR',
          label: 'Rial Omani'
        },
        {
          value: 'KHR',
          label: 'Riel'
        },
        {
          value: 'MVR',
          label: 'Rufiyaa'
        },
        {
          value: 'IDR',
          label: 'Rupiah'
        },
        {
          value: 'RUB',
          label: 'Russian Ruble'
        },
        {
          value: 'RWF',
          label: 'Rwanda Franc'
        },
        {
          value: 'XDR',
          label: 'SDR'
        },
        {
          value: 'SHP',
          label: 'Saint Helena Pound'
        },
        {
          value: 'SAR',
          label: 'Saudi Riyal'
        },
        {
          value: 'RSD',
          label: 'Serbian Dinar'
        },
        {
          value: 'SCR',
          label: 'Seychelles Rupee'
        },
        {
          value: 'XAG',
          label: 'Silver'
        },
        {
          value: 'SGD',
          label: 'Singapore Dollar'
        },
        {
          value: 'SBD',
          label: 'Solomon Islands Dollar'
        },
        {
          value: 'KGS',
          label: 'Som'
        },
        {
          value: 'SOS',
          label: 'Somali Shilling'
        },
        {
          value: 'TJS',
          label: 'Somoni'
        },
        {
          value: 'LKR',
          label: 'Sri Lanka Rupee'
        },
        {
          value: 'SDG',
          label: 'Sudanese Pound'
        },
        {
          value: 'SRD',
          label: 'Surinam Dollar'
        },
        {
          value: 'SEK',
          label: 'Swedish Krona'
        },
        {
          value: 'CHF',
          label: 'Swiss Franc'
        },
        {
          value: 'SYP',
          label: 'Syrian Pound'
        },
        {
          value: 'BDT',
          label: 'Taka'
        },
        {
          value: 'WST',
          label: 'Tala'
        },
        {
          value: 'TZS',
          label: 'Tanzanian Shilling'
        },
        {
          value: 'KZT',
          label: 'Tenge'
        },
        {
          value: 'TTD',
          label: 'Trinidad and Tobago Dollar'
        },
        {
          value: 'MNT',
          label: 'Tugrik'
        },
        {
          value: 'TND',
          label: 'Tunisian Dinar'
        },
        {
          value: 'TRY',
          label: 'Turkish Lira'
        },
        {
          value: 'TVD',
          label: 'Tuvalu dollar'
        },
        {
          value: 'AED',
          label: 'UAE Dirham'
        },
        {
          value: 'XFU',
          label: 'UIC-Franc'
        },
        {
          value: 'USD',
          label: 'US Dollar'
        },
        {
          value: 'UGX',
          label: 'Uganda Shilling'
        },
        {
          value: 'UYU',
          label: 'Uruguayan peso'
        },
        {
          value: 'UZS',
          label: 'Uzbekistan Sum'
        },
        {
          value: 'VUV',
          label: 'Vatu'
        },
        {
          value: 'KRW',
          label: 'Won'
        },
        {
          value: 'YER',
          label: 'Yemeni Rial'
        },
        {
          value: 'JPY',
          label: 'Yen'
        },
        {
          value: 'CNY',
          label: 'Yuan Renminbi'
        },
        {
          value: 'ZMK',
          label: 'Zambian Kwacha'
        },
        {
          value: 'ZMW',
          label: 'Zambian Kwacha'
        },
        {
          value: 'ZWD',
          label: 'Zimbabwe Dollar A/06'
        },
        {
          value: 'ZWN',
          label: 'Zimbabwe dollar A/08'
        },
        {
          value: 'ZWL',
          label: 'Zimbabwe dollar A/09'
        },
        {
          value: 'PLN',
          label: 'Zloty'
        }
      ]
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
