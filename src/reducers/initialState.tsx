export const initialOption = { value: '', label: '' };
export const initialTableFilters = { search: '', page: 1 };

export const initialFacility = {
  id: '',
  name: '',
  customerID: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  buildings: [],
  isDeleted: false
};
const initialSubcategory = {
  mainCategoryID: '',
  id: '',
  name: '',
  createDate: '',
  updateDate: '',
  creatorID: '',
  updaterID: '',
  mainCategoryIDs: [],
  mainCategory: {
    id: '',
    name: '',
    createDate: '',
    updateDate: '',
    creatorID: '',
    updaterID: ''
  },
  isDeleted: false
};

export const initialProduct = {
  id: '',
  name: '',
  sku: '',
  description: '',
  imagePath: '',
  subcategoryID: '',
  standardID: '',
  brandID: '',
  productTypeID: '',
  powerID: '',
  systemSizeID: '',
  subcategory: initialSubcategory,
  installs: [],
  isDeleted: false,
  quantity: 1
};
export const initialInstallBase = {
  id: '',
  code: '',
  productID: '',
  product: initialProduct,
  facilityID: '',
  name: '', // not used
  status: '',
  isDeleted: false
};

export const initialLoc = {
  id: '',
  name: '',
  rooms: [],
  floorID: '',
  isDeleted: false
};
export const initialBuilding = {
  id: '',
  name: '',
  floors: [],
  facilityID: '',
  isDeleted: false
};
export const initialFloor = {
  id: '',
  name: '',
  buildingID: '',
  locations: [],
  isDeleted: false
};

export const initialRoom = {
  id: '',
  name: '',
  locationID: '',
  isDeleted: false
};

export const initialMeasurementPointList = {
  id: '',
  measurementPointTabs: [],
  mainCategoryID: '',
  standardID: '',
  type: 1,
  testProcedures: ''
};
export const initialMeasurementPointTab = {
  id: '',
  name: 'Default Tab',
  measurementPoints: {},
  order: 0,
  isDeleted: false,
  customerID: ''
};
export const initialMeasurementPoint = {
  id: '',
  type: 1,
  label: '',
  order: 0,
  customerID: '',
  isDeleted: false
};
export const initialMeasurmentPointResult = {
  id: '',
  status: 0,
  temporary: true,
  createDate: '',
  updateDate: '',
  jobID: '',
  notes: '',
  installBaseID: '',
  measurementPointListID: '',
  measurementPointAnswers: []
};

const initialCustomer = {
  id: '',
  name: '',
  isDeleted: false
};
export const initialJob = {
  id: '',
  customerID: '',
  facilityID: '',
  assignedUserID: '',
  jobTypeID: '',
  startDate: '',
  endDate: '',
  status: '',
  customer: initialCustomer
};

/* ********************   DESKTOP ONLY  ***************/
/* 

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
  slideshowPath: '',
  courseLessons: [],
  cost: 0,
  isProtected: false
};

/* initialState */
export default {
  ajaxCallsInProgress: 0,
  user: {
    password: '',
    username: '',
    isAuthenticated: false,
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
    customer: initialCustomer,
    isActive: true
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
    data: {},
    jobTypes: [],
    fseUsers: [],
    showEditJobModal: false,
    tableFilters: initialTableFilters
  },
  manageLocation: {
    totalPages: 1,
    facility: initialFacility,
    visibleLocations: [],
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
    showMPResultModal: false,
    showMPResultHistoryModal: false,
    showMPResultNotes: false,
    totalPages: 1,
    data: [],
    cart: {
      addedIDs: [],
      productsByID: {}
    },
    productInfo: {
      brands: {},
      productTypes: {},
      mainCategories: {},
      powers: {},
      standards: {},
      subcategories: {},
      systemSizes: {},
      brandOptions: [],
      productTypeOptions: [],
      mainCategoryOptions: [],
      powerOptions: [],
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
  manageMeasurementPointLists: {
    totalPages: 1,
    data: {},
    selectedMeasurementPointList: initialMeasurementPointList,
    showEditMeasurementPointListModal: false,
    showEditMeasurementPointModal: false,
    showEditMeasurementPointTabModal: false,
    showEditMeasurementPointListTestProceduresModal: false,
    tableFilters: initialTableFilters,
    selectedTabID: '',
    selectedMeasurementPoint: initialMeasurementPoint
  },
  measurementPointResults: {
    measurementPointResultsByID: {},
    selectedResult: initialMeasurmentPointResult,
    previousResult: initialMeasurmentPointResult,
    historicalResultID: ''
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
