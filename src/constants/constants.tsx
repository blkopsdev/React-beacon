import { transitionInType, transitionOutType, Iuser } from '../models';

const securityFunctions = {
  manageUsers: 'AA6F93B7-D278-4117-9B14-26DFA795742E',
  manageTrainingPayment: '3A0D4616-4179-4BA1-98F0-6A929A3A5E0D'
};

const constants = {
  adalAuth: {
    tenant: 'a675e2fc-4806-4ec9-b49c-b0dc413b0e6b',
    clientId: 'e5fb8173-e048-4cda-8acd-a8e735b4c927',
    redirectUri: 'http://localhost:3000'
  },
  toastrError: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 0
  },
  securityFunctions,
  hasSecurityFunction: (user: Iuser, securityFunction: string): boolean => {
    if (user.securityFunctions.indexOf(securityFunction) >= 0) {
      return true;
    } else {
      return false;
    }
  },

  tiles: [
    {
      icon: 'icon-alerts',
      title: 'Alerts',
      src: 'https://placekitten.com/360/136',
      class: 'tile tile-dark',
      width: 360,
      height: 136,
      url: '/alerts',
      securityFunction: ''
    },
    {
      icon: 'icon-training',
      title: 'Training',
      src: 'https://placekitten.com/360/408',
      class: 'tile tile-green',
      width: 360,
      height: 408,
      url: '/users',
      securityFunction: securityFunctions.manageUsers
    },
    {
      icon: 'users',
      title: 'New User Queue',
      src: 'https://placekitten.com/360/408',
      class: 'tile tile-green',
      width: 360,
      height: 408,
      url: '/queue',
      securityFunction: securityFunctions.manageUsers
    },
    {
      icon: 'icon-maintenance',
      title: 'Maintenance',
      src: 'https://placekitten.com/360/408',
      class: 'tile tile-blue',
      width: 360,
      height: 408,
      url: '/maintenance',
      securityFunction: ''
    },
    {
      icon: 'icon-reports',
      title: 'Reports',
      src: 'https://placekitten.com/360/272',
      class: 'tile tile-orange',
      width: 360,
      height: 272,
      url: '/reports',
      securityFunction: ''
    },
    {
      icon: 'icon-team',
      title: 'Manage Team',
      src: 'https://placekitten.com/360/272',
      class: 'tile tile-blue',
      width: 359,
      height: 272,
      url: '/team',
      securityFunction: ''
    },
    {
      icon: 'icon-docs',
      title: 'Documents & Legal',
      src: 'https://placekitten.com/360/272',
      class: 'tile tile-purple',
      width: 360,
      height: 272,
      url: '/docs',
      securityFunction: ''
    },
    {
      icon: 'icon-inventory',
      title: 'Inventory',
      src: 'https://placekitten.com/360/408',
      class: 'tile tile-green',
      width: 360,
      height: 408,
      url: '/inventory',
      securityFunction: ''
    },
    {
      icon: 'icon-admin',
      title: 'Administration',
      src: 'https://placekitten.com/360/272',
      class: 'tile tile-purple',
      width: 360,
      height: 272,
      url: '/admin',
      securityFunction: ''
    },
    {
      icon: 'icon-billing',
      title: 'Billing',
      src: 'https://placekitten.com/360/408',
      class: 'tile tile-orange',
      width: 359,
      height: 408,
      url: '/billing',
      securityFunction: ''
    },
    {
      icon: 'icon-groups',
      title: 'My groups',
      src: 'https://placekitten.com/360/272',
      class: 'tile tile-dark',
      width: 360,
      height: 272,
      url: '/groups',
      securityFunction: ''
    },
    {
      icon: 'icon-support',
      title: 'Support',
      src: 'https://placekitten.com/360/136',
      class: 'tile tile-dark',
      width: 359,
      height: 136,
      url: '/support',
      securityFunction: ''
    }
  ]
};

export default constants;
