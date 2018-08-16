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
    id: '',
    facilityID: '',
    customerID: ''
  },
  redirect: {
    redirectToReferrer: false,
    pathname: '/'
  },
  // userQueue: []
  userQueue: {
    page: 1,
    totalPages: 1,
    data: []
  },
  customers: [],
  facilities: [],
  showEditUserModal: false,
  showEditCustomerModal: false,
  showEditFacilityModal: false
};
