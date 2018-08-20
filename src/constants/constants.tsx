import { transitionInType, transitionOutType, Iuser, Itile } from '../models';
import { find } from 'lodash';

const securityFunctions = {
  ManageUsers: 'AA6F93B7-D278-4117-9B14-26DFA795742E',
  ManageTrainingPayment: '3A0D4616-4179-4BA1-98F0-6A929A3A5E0D',
  ManageSecurity: 'B397D3EB-D55E-416A-9C48-AFE858AC5091',
  ViewInventory: 'A98B1372-81D3-43E1-A81A-3F382CE83542',
  ManageInventory: 'DD65AB77-23D6-4FE0-9AD7-5729B6E5C40D',
  QuoteForInvoice: 'DF7EA0C4-98C3-40BF-9E73-03E5BF50F9D0',
  SignUpTeamMembers: '947CF4F4-10AC-4A38-BA7B-F069605E7A6C',
  ManageTeamMembers: 'C75A644C-54A5-4EA3-95D2-AB58D2A39E8E',
  ManageIndividualTraining: '977049C6-3EB6-40CF-938F-C3B766C5EECD',
  ManageEmployeeTraining: '26785416-C391-4B14-AE9F-B5A56F8D223E',
  Payment: '655401EA-4AA1-4543-91E0-9F5A3AB754C3'
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
    color: 'dark',
    width: 360,
    height: 136,
    url: '/alerts',
    securityFunction: ''
  },
  {
    icon: ['far', 'calendar-check'],
    title: 'training',
    src: 'https://placekitten.com/360/408',
    color: 'green',
    width: 360,
    height: 408,
    url: '/training',
    securityFunction: securityFunctions.ManageTrainingPayment
  },
  {
    icon: 'users',
    title: 'userQueue',
    src: 'https://placekitten.com/360/408',
    color: 'orange',
    width: 360,
    height: 408,
    url: '/queue',
    securityFunction: securityFunctions.ManageUsers
  },
  {
    icon: ['far', 'hospital'],
    title: 'userManage',
    src: 'https://placekitten.com/360/408',
    color: 'purple',
    width: 360,
    height: 408,
    url: '/users',
    securityFunction: securityFunctions.ManageUsers
  },
  {
    icon: 'icon-maintenance',
    title: 'maintenance',
    src: 'https://placekitten.com/360/408',
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
    color: 'orange',
    width: 360,
    height: 272,
    url: '/reports',
    securityFunction: ''
  },
  {
    icon: 'icon-team',
    title: 'manageTeam',
    src: 'https://placekitten.com/360/272',
    color: 'blue',
    width: 359,
    height: 272,
    url: '/team',
    securityFunction: ''
  },
  {
    icon: 'icon-docs',
    title: 'documents',
    src: 'https://placekitten.com/360/272',
    color: 'purple',
    width: 360,
    height: 272,
    url: '/docs',
    securityFunction: ''
  },
  {
    icon: 'icon-inventory',
    title: 'inventory',
    src: 'https://placekitten.com/360/408',
    color: 'green',
    width: 360,
    height: 408,
    url: '/inventory',
    securityFunction: ''
  },
  {
    icon: 'icon-admin',
    title: 'administration',
    src: 'https://placekitten.com/360/272',
    color: 'purple',
    width: 360,
    height: 272,
    url: '/admin',
    securityFunction: ''
  },
  {
    icon: 'icon-billing',
    title: 'billing',
    src: 'https://placekitten.com/360/408',
    color: 'orange',
    width: 359,
    height: 408,
    url: '/billing',
    securityFunction: ''
  },
  {
    icon: 'icon-groups',
    title: 'groups',
    src: 'https://placekitten.com/360/272',
    color: 'dark',
    width: 360,
    height: 272,
    url: '/groups',
    securityFunction: ''
  },
  {
    icon: 'icon-support',
    title: 'support',
    src: 'https://placekitten.com/360/136',
    color: 'dark',
    width: 359,
    height: 136,
    url: '/support',
    securityFunction: ''
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
    return (
      find(tiles, { url }) || {
        icon: '',
        title: '',
        src: '',
        color: '',
        width: 359,
        height: 136,
        url: '',
        securityFunction: ''
      }
    );
  }
};

export default constants;
