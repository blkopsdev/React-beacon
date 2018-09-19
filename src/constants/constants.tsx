import { transitionInType, transitionOutType, Iuser, Itile } from '../models';
import { find } from 'lodash';
import { emptyTile } from '../reducers/initialState';
import { toastr } from 'react-redux-toastr';

const securityFunctions = {
  ManageUsers: {
    id: 'AA6F93B7-D278-4117-9B14-26DFA795742E',
    name: 'securityF:ManageUsers',
    description:
      'Approve and reject users as well as add and update customer and facility records.'
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
    icon: ['far', 'calendar-check'],
    title: 'training',
    src: 'https://placekitten.com/360/408',
    srcBanner: '',
    color: 'green',
    width: 360,
    height: 408,
    url: '/training',
    securityFunction: '',
    description: ''
  },
  {
    icon: 'users',
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
    icon: ['far', 'hospital'],
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
    icon: 'icon-maintenance',
    title: 'maintenance',
    src: 'https://placekitten.com/360/408',
    srcBanner: '',
    color: 'blue',
    width: 360,
    height: 408,
    url: '/maintenance',
    securityFunction: ''
  },
  {
    icon: 'icon-reports',
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
  {
    icon: 'users',
    title: 'manageTeam',
    src: 'https://placekitten.com/360/272',
    srcBanner: '',
    color: 'blue',
    width: 359,
    height: 272,
    url: '/team',
    securityFunction: securityFunctions.ManageTeamMembers.id,
    description: ''
  },
  {
    icon: 'icon-docs',
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
  {
    icon: ['far', 'list-alt'],
    title: 'inventory',
    src: 'https://placekitten.com/360/408',
    srcBanner: '',
    color: 'green',
    width: 360,
    height: 408,
    url: '/inventory',
    securityFunction: securityFunctions.ViewInventory.id,
    description: ''
  },
  {
    icon: 'icon-admin',
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
    title: 'billing',
    src: 'https://placekitten.com/360/408',
    srcBanner: '',
    color: 'orange',
    width: 359,
    height: 408,
    url: '/billing',
    securityFunction: '',
    description: ''
  },
  {
    icon: 'icon-groups',
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
    title: 'support',
    src: 'https://placekitten.com/360/136',
    srcBanner: '',
    color: 'dark',
    width: 359,
    height: 136,
    url: '/support',
    securityFunction: '',
    description: ''
  }
];

// const colors = {
//   green: 'green',
//   blue: 'blue',
//   orange: 'orange',
//   purple: 'purple',
//   dark: 'dark'
// }

const constants = {
  adalAuth: {
    tenant: 'a675e2fc-4806-4ec9-b49c-b0dc413b0e6b',
    clientId: 'e5fb8173-e048-4cda-8acd-a8e735b4c927'
  },
  toastrError: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 0
  },
  toastrSuccess: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 3000
  },
  colors,
  securityFunctions,
  tiles,
  hasSecurityFunction: (user: Iuser, securityFunction: string): boolean => {
    if (user.securityFunctions.indexOf(securityFunction) >= 0) {
      return true;
    } else {
      return false;
    }
  },
  getTileByURL: (url: string): Itile => {
    const foundTile = find(tiles, { url });
    if (foundTile && foundTile.url.length) {
      return foundTile as Itile;
    } else {
      return emptyTile;
    }
  },

  // {value: '', label: ''}
  countries: [
    {
      value: 'abc5d95c-129f-4837-988c-0bf4ae1f3b67',
      label: 'United States of America'
    },
    { value: '1235d95c-129f-4837-988c-0bf4ae1f3b67', label: 'Cuba' }
  ],
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
    toastr.error('Error', msg, constants.toastrError);
  }
};

export default constants;
