export const initialOption = { value: '', label: '' };
export const initialTableFilters = { search: '', page: 1 };

export const initialFacility = {
  id: '',
  name: '',
  customerID: '',
  address: '',
  address2: '',
  city: '',
  countryID: '',
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
  isApproved: false,
  quantity: 1,
  mergedProductID: ''
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
export const initialMeasurementPointResultAnswer = {
  measurementPointID: ''
};
export const initialMeasurementPointList = {
  id: '',
  measurementPointTabs: [],
  mainCategoryID: '',
  standardID: '',
  type: 1,
  testProcedures: '',
  isDeleted: false
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
  isDeleted: false,
  isRequired: true,
  showInReport: true,
  allowNotes: true
};
export const initialMeasurmentPointResult = {
  id: '',
  status: 0,
  createDate: '',
  updateDate: '',
  jobID: '',
  notes: '',
  installBaseID: '',
  measurementPointListID: '',
  measurementPointAnswers: [],
  compiledNotes: '',
  manualStatusOverride: false
};

export const initialDefaultReport = {
  id: '',
  reportType: 1,
  defaultCoverLetter: 'testing cover letter'
};
export const initialReport = {
  jobID: '123',
  reportType: 1,
  coverLetter: 'testing cover letter',
  headerLogoPath: ''
};

export const initialCustomer = {
  id: '',
  name: '',
  isDeleted: false,
  facilities: []
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

export const initialBrand = {
  id: '',
  name: '',
  createDate: '',
  updateDate: '',
  creatorID: '',
  updaterID: ''
};

export const initialAlert = {
  id: '',
  title: '',
  text: '',
  type: '',
  imageUrl: '',
  expirationDate: '',
  createDate: '',
  updateDate: '',
  creatorID: '',
  updaterID: ''
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
  questions: []
};
export const intialQuizAnswer = {
  questionID: '',
  answer: '',
  isCorrect: false
};
export const initialQuizAnswers = { show: false, quizAnswers: {} };

export const initialCourse = {
  id: '',
  name: '',
  description: ''
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
export const initialUser = {
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
  phone: '',
  id: '',
  facilities: [],
  customerID: '',
  hasTeamMembers: false,
  customer: initialCustomer,
  isActive: true
};

export const initialQueueObject = {
  id: '',
  user: initialUser
};

/* initialState */
export default {
  ajaxCallsInProgress: 0,
  user: initialUser,
  redirect: {
    redirectToReferrer: false,
    pathname: '/'
  },
  // userQueue: []
  manageUserQueue: {
    totalPages: 1,
    data: [],
    showEditQueueUserModal: false,
    editUserFormValues: {},
    tableFilters: initialTableFilters
  },
  manageUser: {
    totalPages: 1,
    data: [],
    showEditUserModal: false,
    editUserFormValues: {},
    tableFilters: initialTableFilters
  },
  manageJob: {
    totalPages: 1,
    data: {},
    fseUsers: [],
    showEditJobModal: false,
    tableFilters: initialTableFilters,
    jobFormValues: {},
    selectedJobID: ''
  },
  manageBrand: {
    totalPages: 1,
    data: {},
    showEditBrandModal: false,
    tableFilters: initialTableFilters,
    selectedBrandID: ''
  },
  manageAlert: {
    totalPages: 1,
    data: {},
    showEditAlertModal: false,
    tableFilters: initialTableFilters,
    selectedAlertID: '',
    alertFormValues: {}
  },
  manageCustomerAndFacility: {
    totalPages: 1,
    data: {},
    visibleCustomers: [],
    customerFormValues: {},
    facilityFormValues: {},
    showEditCustomerAndFacilityModal: false,
    tableFilters: initialTableFilters,
    selectedCustomerID: '',
    selectedFacilityID: ''
  },
  manageReport: {
    totalPages: 1,
    defaultReportsByID: {},
    selectedReport: initialReport,
    selectedDefaultReportID: '',
    showEditReportModal: false,
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
    showImportInstallModal: false,
    showMPResultModal: false,
    showMPResultHistoryModal: false,
    showMPResultNotesModal: false,
    showMPResultAddModal: false,
    totalPages: 1,
    data: [],
    cart: {
      addedIDs: [],
      productsByID: {}
    },
    tableFilters: initialTableFilters,
    selectedProduct: initialProduct,
    newProducts: {}
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
    courses: {},
    lessons: {},
    lesson: initialLesson,
    quizzes: {},
    quiz: initialQuiz,
    lessonProgress: {},
    purchasedTraining: [],
    quizAnswers: [],
    quizView: {
      quizComplete: false,
      inProgressQuizID: '',
      startTime: ''
    }
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
    measurementPointsByID: {},
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
  customers: {},
  facilities: {},
  showEditCustomerModal: false,
  showEditFacilityModal: false,
  showEditProfileModal: false,
  showSecurityFunctionsModal: false
};

export const emptyTile = {
  icon: '',
  iconType: '',
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
