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
    facilities: [],
    customerID: '',
    hasTeamMembers: false
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
  userManage: {
    page: 1,
    totalPages: 1,
    data: []
  },
  teamManage: {
    page: 1,
    totalPages: 1,
    data: []
  },
  manageInventory: {
    page: 1,
    totalPages: 1,
    data: []
  },
  customers: [],
  facilities: [],
  productInfo: {
    brands: [],
    gasTypes: [],
    manufacturers: [],
    mainCategories: [],
    powers: [],
    productGroups: [],
    standards: [],
    subcategories: [],
    systemSizes: []
  },
  showEditUserModal: false,
  showEditCustomerModal: false,
  showEditFacilityModal: false,
  showEditQueueUserModal: false,
  showEditProfileModal: false,
  showSecurityFunctionsModal: false,
  showEditTeamModal: false,
  showEditInventoryModal: false
};

export const emptyTile = {
  icon: '',
  title: '',
  src: '',
  srcBanner: '',
  color: '',
  width: 359,
  height: 136,
  url: '',
  securityFunction: '',
  description: ''
};
