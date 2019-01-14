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
export const initialFacility = {
  id: '',
  name: '',
  customerID: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  buildings: []
};

export const initialLoc = {
  name: '',
  rooms: [],
  floorID: ''
};
export const initialBuilding = {
  name: '',
  floors: []
};
export const initialFloor = {
  name: '',
  locations: []
};

export const initialRoom = {
  name: ''
};
/*
*  TRAINING initial state
*/

export const initialQuiz = {
  id: '',
  name: '',
  imagePath: '',
  isComplete: false,
  videoPath: '',
  instructions: '',
  lessonID: '',
  isTimed: false,
  questions: [
    {
      id: '',
      text: '',
      type: '',
      options: [],
      correctAnswer: '',
      correctText: '',
      wrongText: '',
      order: 0
    }
  ]
};
export const initialLesson = {
  id: '',
  name: '',
  description: '',
  courseID: '',
  imagePath: '',
  order: 0,
  primaryVideoPath: '',
  secondaryVideoPath: '',
  slideshowPath: '',
  courseLessons: [],
  cost: 0
};

/* 
* initialState
*/
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
  manageLocation: {
    totalPages: 1,
    facility: initialFacility,
    data: [],
    showEditLocationModal: false,
    tableFilters: initialTableFilters,
    selectedBuilding: initialBuilding,
    selectedFloor: initialFloor,
    selectedLocation: initialLoc,
    selectedRoom: initialRoom
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
    showShoppingCartModal: false,
    showInstallContactModal: false,
    showSearchNewProductsModal: false,
    showImportInstall: false,
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
  training: {
    cart: {
      addedIDs: [],
      productsByID: {}
    },
    showShoppingCartModal: false,
    courses: [],
    lessons: {},
    lesson: initialLesson,
    quizzes: {},
    quiz: initialQuiz,
    lessonProgress: {},
    purchasedTraining: []
  },
  manageTraining: {
    data: [
      {
        userName: 'Joe Dill',
        courseName: 'Beacon Training 101',
        progress: '1/12',
        results: '80%, 90%'
      }
    ],
    tableFilters: initialTableFilters,
    totalPages: 1
  },
  manageMeasurements: {
    totalPages: 1,
    data: [],
    showEditMeasurementsModal: false,
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

export const initialQuizAnswers = { show: false, quizAnswers: {} };
