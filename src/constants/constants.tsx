import { transitionInType, transitionOutType, Iuser, Itile } from '../models';
import { find } from 'lodash';
import { emptyTile } from '../reducers/initialState';
import { toastr } from 'react-redux-toastr';
import { adalReauth } from '../actions/userActions';
// import { icon } from "@fortawesome/fontawesome-svg-core";

const jobTypeOptions = [
  { value: '80eedbac-ec22-45ef-9ac7-f2eb4be2db4c', label: 'Audit' },
  { value: '524235fd-4633-4b7a-9c13-c37fc39efe69', label: 'Inspection' },
  { value: '9c7fde18-0b94-4af8-b4aa-913c40e5aed0', label: 'Validation' },
  { value: 'ae78eaa3-89c2-490a-90c6-44e5cfa10b01', label: 'Repair' }
];

const jobTypesByID = {
  '80eedbac-ec22-45ef-9ac7-f2eb4be2db4c': 'Audit',
  '524235fd-4633-4b7a-9c13-c37fc39efe69': 'Inspection',
  '9c7fde18-0b94-4af8-b4aa-913c40e5aed0': 'Validation',
  'ae78eaa3-89c2-490a-90c6-44e5cfa10b01': 'Repair'
};

const measurementPointListTypeOptions = [
  { label: 'Annual', value: 1 },
  { label: 'Verification', value: 2 }
];
const measurementPointTypeOptions = [
  { label: 'Pass/Fail', value: 1 },
  { label: 'Text', value: 2 },
  { label: 'Numeric', value: 3 },
  { label: 'Select', value: 4 }
];
const measurementPointTypes = {
  QUESTION_PASSFAIL: 1,
  QUESTION_TEXT: 2,
  QUESTION_NUMERIC: 3,
  QUESTION_SELECT: 4,
  GROUP: 5,
  PROCEDURE: 6
};
const measurementPointTypesInverse = {
  1: 'Pass/Fail',
  2: 'Text',
  3: 'Numeric',
  4: 'Select',
  5: 'Group',
  6: 'Procedure'
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
  training: require('../images/icons/BM_Training.png'),
  locations: require('../images/icons/BM_ManageLocations.png'),
  measurements: require('../images/icons/BM_ManageLocations.png')
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
    description: "Allows the user to view all user's training progress"
  },
  ManageAllMeasurementPoints: {
    id: 'BE9173D7-B8AA-4065-973F-7B39A2226221',
    name: 'securityF:ManageAllMeasurementPoints',
    description: 'Allows the user to manage global measurement points'
  },
  ManageCustomerMeasurementPoints: {
    id: '4EA1668B-220A-4FFB-865B-EB271EF6FF0E',
    name: 'securityF:ManageCustomerMeasurementPoints',
    description: 'Allows the user to manage global measurement points'
  }
};

const colors = {
  green: '#1ABC9C',
  greenButton: 'success', // use the bootstrap success button color
  greenTr: 'rgba(26,188,156,.2)',
  blue: '#027AC3',
  blueTr: 'rgba(2,122,195,.2)',
  blueButton: 'primary',
  orange: '#FFA663',
  orangeTr: 'rgba(255,166,99,.2)',
  orangeButton: 'warning',
  purple: '#62499D',
  purpleButton: 'info', // use the bootstrap info button color
  purpleTr: 'rgba(98,73,157,.2)',
  dark: '#060A33'
};
const tiles = [
  {
    icon: 'icon-alerts',
    iconType: 'fa',
    title: 'alerts',
    src: 'https://placekitten.com/360/136',
    srcBanner: '',
    color: 'dark',
    width: 360,
    height: 136,
    url: '/alerts',
    securityFunction: '',
    description: ''
  },
  {
    icon: icons.training,
    iconType: 'img',
    title: 'training',
    src: require('src/images/beaconTraining.jpg'),
    srcBanner: require('src/images/beaconTrainingHeader.jpg'),
    color: 'blue',
    width: 360,
    height: 400,
    url: '/training',
    securityFunction: securityFunctions.ManageIndividualTraining.id,
    description: ''
  },
  {
    icon: icons.training,
    iconType: 'img',
    title: 'manageAllTraining',
    src: require('src/images/beaconTraining.jpg'),
    srcBanner: require('src/images/beaconTrainingHeader.jpg'),
    color: 'orange',
    width: 360,
    height: 400,
    url: '/manageTraining',
    securityFunction: securityFunctions.ManageAllTraining.id,
    description: ''
  },
  {
    icon: icons.userQueue,
    iconType: 'img',
    title: 'userQueue',
    src: require('src/images/beaconQueue.jpg'),
    srcBanner: require('src/images/beaconQueueHeader.jpg'),
    color: 'orange',
    width: 360,
    height: 400,
    url: '/queue',
    securityFunction: securityFunctions.ManageUsers.id,
    description: ''
  },
  {
    icon: icons.manageUsers,
    iconType: 'img',
    title: 'userManage',
    src: require('src/images/beaconManageUsers.jpg'),
    srcBanner: require('src/images/beaconManageUsersHeader.jpg'),
    color: 'purple',
    width: 360,
    height: 400,
    url: '/users',
    securityFunction: securityFunctions.ManageUsers.id,
    description: ''
  },
  {
    icon: icons.manageJobs,
    iconType: 'img',
    title: 'manageJobs',
    src: require('src/images/beaconManageJobs.jpg'),
    srcBanner: require('src/images/beaconManageJobsHeader.jpg'),
    color: 'orange',
    width: 360,
    height: 400,
    url: '/managejobs',
    securityFunction: securityFunctions.ManageJobs.id,
    description: ''
  },
  {
    icon: icons.locations,
    iconType: 'img',
    title: 'locations',
    src: require('src/images/beaconManageUsers.jpg'),
    srcBanner: require('src/images/beaconManageUsersHeader.jpg'),
    color: 'green',
    width: 360,
    height: 400,
    url: '/locations',
    securityFunction: securityFunctions.ManageLocations.id,
    description: ''
  },
  {
    icon: 'icon-reports',
    iconType: 'fa',
    title: 'reports',
    src: 'https://placekitten.com/360/272',
    srcBanner: '',
    color: 'orange',
    width: 360,
    height: 272,
    url: '/reports',
    securityFunction: '',
    description: ''
  },
  // {
  //   icon: icons.manageTeam,
  //   iconType: 'img',
  //   title: 'manageTeam',
  //   src: require('src/images/beaconManageTeam.jpg'),
  //   srcBanner: require('src/images/beaconManageTeamHeader.jpg'),
  //   color: 'blue',
  //   width: 360,
  //   height: 400,
  //   url: '/team',
  //   securityFunction: securityFunctions.ManageTeamMembers.id,
  //   description: ''
  // },
  {
    icon: 'icon-docs',
    iconType: 'fa',
    title: 'documents',
    src: 'https://placekitten.com/360/272',
    srcBanner: '',
    color: 'purple',
    width: 360,
    height: 272,
    url: '/docs',
    securityFunction: '',
    description: ''
  },
  // {
  //   icon: icons.inventory,
  //   iconType: 'img',
  //   title: 'inventory',
  //   src: require('src/images/beaconManageInventory.jpg'),
  //   srcBanner: require('src/images/beaconManageInventoryHeader.jpg'),
  //   color: 'green',
  //   width: 360,
  //   height: 400,
  //   url: '/inventory',
  //   securityFunction: securityFunctions.ViewInventory.id,
  //   description: ''
  // },
  {
    icon: icons.productQueue,
    iconType: 'img',
    title: 'productqueue',
    src: require('src/images/beaconManageProductQueue.jpg'),
    srcBanner: require('src/images/beaconManageProductQueueHeader.jpg'),
    color: 'purple',
    width: 360,
    height: 400,
    url: '/productqueue',
    securityFunction: securityFunctions.ManageProductQueue.id,
    description: ''
  },
  {
    icon: 'icon-admin',
    iconType: 'fa',
    title: 'administration',
    src: 'https://placekitten.com/360/272',
    srcBanner: '',
    color: 'purple',
    width: 360,
    height: 272,
    url: '/admin',
    securityFunction: '',
    description: ''
  },
  {
    icon: 'icon-billing',
    iconType: 'fa',
    title: 'billing',
    src: 'https://placekitten.com/360/400',
    srcBanner: '',
    color: 'orange',
    width: 359,
    height: 400,
    url: '/billing',
    securityFunction: '',
    description: ''
  },
  {
    icon: 'icon-groups',
    iconType: 'fa',
    title: 'groups',
    src: 'https://placekitten.com/360/272',
    srcBanner: '',
    color: 'dark',
    width: 360,
    height: 272,
    url: '/groups',
    securityFunction: '',
    description: ''
  },
  {
    icon: 'icon-support',
    iconType: 'fa',
    title: 'support',
    src: 'https://placekitten.com/360/136',
    srcBanner: '',
    color: 'dark',
    width: 359,
    height: 136,
    url: '/support',
    securityFunction: '',
    description: ''
  },
  {
    icon: icons.measurements,
    iconType: 'img',
    title: 'manageMeasurementPointList',
    src: require('src/images/beaconManageUsers.jpg'),
    srcBanner: require('src/images/beaconManageUsersHeader.jpg'),
    color: 'purple',
    width: 360,
    height: 400,
    url: '/measurements',
    securityFunction:
      securityFunctions.ManageAllMeasurementPoints.id ||
      securityFunctions.ManageCustomerMeasurementPoints.id,
    description: ''
  }
];

const constants = {
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
  colors,
  securityFunctions,
  tiles,
  jobTypeOptions,
  jobTypesByID,
  icons,
  measurementPointListTypeOptions,
  measurementPointTypeOptions,
  measurementPointTypes,
  measurementPointTypesInverse,
  measurementPointPassFailOptions,
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
  countries: require('src/constants/countries.json'),
  handleError(error: any, message: string) {
    let msg = '';
    if (error && error.response && error.response.data) {
      msg = `Failed to ${message}. ${error.response.data}`;
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
    if (error && error.response && error.response.status === 401) {
      console.warn('catching unauthorized, re-authenticating');
      setTimeout(() => {
        adalReauth();
      }, 1000);
      return; // don't show an error
    }
    toastr.error('Error', msg, constants.toastrError);
  },
  tableSearchDebounceTime: 300,
  timedQuizHours: 2
};

export default constants;
