export const initialOption = { value: '', label: '' };

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
    showEditProductModal: false,
    showEditInstallModal: false,
    showEditQuoteModal: false,
    page: 1,
    totalPages: 1,
    data: [],
    selectedFacility: initialOption,
    cart: {
      addedIDs: [],
      quantityByID: {}
    },
    productInfo: {
      brands: {},
      gasTypes: {},
      manufacturers: {},
      mainCategories: {},
      powers: {},
      productGroups: {},
      standards: {},
      subcategories: {},
      systemSizes: {},
      brandOptions: [],
      gasTypeOptions: [],
      mainCategoryOptions: [],
      manufacturerOptions: [],
      powerOptions: [],
      productGroupOptions: [],
      standardOptions: [],
      subcategoryOptions: [],
      systemSizeOptions: []
    }
  },
  customers: [],
  facilities: [],
  showEditUserModal: false,
  showEditCustomerModal: false,
  showEditFacilityModal: false,
  showEditQueueUserModal: false,
  showEditProfileModal: false,
  showSecurityFunctionsModal: false,
  showEditTeamModal: false
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
