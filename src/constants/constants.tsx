import { transitionInType, transitionOutType, Iuser, Itile } from '../models';
import { find } from 'lodash';
import { emptyTile } from '../reducers/initialState';
import { toastr } from 'react-redux-toastr';
import { msalApp, MSAL_SCOPES } from '../components/auth/Auth-Utils';

const reportTypeEnum = {
  annualInspection: 1,
  jobNotes: 2,
  HTM: 3
};
const reportTypeEnumInverse: { [key: number]: string } = {
  1: 'annualInspection',
  2: 'jobNotes',
  3: 'HTM'
};

const reportTypeOptions = [
  {
    value: reportTypeEnum.annualInspection,
    label: reportTypeEnumInverse[reportTypeEnum.annualInspection]
  },
  {
    value: reportTypeEnum.jobNotes,
    label: reportTypeEnumInverse[reportTypeEnum.jobNotes]
  },
  {
    value: reportTypeEnum.HTM,
    label: reportTypeEnumInverse[reportTypeEnum.HTM]
  }
];

const measurementPointListTypeEnum: { [key: string]: number } = {
  Annual: 1,
  Verification: 2
};
const measurementPointListTypeLookup: { [key: number]: string } = {
  1: 'Annual',
  2: 'Verification'
};
const jobTypeOptions = [
  { value: '80eedbac-ec22-45ef-9ac7-f2eb4be2db4c', label: 'Audit' },
  { value: '524235fd-4633-4b7a-9c13-c37fc39efe69', label: 'Inspection' },
  { value: '9c7fde18-0b94-4af8-b4aa-913c40e5aed0', label: 'Verification' },
  { value: 'ae78eaa3-89c2-490a-90c6-44e5cfa10b01', label: 'Repair' }
];
const jobTypesByID: { [key: string]: string } = {
  '80eedbac-ec22-45ef-9ac7-f2eb4be2db4c': 'Audit',
  '524235fd-4633-4b7a-9c13-c37fc39efe69': 'Inspection',
  '9c7fde18-0b94-4af8-b4aa-913c40e5aed0': 'Verification',
  'ae78eaa3-89c2-490a-90c6-44e5cfa10b01': 'Repair'
};
const MPLTypebyJobTypesID: { [key: string]: number } = {
  '80eedbac-ec22-45ef-9ac7-f2eb4be2db4c': 0,
  '524235fd-4633-4b7a-9c13-c37fc39efe69': measurementPointListTypeEnum.Annual,
  '9c7fde18-0b94-4af8-b4aa-913c40e5aed0':
    measurementPointListTypeEnum.Verification,
  'ae78eaa3-89c2-490a-90c6-44e5cfa10b01': measurementPointListTypeEnum.Annual
};

const measurementPointListTypeOptions = [
  { label: 'Annual', value: measurementPointListTypeEnum.Annual },
  { label: 'Verification', value: measurementPointListTypeEnum.Verification }
];
const measurementPointResultStatusTypes: { [key: number]: string } = {
  0: 'resultStatusNotTested',
  1: 'resultStatusIncomplete',
  2: 'resultStatusFail',
  3: 'resultStatusPass',
  4: 'resultStatusCannotComplete',
  5: 'resultStatusRepair'
};

const measurementPointResultStatusTypesEnum: { [key: string]: number } = {
  resultStatusNotTested: 0,
  resultStatusIncomplete: 1,
  resultStatusFail: 2,
  resultStatusPass: 3,
  resultStatusCannotComplete: 4,
  resultStatusRepair: 5
};
/*
New - No results have been saved for the job
Started - Results are in the job
Completed - Leader has clicked complete button
Reopened - Leader reopened the job after closing
*/
// const jobStatus= {
//   0: "new",
//   1: "started",
//   2: "completed",
//   3: "reopened"
// }

const measurementPointTypeEnum: { [key: number]: string } = {
  1: 'Pass/Fail',
  2: 'Text',
  3: 'Numeric',
  4: 'Select'
};
const measurementPointTypeOptions = [
  { label: 'Pass/Fail', value: 1 },
  { label: 'Text', value: 2 },
  { label: 'Numeric', value: 3 },
  { label: 'Select', value: 4 }
];
const measurementPointTypes: { [key: string]: number } = {
  MEASUREMENT_POINT_PASSFAIL: 1,
  MEASUREMENT_POINT_TEXT: 2,
  MEASUREMENT_POINT_NUMERIC: 3,
  MEASUREMENT_POINT_SELECT: 4,
  GROUP: 5
};
const measurementPointTypesInverse: { [key: number]: string } = {
  1: 'Pass/Fail',
  2: 'Text',
  3: 'Numeric',
  4: 'Select',
  5: 'Group'
};
const measurementPointPassFailTypes: { [key: string]: number } = {
  pass: 1,
  fail: 2,
  notApplicable: 3
};

const measurementPointPassFailOptions = [
  { label: 'Pass', value: 1 },
  { label: 'Fail', value: 2 },
  { label: 'Not Applicable', value: 3 }
];

const icons = {
  dashboard: require('../images/icons/BM_Dashboard.png'),
  inventory: require('../images/icons/BM_Inventory.png'),
  manageJobs: require('../images/icons/BM_ManageJobs.png'),
  manageTeam: require('../images/icons/BM_ManageTeam.png'),
  manageUsers: require('../images/icons/BM_ManageUsers.png'),
  productQueue: require('../images/icons/BM_NewProductQueue.png'),
  userQueue: require('../images/icons/BM_NewUserQueue.png'),
  payments: require('../images/icons/BM_Payments.png'),
  training: require('../images/icons/BM_ManageTraining.png'),
  manageAllTraining: require('../images/icons/BM_ManageAllTraining.png'),
  locations: require('../images/icons/BM_ManageLocations.png'),
  measurements: require('../images/icons/BM_Measurement.png'),
  manageReport: require('../images/icons/BM_Reports.png'),
  brands: require('../images/icons/BM_Inventory.png'),
  customerAndFacility: require('../images/icons/BM_Inventory.png'),
  alerts: require('../images/icons/BM_Inventory.png')
};

const securityFunctions = {
  ManageUsers: {
    id: 'AA6F93B7-D278-4117-9B14-26DFA795742E',
    name: 'securityF:ManageUsers',
    description:
      'Approve and reject users as well as add and update customer and facility records.'
  },
  ManageJobs: {
    id: '097AAE49-75FD-4D2B-91EF-967BE665D565',
    name: 'securityF:ManageJobs',
    description: 'Create and edit maintenance jobs.'
  },
  FSE: {
    id: '9685F92C-F78E-4C70-9961-5E3068030242',
    name: 'securityF:FSE',
    description: 'Can be added as an FSE to jobs.'
  },
  ViewJobs: {
    id: '362838EB-A081-4D87-A231-1B427A481916',
    name: 'securityF:ViewJobs',
    description: 'Can view assigned jobs.'
  },
  ManageTrainingPayment: {
    id: '3A0D4616-4179-4BA1-98F0-6A929A3A5E0D',
    name: 'securityF:ManageTrainingPayment',
    description: 'Allows user to update their payment method.'
  },
  ManageSecurity: {
    id: 'B397D3EB-D55E-416A-9C48-AFE858AC5091',
    name: 'securityF:ManageSecurity',
    description: "Allows user to manage other user's security functions."
  },
  ViewInventory: {
    id: 'A98B1372-81D3-43E1-A81A-3F382CE83542',
    name: 'securityF:ViewInventory',
    description:
      "Allows the user to see a read-only view of the facility's current inventory."
  },
  ManageInventory: {
    id: 'DD65AB77-23D6-4FE0-9AD7-5729B6E5C40D',
    name: 'securityF:ManageInventory',
    description:
      'Allows the user to view, add, and manage the inventory for the facility.'
  },
  QuoteForInvoice: {
    id: 'DF7EA0C4-98C3-40BF-9E73-03E5BF50F9D0',
    name: 'securityF:QuoteForInvoice',
    description: 'Allows the user to request a quote from Beacon for products.'
  },
  SignUpTeamMembers: {
    id: '947CF4F4-10AC-4A38-BA7B-F069605E7A6C',
    name: 'securityF:SignUpTeamMembers',
    description: 'Allows the users to create other users underneath them.'
  },
  ManageTeamMembers: {
    id: 'C75A644C-54A5-4EA3-95D2-AB58D2A39E8E',
    name: 'securityF:ManageTeamMembers',
    description:
      'Allows the user to edit the information about a user on their team.'
  },
  ManageIndividualTraining: {
    id: '977049C6-3EB6-40CF-938F-C3B766C5EECD',
    name: 'securityF:ManageIndividualTraining',
    description: 'Allows the user to view and sign up for their own training.'
  },
  ManageEmployeeTraining: {
    id: '26785416-C391-4B14-AE9F-B5A56F8D223E',
    name: 'securityF:ManageEmployeeTraining',
    description:
      'Allows the user to manage and sign up for training for other people on their team.'
  },
  Payment: {
    id: '655401EA-4AA1-4543-91E0-9F5A3AB754C3',
    name: 'securityF:Payment',
    description: 'TBD'
  },
  ManageProductQueue: {
    id: '64818AA5-A685-4E5D-AD22-E2BB357CF58B',
    name: 'securityF:ManageProductQueue',
    description: 'Allows the user to manage and approve products.'
  },
  ManageLocations: {
    id: '0FE683B3-FEA5-4130-9243-2C272CABA674',
    name: 'securityF:ManageLocations',
    description: 'Allows the user to manage and create locations.'
  },
  ManageAllTraining: {
    id: '25961E0B-AFB4-4864-BF4C-A341A22553C6',
    name: 'securityF:ManageAllTraining',
    description: "Allows the user to view all user's training progress."
  },
  ManageAllMeasurementPoints: {
    id: 'BE9173D7-B8AA-4065-973F-7B39A2226221',
    name: 'securityF:ManageAllMeasurementPoints',
    description: 'Allows the user to manage global measurement points.'
  },
  ManageCustomerMeasurementPoints: {
    id: '4EA1668B-220A-4FFB-865B-EB271EF6FF0E',
    name: 'securityF:ManageCustomerMeasurementPoints',
    description: 'Allows the user to manage global measurement points.'
  },
  ManageBrands: {
    id: '6701ED68-A98C-4F62-BB4D-02219E88804B',
    name: 'securityF:ManageBrands',
    description: 'Allows the user to manage global brands.'
  },
  ManageAlerts: {
    id: '6701ED68-A98C-4F62-BB4D-02219E88804B',
    name: 'securityF:ManageBrands', // TODO change security function name
    description: 'Allows the user to manage global alerts.'
  },
  ViewReports: {
    id: 'FF7FAA1C-DF33-4237-98DA-2A8279250619',
    name: 'securityF:ViewReports',
    description: 'Allows the user view reports.'
  },
  RunAnnualInspectionReport: {
    id: 'CE7D1DA7-A98E-4A0D-B779-D40DB0B4BE4C',
    name: 'securityF:RunAnnualInspectionReport',
    description: 'Allows the user to run Annual Inspection Reports.'
  },
  RunJobCommentsReport: {
    id: 'EC63D1C2-00C6-4D75-A0B7-1A4BFEBA338B',
    name: 'securityF:RunJobCommentsReport',
    description: 'Allows the user to run Job Comments Reports.'
  },
  RunHTMReport: {
    id: '20EF9F72-28A1-4074-B3E2-2AF7912D414C',
    name: 'securityF:RunHTMReport',
    description: 'Allows the user to run the HTM report.'
  }
};

const colors: { [key: string]: string } = {
  green: '#1ABC9C',
  greenButton: 'success', // use the bootstrap success button color
  greenTr: 'rgba(26,188,156,.2)',
  greenBanner: 'rgba(26,188,156,.7)',
  blue: '#027AC3',
  blueTr: 'rgba(2,122,195,.2)',
  blueBanner: 'rgba(2,122,195,.7)',
  blueButton: 'primary',
  orange: '#FFA663',
  orangeTr: 'rgba(255,166,99,.2)',
  orangeBanner: 'rgba(255,166,99,.7)',
  orangeButton: 'warning',
  purple: '#62499D',
  purpleButton: 'info', // use the bootstrap info button color
  purpleTr: 'rgba(98,73,157,.2)',
  purpleBanner: 'rgba(98,73,157,.7)',
  dark: '#060A33',
  darkBanner: 'rgba(98,73,157,.7)',
  red: '#d00000',
  greyText: '#AAAAAA'
};

const alertTypes = [
  { value: 'alert', label: 'Alert' },
  { value: 'informational', label: 'Informational' }
];

const tiles: Itile[] = [
  {
    imgIcon: icons.alerts,
    title: 'alerts',
    src: require('../images/beaconTraining.jpg'),
    srcBanner: require('../images/beaconTrainingHeader.jpg'),
    color: 'dark',
    width: 270,
    height: 300,
    url: '/alerts',
    securityFunction: securityFunctions.ManageAlerts.id,
    description: ''
  },
  {
    imgIcon: icons.training,
    title: 'training',
    src: require('../images/beaconTraining.jpg'),
    srcBanner: require('../images/beaconTrainingHeader.jpg'),
    color: 'blue',
    width: 270,
    height: 300,
    url: '/training',
    securityFunction: securityFunctions.ManageIndividualTraining.id,
    description: ''
  },
  {
    imgIcon: icons.manageAllTraining,
    title: 'manageAllTraining',
    src: require('../images/trainingProgressTile.jpg'),
    srcBanner: require('../images/trainingProgressHeader.jpg'),
    color: 'orange',
    width: 270,
    height: 300,
    url: '/manageTraining',
    securityFunction: securityFunctions.ManageAllTraining.id,
    description: ''
  },
  {
    imgIcon: icons.inventory,
    title: 'inventory',
    src: require('../images/beaconManageInventory.jpg'),
    srcBanner: require('../images/beaconManageInventoryHeader.jpg'),
    color: 'green',
    width: 270,
    height: 300,
    url: '/inventory',
    securityFunction: securityFunctions.ViewInventory.id,
    description: ''
  },
  {
    imgIcon: icons.manageUsers,
    title: 'userManage',
    src: require('../images/beaconManageUsers.jpg'),
    srcBanner: require('../images/beaconManageUsersHeader.jpg'),
    color: 'purple',
    width: 270,
    height: 300,
    url: '/users',
    securityFunction: securityFunctions.ManageUsers.id,
    description: ''
  },
  {
    imgIcon: icons.userQueue,
    title: 'userQueue',
    src: require('../images/beaconQueue.jpg'),
    srcBanner: require('../images/beaconQueueHeader.jpg'),
    color: 'orange',
    width: 270,
    height: 300,
    url: '/queue',
    securityFunction: securityFunctions.ManageUsers.id,
    description: ''
  },
  {
    imgIcon: icons.manageTeam,
    title: 'manageTeam',
    src: require('../images/beaconManageTeam.jpg'),
    srcBanner: require('../images/beaconManageTeamHeader.jpg'),
    color: 'blue',
    width: 270,
    height: 300,
    url: '/team',
    securityFunction: securityFunctions.ManageTeamMembers.id,
    description: ''
  },
  {
    imgIcon: icons.locations,
    title: 'locations',
    src: require('../images/LocationTile.jpg'),
    srcBanner: require('../images/locationHeader.jpg'),
    color: 'green',
    width: 270,
    height: 300,
    url: '/locations',
    securityFunction: securityFunctions.ManageLocations.id,
    description: ''
  },
  {
    imgIcon: icons.manageJobs,
    title: 'manageJobs',
    src: require('../images/beaconManageJobs.jpg'),
    srcBanner: require('../images/beaconManageJobsHeader.jpg'),
    color: 'orange',
    width: 270,
    height: 300,
    url: '/managejobs',
    securityFunction: securityFunctions.ManageJobs.id,
    description: ''
  },
  {
    imgIcon: icons.productQueue,
    title: 'productqueue',
    src: require('../images/beaconManageProductQueue.jpg'),
    srcBanner: require('../images/beaconManageProductQueueHeader.jpg'),
    color: 'purple',
    width: 270,
    height: 300,
    url: '/productqueue',
    securityFunction: securityFunctions.ManageProductQueue.id,
    description: ''
  },
  {
    imgIcon: icons.measurements,
    title: 'manageCustomerMeasurementPointList',
    src: require('../images/measurementTile.jpg'),
    srcBanner: require('../images/beaconManageUsersHeader.jpg'),
    color: 'green',
    width: 270,
    height: 300,
    url: '/customermeasurements',
    securityFunction: securityFunctions.ManageCustomerMeasurementPoints.id,
    description: ''
  },
  {
    imgIcon: icons.measurements,
    title: 'manageMeasurementPointList',
    src: require('../images/measurementTile.jpg'),
    srcBanner: require('../images/beaconManageUsersHeader.jpg'),
    color: 'purple',
    width: 270,
    height: 300,
    url: '/measurements',
    securityFunction: securityFunctions.ManageAllMeasurementPoints.id,
    description: ''
  },
  {
    imgIcon: icons.manageReport,
    title: 'manageReports',
    src: require('../images/reportTile.jpg'),
    srcBanner: require('../images/beaconManageUsersHeader.jpg'),
    color: 'orange',
    width: 270,
    height: 300,
    url: '/reports',
    securityFunction: securityFunctions.ViewReports.id,
    description: ''
  },
  {
    imgIcon: icons.inventory,
    title: 'brands',
    src: require('../images/beaconManageInventory.jpg'),
    srcBanner: require('../images/beaconManageInventoryHeader.jpg'),
    color: 'green',
    width: 270,
    height: 300,
    url: '/brands',
    securityFunction: securityFunctions.ViewInventory.id,
    description: ''
  },
  {
    imgIcon: icons.inventory,
    title: 'Customers and Facility',
    src: require('../images/beaconManageInventory.jpg'),
    srcBanner: require('../images/beaconManageInventoryHeader.jpg'),
    color: 'green',
    width: 270,
    height: 300,
    url: '/customer-and-facility',
    securityFunction: securityFunctions.ViewInventory.id,
    description: ''
  }
];

export const constants = {
  toastrError: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 8000
  },
  toastrWarning: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 8000
  },
  toastrSuccess: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 3000
  },
  alertTypes,
  colors,
  securityFunctions,
  tiles,
  jobTypeOptions,
  jobTypesByID,
  icons,
  measurementPointListTypeEnum,
  MPLTypebyJobTypesID,
  measurementPointListTypeLookup,
  measurementPointTypeEnum,
  measurementPointListTypeOptions,
  measurementPointTypeOptions,
  measurementPointTypes,
  measurementPointTypesInverse,
  measurementPointPassFailOptions,
  measurementPointResultStatusTypes,
  measurementPointResultStatusTypesEnum,
  measurementPointPassFailTypes,
  reportTypeEnum,
  reportTypeEnumInverse,
  reportTypeOptions,
  defaultProductStandardID: '740e2f29-6bfa-4316-98c1-f2b32637bf6e',
  hasSecurityFunction: (user: Iuser, securityFunction: string): boolean => {
    if (user.securityFunctions.indexOf(securityFunction) >= 0) {
      return true;
    } else {
      return false;
    }
  },
  getTileByURL: (URL: string): Itile => {
    const firstParam = '/' + URL.split('/')[1];
    const foundTile = find(tiles, { url: firstParam });
    if (foundTile && foundTile.url.length) {
      return foundTile as Itile;
    } else {
      return emptyTile;
    }
  },

  // {value: '', label: ''}
  countries: require('../constants/countries.json'),
  handleError(error: any, message: string) {
    let msg = '';
    if (error && error.response && error.response.data) {
      const messageDetail =
        error.response.data instanceof Object &&
        error.response.data.hasOwnProperty('value')
          ? error.response.data.value
          : error.response.data;
      msg = `Failed to ${message}. ${messageDetail}`;
    } else if (error && error.message) {
      msg = `Failed to ${message}.  Please try again or contact support. ${
        error.message
      }`;
    } else {
      msg = `Failed to ${message}.  Please try again or contact support.`;
    }
    if (!navigator.onLine) {
      msg = 'Please connect to the internet.';
    }

    if (error && error.errorCode === 'user_login_error') {
      setTimeout(() => {
        msalApp.loginRedirect({
          scopes: [MSAL_SCOPES.MMG]
        });
      }, 1000);
      return;
    }

    if (error && error.response && error.response.status === 401) {
      console.error(
        'catching unauthorized, we should not get here now that we are using msalFetch'
      );
      return; // don't show an error
    }
    toastr.error('Error', msg, constants.toastrError);
  },
  tableSearchDebounceTime: 300,
  timedQuizHours: 2,
  searchProductPageCount: 80, // max items to show inside the product search modal
  searchProductRecentProductLimit: 30,
  tablePageSizeDefault: 25,
  tablePageSizeOptions: [10, 25, 50, 100],
  httpTimeout: 60000
};
