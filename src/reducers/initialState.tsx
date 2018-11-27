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
  kahootPath: ''
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
    showEditQuoteModal: false,
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
    courses: [
      {
        id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
        name: 'Level 1 GrammarFlip Foundations',
        description:
          'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
        isPublished: true,
        createDate: '2018-03-29T19:54:43.8481828',
        updateDate: '2018-07-03T13:28:52.8677053',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca'
      },
      {
        id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
        name: 'Level 2 GrammarFlip Building Blocks',
        description:
          'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
        isPublished: true,
        createDate: '2018-03-29T20:46:01.6985064',
        updateDate: '2018-07-03T13:30:11.0721513',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca'
      },
      {
        id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
        name: 'Level 3 GrammarFlip Advanced Topics',
        description:
          'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
        isPublished: true,
        createDate: '2018-03-29T20:50:09.4787239',
        updateDate: '2018-07-03T13:30:22.2955199',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca'
      }
    ],
    lessons: {},
    lesson: initialLesson,
    quizzes: {},
    quiz: initialQuiz
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
