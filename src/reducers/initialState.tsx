export const initialOption = { value: '', label: '' };
export const initialTableFilters = { search: '', page: 1 };
export const initialProduct = {
  id: '',
  name: '',
  sku: '',
  description: '',
  imagePath: '',
  subcategoryID: '',
  standardID: '',
  brandID: '',
  manufacturerID: '',
  gasTypeID: '',
  powerID: '',
  systemSizeID: '',
  productGroupID: '',
  subcategory: {
    mainCategoryID: '',
    id: '',
    name: '',
    createDate: '',
    updateDate: '',
    creatorID: '',
    updaterID: '',
    mainCategory: {
      id: '',
      name: '',
      createDate: '',
      updateDate: '',
      creatorID: '',
      updaterID: ''
    }
  },
  installs: [],
  quantity: 1
};

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
    hasTeamMembers: false,
    appVersion: ''
  },
  redirect: {
    redirectToReferrer: false,
    pathname: '/'
  },
  // userQueue: []
  manageUserQueue: {
    totalPages: 1,
    data: [],
    showEditQueueUserModal: false,
    tableFilters: initialTableFilters
  },
  manageUser: {
    totalPages: 1,
    data: [],
    showEditUserModal: false,
    tableFilters: initialTableFilters
  },
  manageJob: {
    totalPages: 1,
    data: [],
    jobTypes: [],
    fseUsers: [],
    showEditJobModal: false,
    tableFilters: initialTableFilters
  },
  manageTeam: {
    totalPages: 1,
    data: [],
    showEditTeamModal: false,
    tableFilters: initialTableFilters
  },
  manageInventory: {
    showEditProductModal: false,
    showEditInstallModal: false,
    showEditQuoteModal: false,
    showInstallContactModal: false,
    showSearchNewProductsModal: false,
    totalPages: 1,
    data: [],
    cart: {
      addedIDs: [],
      productsByID: {}
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
    },
    tableFilters: initialTableFilters,
    selectedProduct: initialProduct,
    newProducts: {}
  },
  manageProductQueue: {
    showApproveProductModal: false,
    totalPages: 1,
    data: [],
    tableFilters: initialTableFilters
  },
  customers: [],
  facilities: [],

  showEditCustomerModal: false,
  showEditFacilityModal: false,

  showEditProfileModal: false,
  showSecurityFunctionsModal: false
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
