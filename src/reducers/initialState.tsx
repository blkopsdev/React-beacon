export default {
  ajaxCallsInProgress: 0,
  user: {
    password: '',
    username: '',
    isAuthenticated: false,
    token: '',
    email: '',
    securityFunctions: [],
    first: '',
    last: '',
    position: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    id: ''
  },
  redirect: {
    redirectToReferrer: false,
    pathname: '/'
  },
  // userQueue: []
  userQueue: {
    search: '',
    page: 1,
    totalPages: 1,
    data: []
  }
};
