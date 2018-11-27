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
    lessons: {
      '124c915d-7540-4c2a-b508-04eee50e2d8d': {
        id: '124c915d-7540-4c2a-b508-04eee50e2d8d',
        name: '05 - The Understood You',
        description: '',
        primaryVideoPath: '218477126',
        secondaryVideoPath: '',
        slideshowPath: 'n4JLtVS8e37AuG',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/76cc8d93-9f17-4953-95ee-249e19a35d82.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:33:05.1018299',
        updateDate: '2018-07-03T14:27:14.222219',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '04402759-285f-4eea-b238-3743ea4f2285',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '124c915d-7540-4c2a-b508-04eee50e2d8d',
            order: 3,
            createDate: '2018-07-03T14:27:14.222219',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'a849e906-4fa3-4bdc-8005-4e32d3a9b35c': {
        id: 'a849e906-4fa3-4bdc-8005-4e32d3a9b35c',
        name: '06 - Compound Subjects and Compound Predicates/Verbs',
        description: '',
        primaryVideoPath: '122154292',
        secondaryVideoPath: '',
        slideshowPath: 'cIIwv8lurn69gY',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/01d6abc1-270e-4387-b035-e95153a7c092.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:33:32.2590756',
        updateDate: '2018-07-03T14:28:00.1405084',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '03989235-edd1-4848-9769-122818f45e56',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'a849e906-4fa3-4bdc-8005-4e32d3a9b35c',
            order: 4,
            createDate: '2018-07-03T14:28:00.1405084',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'bf7d1ef3-e941-4a70-a05a-2a1f0aea4e11': {
        id: 'bf7d1ef3-e941-4a70-a05a-2a1f0aea4e11',
        name: '07 - Coordinating Conjunctions',
        description: '',
        primaryVideoPath: '122158905',
        secondaryVideoPath: '',
        slideshowPath: 'yba7pTbVBAJDHE',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/3d749eae-564e-4a72-af78-ca0af87e5bfd.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:33:51.5368109',
        updateDate: '2018-07-03T14:28:12.859506',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '72e0480d-2284-4b34-87ce-7bac2ffd21c2',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'bf7d1ef3-e941-4a70-a05a-2a1f0aea4e11',
            order: 5,
            createDate: '2018-07-03T14:28:12.859506',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'd00970d1-cfdf-470c-9fd2-4aba82029d1f': {
        id: 'd00970d1-cfdf-470c-9fd2-4aba82029d1f',
        name: '08 - Correlative Conjunctions',
        description: '',
        primaryVideoPath: '223954537',
        secondaryVideoPath: '',
        slideshowPath: 'yWsVnroykZhDls',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/198c5322-7cfc-4699-84a5-6fbd1f629ec4.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:34:10.732414',
        updateDate: '2018-07-03T14:29:20.8572942',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '129e29e0-2897-4b08-bebf-faae9971d44a',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'd00970d1-cfdf-470c-9fd2-4aba82029d1f',
            order: 0,
            createDate: '2018-07-03T14:29:20.87291',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '47fe27f3-369e-4b66-9308-e68502a676a8': {
        id: '47fe27f3-369e-4b66-9308-e68502a676a8',
        name: '09 - Compound Subjects Using "Or"',
        description: '',
        primaryVideoPath: '218476970',
        secondaryVideoPath: '',
        slideshowPath: 'fuhKyxE0sh5jG5',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/f31ee56f-77c2-46b1-8c28-2c2218f8e7db.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:34:38.4441353',
        updateDate: '2018-07-03T14:29:37.7407115',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'e0aa417c-98cc-4deb-9d07-fa2e78c7697e',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '47fe27f3-369e-4b66-9308-e68502a676a8',
            order: 0,
            createDate: '2018-07-03T14:29:37.7407115',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'e49a597b-f467-48a6-828f-312ba72a6693': {
        id: 'e49a597b-f467-48a6-828f-312ba72a6693',
        name: '1.1 - Common Nouns and Proper Nouns',
        description: '',
        primaryVideoPath: '16t2cyidq4',
        secondaryVideoPath: 'TEST',
        slideshowPath: 'M9LnpSRyCrvqlO',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/520ca012-e851-4386-ad46-dec9597e2e01.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:21:28.7826911',
        updateDate: '2018-07-03T14:28:27.026907',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '0e35d7aa-2588-4a2c-8025-dc8c5915d535',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'e49a597b-f467-48a6-828f-312ba72a6693',
            order: 31,
            createDate: '2018-07-03T14:28:27.026907',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'd25a044a-3b28-4859-9085-1ba38823118d': {
        id: 'd25a044a-3b28-4859-9085-1ba38823118d',
        name: '1.2 - Capitalization: Basic Rules',
        description: '',
        primaryVideoPath: '220240176',
        secondaryVideoPath: '',
        slideshowPath: 'MtGniNwMvZ0zsN',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/40c75810-90a5-4a98-8415-cbcf5a40c078.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:24:32.6551341',
        updateDate: '2018-07-03T13:42:29.053432',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '1528a1f1-95dd-4599-b98e-d4b6557182ae',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'd25a044a-3b28-4859-9085-1ba38823118d',
            order: 0,
            createDate: '2018-07-03T13:42:29.053432',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'b55cc676-443e-46dc-afdf-b569a8d0be58': {
        id: 'b55cc676-443e-46dc-afdf-b569a8d0be58',
        name: '1.3 - Capitalization: Advanced Rules',
        description: '',
        primaryVideoPath: '220240227',
        secondaryVideoPath: '',
        slideshowPath: 'GFBQYsDbHsYukj',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/3395463d-84e0-4cff-b5bb-9264500769e9.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:30:42.0228003',
        updateDate: '2018-07-03T13:40:54.90576',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'de88cad1-111f-4013-909f-008c4b3102f8',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'b55cc676-443e-46dc-afdf-b569a8d0be58',
            order: 1,
            createDate: '2018-07-03T13:40:54.9213868',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '85b17d31-64c0-4905-bd18-01bfb10a9390': {
        id: '85b17d31-64c0-4905-bd18-01bfb10a9390',
        name: '1.4 - Simple and Complete Subjects and Predicates/Verbs',
        description: '',
        primaryVideoPath: '220240843',
        secondaryVideoPath: '',
        slideshowPath: '7sqc5fN752dxp0',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/276d2227-1853-4a56-93b0-40487fe3fb2e.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:32:31.8551421',
        updateDate: '2018-07-03T13:42:44.9132574',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '14e3a8fe-f5dd-4eb7-bb02-79ba03a1667e',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '85b17d31-64c0-4905-bd18-01bfb10a9390',
            order: 2,
            createDate: '2018-07-03T13:42:44.9132574',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'a9554db6-2ef9-48b5-853b-f3286847de23': {
        id: 'a9554db6-2ef9-48b5-853b-f3286847de23',
        name: '10 - Commas: Items in a Series',
        description: '',
        primaryVideoPath: '122490591',
        secondaryVideoPath: '',
        slideshowPath: 'BxPjMGUiirtTDa',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/14c96b92-348f-449f-be51-949da600c129.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:35:01.2690554',
        updateDate: '2018-03-29T21:02:40.6631699',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '9560ab6b-0731-4f05-bd6a-b129091849ee',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'a9554db6-2ef9-48b5-853b-f3286847de23',
            order: 6,
            createDate: '2018-03-29T21:02:40.6631699',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'f2d18155-e2be-417e-8e0a-050b37df8e7a': {
        id: 'f2d18155-e2be-417e-8e0a-050b37df8e7a',
        name: '11 - Linking Verbs',
        description: '',
        primaryVideoPath: '122163162',
        secondaryVideoPath: '',
        slideshowPath: 'EYeqY5V0TXIQuU',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/6230dcbf-9a46-467c-953d-70300a8113b5.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:35:20.4625336',
        updateDate: '2018-03-29T21:02:47.0538914',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'fb19637c-8668-4c44-9069-8a50eff0bc96',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'f2d18155-e2be-417e-8e0a-050b37df8e7a',
            order: 7,
            createDate: '2018-03-29T21:02:47.0538914',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'fc17edc5-e203-4096-9340-906ccd28cc26': {
        id: 'fc17edc5-e203-4096-9340-906ccd28cc26',
        name: '12 - Verb Phrases',
        description: '',
        primaryVideoPath: '122163163',
        secondaryVideoPath: '',
        slideshowPath: '42BBIiDeOwdWzi',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/27451179-b5e6-40ee-a149-66230ee6c084.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:35:33.2134092',
        updateDate: '2018-03-29T21:02:52.4338952',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '8640e761-beda-449c-a552-0d83e445e106',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'fc17edc5-e203-4096-9340-906ccd28cc26',
            order: 8,
            createDate: '2018-03-29T21:02:52.4338952',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '2d0bd980-033d-4ffe-aed7-ccb845059df3': {
        id: '2d0bd980-033d-4ffe-aed7-ccb845059df3',
        name: '13 - Active Voice vs. Passive Voice',
        description: '',
        primaryVideoPath: '223960110',
        secondaryVideoPath: '',
        slideshowPath: 'ebhAdNKC2m61yy',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/3c0c898a-72b0-4ec1-86ce-59b8ba54b0c6.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:35:54.132642',
        updateDate: '2018-07-03T14:30:17.3999156',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '46a7a82b-4a1b-4877-81a1-e95fd9a74367',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '2d0bd980-033d-4ffe-aed7-ccb845059df3',
            order: 1,
            createDate: '2018-07-03T14:30:17.3999156',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '873aebe5-2fcb-443f-8f53-71b90beb0ba5': {
        id: '873aebe5-2fcb-443f-8f53-71b90beb0ba5',
        name: '14 - Hard to Find Subjects in Questions',
        description: '',
        primaryVideoPath: '223960363',
        secondaryVideoPath: '',
        slideshowPath: 'vWdO9RbxWRo4F2',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/80313d1e-e4a9-4c83-b60c-f44af543bd56.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:36:12.9854531',
        updateDate: '2018-07-03T14:30:26.9868091',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '2142270a-3e0f-45cf-86bc-99be5b28691f',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '873aebe5-2fcb-443f-8f53-71b90beb0ba5',
            order: 2,
            createDate: '2018-07-03T14:30:26.9896131',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '271a5c17-4361-4a6d-a12a-e4cf61230426': {
        id: '271a5c17-4361-4a6d-a12a-e4cf61230426',
        name: '15 - Action Verbs vs. Linking Verbs',
        description: '',
        primaryVideoPath: '124172035',
        secondaryVideoPath: '',
        slideshowPath: 'qA8WFMmLPhV0bd',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/2bc9a60f-81f5-4c9a-9bb0-c57b08e98b79.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:36:35.048563',
        updateDate: '2018-03-29T21:03:13.3724796',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '06c95d05-d42b-441f-8d96-338a42f02426',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '271a5c17-4361-4a6d-a12a-e4cf61230426',
            order: 9,
            createDate: '2018-03-29T21:03:13.3724796',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'cfa5d6e2-f280-49ec-9805-97719ef6779b': {
        id: 'cfa5d6e2-f280-49ec-9805-97719ef6779b',
        name: '16 - Other Linking Verbs',
        description: '',
        primaryVideoPath: '218477085',
        secondaryVideoPath: '',
        slideshowPath: 'MULdgasvgcV62c',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/3dd64271-a299-40ec-87c0-31b485b37512.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:36:51.3071226',
        updateDate: '2018-07-03T14:30:36.1999215',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '6be15eec-6be5-4c55-80f1-e8309437d03c',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'cfa5d6e2-f280-49ec-9805-97719ef6779b',
            order: 3,
            createDate: '2018-07-03T14:30:36.2178709',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '485b8977-75e2-49ec-84f5-483828ed8110': {
        id: '485b8977-75e2-49ec-84f5-483828ed8110',
        name: '17 - Action Verb Phrases vs. Linking Verb Phrases',
        description: '',
        primaryVideoPath: '220243940',
        secondaryVideoPath: '',
        slideshowPath: 'j1KLIajaysHejs',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/cf751680-e037-4b0b-84df-76cd20446427.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:37:11.9485842',
        updateDate: '2018-07-03T14:30:45.9689756',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '9e9ebc04-0554-40ad-9c6c-8bc31463fd9b',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '485b8977-75e2-49ec-84f5-483828ed8110',
            order: 5,
            createDate: '2018-07-03T14:30:45.9689756',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '3d3c75fe-99ef-4aee-8427-e7738d8f9f1b': {
        id: '3d3c75fe-99ef-4aee-8427-e7738d8f9f1b',
        name: '18 - Verb Phrases with Interrupters',
        description: '',
        primaryVideoPath: '220303008',
        secondaryVideoPath: '',
        slideshowPath: 'izEfvplqY6lyga',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/1aa95acd-b809-4be3-a61b-39f10aa988c6.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:37:29.0243092',
        updateDate: '2018-03-29T21:01:43.5927509',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '36459356-beed-4a73-87fe-ad982d8a8c1f',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '3d3c75fe-99ef-4aee-8427-e7738d8f9f1b',
            order: 6,
            createDate: '2018-03-29T21:01:43.5927509',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '9c621b21-4709-4a38-9e15-44cf51a590cf': {
        id: '9c621b21-4709-4a38-9e15-44cf51a590cf',
        name: '19 - Personal Pronouns and Antecedents',
        description: '',
        primaryVideoPath: '224059563',
        secondaryVideoPath: '',
        slideshowPath: 'MJdv0PHo3zjjeN',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/1d608282-786c-46d9-93a8-da8f773f42f6.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:37:46.279026',
        updateDate: '2018-03-29T21:03:22.3206318',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'cc3960dd-9520-4bf9-b78c-a65af096abcb',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '9c621b21-4709-4a38-9e15-44cf51a590cf',
            order: 10,
            createDate: '2018-03-29T21:03:22.3206318',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'ffe1c8a3-633d-4577-9eee-d6ff02b15e8c': {
        id: 'ffe1c8a3-633d-4577-9eee-d6ff02b15e8c',
        name: '20 - Common Adjectives',
        description: '',
        primaryVideoPath: '223960611',
        secondaryVideoPath: '',
        slideshowPath: '7zLPr6Tzt9Smeo',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/08604e84-b63a-4b6b-ac61-0ad5f62638e5.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:37:59.7371381',
        updateDate: '2018-03-29T21:03:28.3372015',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '9e0a7834-d471-41d6-961d-2b0ed1effa0a',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'ffe1c8a3-633d-4577-9eee-d6ff02b15e8c',
            order: 11,
            createDate: '2018-03-29T21:03:28.3372015',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '88e247a5-5e04-49bf-ae1e-731a5f493c75': {
        id: '88e247a5-5e04-49bf-ae1e-731a5f493c75',
        name: '21 - Hyphens',
        description: '',
        primaryVideoPath: '220243369',
        secondaryVideoPath: '',
        slideshowPath: 'voKOhCuG3wF8Fo',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/b224e085-1547-41fe-b1d6-1f388a281d40.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:38:12.0201159',
        updateDate: '2018-03-29T21:03:34.7209827',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '7d908ade-619f-48a6-9e0a-ad230fe2e1d0',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '88e247a5-5e04-49bf-ae1e-731a5f493c75',
            order: 12,
            createDate: '2018-03-29T21:03:34.7209827',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '078629c0-b367-489e-9382-54c00f3bcb8b': {
        id: '078629c0-b367-489e-9382-54c00f3bcb8b',
        name: '22 - Commas: Between Two Adjectives',
        description: '',
        primaryVideoPath: '224069272',
        secondaryVideoPath: '',
        slideshowPath: '9pAEXSFoNWlKcA',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/8a255644-0315-497c-8211-547da43fe7fb.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:38:29.7840284',
        updateDate: '2018-03-29T21:01:36.3066964',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '870c8356-d602-4aab-a66b-e24031a99c0f',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '078629c0-b367-489e-9382-54c00f3bcb8b',
            order: 7,
            createDate: '2018-03-29T21:01:36.3066964',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '52972282-48e8-479a-893d-2652bbeb4ea2': {
        id: '52972282-48e8-479a-893d-2652bbeb4ea2',
        name: '23 - Proper Adjectives',
        description: '',
        primaryVideoPath: '223960850',
        secondaryVideoPath: '',
        slideshowPath: '5kT3gwQj9tHmAu',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/60437f98-353e-473a-9678-91c9348ceb3f.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:38:45.0620898',
        updateDate: '2018-03-29T21:03:41.7796573',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '8ce2af23-1eda-4a34-a303-3563c6bf134d',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '52972282-48e8-479a-893d-2652bbeb4ea2',
            order: 13,
            createDate: '2018-03-29T21:03:41.7796573',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'b80d8676-edfb-47aa-bd99-464f433218b2': {
        id: 'b80d8676-edfb-47aa-bd99-464f433218b2',
        name: '24 - Nouns Functioning as Adjectives',
        description: '',
        primaryVideoPath: '220301286',
        secondaryVideoPath: '',
        slideshowPath: 'zIi4EqVuz7kpwD',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/c9c8e54e-181f-4bf1-96bc-acfa2d1d4988.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:39:03.9939767',
        updateDate: '2018-03-29T21:01:28.2180565',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '3619eb27-feec-46f1-a81d-699e69f28f57',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'b80d8676-edfb-47aa-bd99-464f433218b2',
            order: 8,
            createDate: '2018-03-29T21:01:28.2180565',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '119e54d5-936c-48b5-bf48-4f3c9d289c2d': {
        id: '119e54d5-936c-48b5-bf48-4f3c9d289c2d',
        name: '25 - Demonstrative Adjectives and Demonstrative Pronouns',
        description: '',
        primaryVideoPath: '224061375',
        secondaryVideoPath: '',
        slideshowPath: '3xtV7KGpqkbwPX',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/21665f15-7812-41cd-a80b-3005850c32e0.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:39:27.9019792',
        updateDate: '2018-03-29T21:01:20.726746',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '2dc13acc-3486-4f48-861f-441c4f63e22a',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '119e54d5-936c-48b5-bf48-4f3c9d289c2d',
            order: 9,
            createDate: '2018-03-29T21:01:20.726746',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '562198d6-45c2-4755-bb38-c979d7fa6835': {
        id: '562198d6-45c2-4755-bb38-c979d7fa6835',
        name: '26 - Apostrophes: Basic Rules',
        description: '',
        primaryVideoPath: '123514117',
        secondaryVideoPath: '',
        slideshowPath: 'tUo0ZVnboTR37C',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/c57efed0-8948-4838-a33e-838558b6029b.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:39:45.0196936',
        updateDate: '2018-03-29T21:03:50.1425288',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '0ac9351c-2fba-4935-8a63-d674e36c4781',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '562198d6-45c2-4755-bb38-c979d7fa6835',
            order: 14,
            createDate: '2018-03-29T21:03:50.1425288',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '9151362c-8eee-41d7-8d2a-0d9f0be16143': {
        id: '9151362c-8eee-41d7-8d2a-0d9f0be16143',
        name: '27 - Apostrophes: Joint vs. Individual Ownership',
        description: '',
        primaryVideoPath: '220241748',
        secondaryVideoPath: '',
        slideshowPath: 'cVjuCGCY6QZHRe',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/64b62563-5358-4c36-8bc5-824d77967d75.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:40:10.4326731',
        updateDate: '2018-05-19T11:14:35.9693135',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'c050604c-b9ad-4725-bb41-760699d1e59f',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '9151362c-8eee-41d7-8d2a-0d9f0be16143',
            order: 2,
            createDate: '2018-05-19T11:14:35.9849367',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '113b682a-4505-480e-a945-93dae0c74e0d': {
        id: '113b682a-4505-480e-a945-93dae0c74e0d',
        name: '28 - Possessive Adjectives and Possessive Pronouns',
        description: '',
        primaryVideoPath: '123514118',
        secondaryVideoPath: '',
        slideshowPath: 'NRzNP5YDyGX5E6',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/acbe3579-a0ee-4c6e-90ea-7cd7ff28d775.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:40:32.13173',
        updateDate: '2018-03-29T21:01:12.9089057',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'd38143c3-ee11-419e-88d4-9173961dc545',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '113b682a-4505-480e-a945-93dae0c74e0d',
            order: 10,
            createDate: '2018-03-29T21:01:12.9089057',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '1ed7b724-27aa-42dd-8e3f-061c77048e6f': {
        id: '1ed7b724-27aa-42dd-8e3f-061c77048e6f',
        name: '29 - Common Homophones',
        description: '',
        primaryVideoPath: '223961056',
        secondaryVideoPath: '',
        slideshowPath: 'sttLGSn37Kz5Mb',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/0830bed4-d00d-43c0-b5a4-9f6dd7256a74.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:40:48.353551',
        updateDate: '2018-03-29T21:03:56.1754504',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '1d63a78a-df3f-40a6-a1dd-81ffd6586d87',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '1ed7b724-27aa-42dd-8e3f-061c77048e6f',
            order: 15,
            createDate: '2018-03-29T21:03:56.1910807',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'ff68352b-a0d0-4ef4-8193-79e4eb3f72c2': {
        id: 'ff68352b-a0d0-4ef4-8193-79e4eb3f72c2',
        name: '30 - Commonly Confused Pairs',
        description: '',
        primaryVideoPath: '223961255',
        secondaryVideoPath: '',
        slideshowPath: '62GHzIDfGkU8uH',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/77c2dfe2-ff42-413a-a444-306b68f1eb6a.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:41:07.952998',
        updateDate: '2018-03-29T21:04:44.9986991',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'f0f84dd2-712f-44dd-914c-ac4ae9bd8973',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'ff68352b-a0d0-4ef4-8193-79e4eb3f72c2',
            order: 16,
            createDate: '2018-03-29T21:04:44.9986991',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '548901a3-3061-44c3-8abe-261348eb52f4': {
        id: '548901a3-3061-44c3-8abe-261348eb52f4',
        name: '31 - Adverbs Modifying Verbs',
        description: '',
        primaryVideoPath: '124056816',
        secondaryVideoPath: '',
        slideshowPath: '6mWTm2JekoH8kY',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/7e7c0f60-d669-412a-8070-bdacf8325d96.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:41:24.9426139',
        updateDate: '2018-04-10T19:00:47.1991314',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '22eec163-beb3-472b-be7c-fd32bf93cde7',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '548901a3-3061-44c3-8abe-261348eb52f4',
            order: 17,
            createDate: '2018-04-10T19:00:47.292882',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'a1b5c04d-78a5-483a-9b92-55f3a8316c25': {
        id: 'a1b5c04d-78a5-483a-9b92-55f3a8316c25',
        name: '32 - Adverbs Modifying Adjectives',
        description: '',
        primaryVideoPath: '124057040',
        secondaryVideoPath: '',
        slideshowPath: 'H1H2lKCvR178Oo',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/d3b1ecf6-2913-4e78-81ad-2dd2c4986376.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:41:39.9962353',
        updateDate: '2018-04-10T19:01:01.6593356',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'f5b6872b-f719-42b6-ae10-d7e4480813ea',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'a1b5c04d-78a5-483a-9b92-55f3a8316c25',
            order: 11,
            createDate: '2018-04-10T19:01:01.6593356',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '7a318461-0b2f-4458-b628-c25c0ab61bd2': {
        id: '7a318461-0b2f-4458-b628-c25c0ab61bd2',
        name: '33 - Adverbs Modifying Other Adverbs',
        description: '',
        primaryVideoPath: '124057041',
        secondaryVideoPath: '',
        slideshowPath: '3rwGJ9pa9bU5L',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/7395da54-80c0-4077-bc79-cb7e59920af1.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:42:00.1668687',
        updateDate: '2018-04-10T19:01:09.9536657',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'c7e5293c-a020-49f9-9d16-c3c0bf8068e9',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '7a318461-0b2f-4458-b628-c25c0ab61bd2',
            order: 12,
            createDate: '2018-04-10T19:01:09.9536657',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'd1f9acde-5425-4724-9fa9-bf12c5aeda16': {
        id: 'd1f9acde-5425-4724-9fa9-bf12c5aeda16',
        name: "34 - Hard to Find Subjects ('Here' and 'There')",
        description: '',
        primaryVideoPath: '220243141',
        secondaryVideoPath: '',
        slideshowPath: 'cRgxe0ShaOwnCJ',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/1f3964bf-4ccd-4114-81a0-5e4cee1ec755.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:42:29.1500479',
        updateDate: '2018-04-10T19:01:16.5687363',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '135ff812-2fe8-4bda-90bb-ef805510496a',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'd1f9acde-5425-4724-9fa9-bf12c5aeda16',
            order: 13,
            createDate: '2018-04-10T19:01:16.5687363',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'df206881-391b-48be-bffa-d4efff7df78b': {
        id: 'df206881-391b-48be-bffa-d4efff7df78b',
        name: '35 - Quotation Marks in Dialogue',
        description: '',
        primaryVideoPath: '124057043',
        secondaryVideoPath: '',
        slideshowPath: 'anESH4p66aZ4Iz',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/15b9c7eb-0ac6-4d5b-983c-4efb61e07784.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:42:48.4439724',
        updateDate: '2018-04-10T19:01:24.9790852',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '0113b874-3e3a-4576-b39a-447ad0c17998',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'df206881-391b-48be-bffa-d4efff7df78b',
            order: 14,
            createDate: '2018-04-10T19:01:24.9790852',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '2c5d3ae3-0c00-4cbd-b0cb-969a8ef93d0d': {
        id: '2c5d3ae3-0c00-4cbd-b0cb-969a8ef93d0d',
        name: '36 - Quotation Marks vs. Italics',
        description: '',
        primaryVideoPath: '220243554',
        secondaryVideoPath: '',
        slideshowPath: '4fM3lmRhgwQOcF',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/bd1d536a-259d-46c8-b7b8-8751458a6c7a.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:43:11.003577',
        updateDate: '2018-04-10T19:01:31.4539794',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '895ed5f5-3999-4749-a58a-96ebc6794484',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '2c5d3ae3-0c00-4cbd-b0cb-969a8ef93d0d',
            order: 18,
            createDate: '2018-04-10T19:01:31.4539794',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '04c5ff40-a68e-4940-ad8e-948dbab7e1c1': {
        id: '04c5ff40-a68e-4940-ad8e-948dbab7e1c1',
        name: '37 - Prepositions',
        description: '',
        primaryVideoPath: '224070003',
        secondaryVideoPath: '',
        slideshowPath: '1lB8F9TPOcgroH',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/6c38f2b4-7adb-4c88-8ced-255d24648e9f.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:43:24.3094211',
        updateDate: '2018-04-10T19:01:40.3451489',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '84022e81-7e0d-4875-9c74-88e793f22e71',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '04c5ff40-a68e-4940-ad8e-948dbab7e1c1',
            order: 19,
            createDate: '2018-04-10T19:01:40.3451489',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '293a2a9b-4517-4f54-9a4b-8315d191a332': {
        id: '293a2a9b-4517-4f54-9a4b-8315d191a332',
        name: '38 - Objects of Prepositions',
        description: '',
        primaryVideoPath: '224070246',
        secondaryVideoPath: '',
        slideshowPath: 'wwmwAm9EdX7mOB',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/cef3d709-76d6-4e32-aa40-b22b39073690.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:43:39.0989608',
        updateDate: '2018-04-10T19:01:49.5318821',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'e290da2a-169e-4d70-b731-1c04c6e8feda',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '293a2a9b-4517-4f54-9a4b-8315d191a332',
            order: 20,
            createDate: '2018-04-10T19:01:49.5318821',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '838bd1cb-1bfb-4ee0-9998-f08ea08d8062': {
        id: '838bd1cb-1bfb-4ee0-9998-f08ea08d8062',
        name: '39 - Prepositional Phrases',
        description: '',
        primaryVideoPath: '224070460',
        secondaryVideoPath: '',
        slideshowPath: 'jhZ3uEP6SpbbTZ',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/ec7e4007-0e42-49f8-9eb9-ef23745945a8.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:43:57.4981203',
        updateDate: '2018-04-10T19:01:55.4552816',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '33650c29-a9a0-4e1d-bcae-c320bcfeeece',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '838bd1cb-1bfb-4ee0-9998-f08ea08d8062',
            order: 21,
            createDate: '2018-04-10T19:01:55.4552816',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '7a2bdda7-5c4e-42e2-b60c-09d9517bcc4b': {
        id: '7a2bdda7-5c4e-42e2-b60c-09d9517bcc4b',
        name: '40 - Misplaced Modifiers: Part 1 (Words and Phrases)',
        description: '',
        primaryVideoPath: '220300719',
        secondaryVideoPath: '',
        slideshowPath: '946qHDdukbV4n',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/1d396e6e-8faf-4919-968d-0c6e2fcad175.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:44:21.2958906',
        updateDate: '2018-04-10T19:02:08.9379774',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '2ca76e42-01ea-4c4e-b97e-331b4b3f6957',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '7a2bdda7-5c4e-42e2-b60c-09d9517bcc4b',
            order: 3,
            createDate: '2018-04-10T19:02:08.9379774',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'f51f1fb5-e170-41d2-91d9-25b31acf0fa2': {
        id: 'f51f1fb5-e170-41d2-91d9-25b31acf0fa2',
        name: '41 - Prepositional Phrases Functioning as Adjective Phrases',
        description: '',
        primaryVideoPath: '224061891',
        secondaryVideoPath: '',
        slideshowPath: 'DRUL5cHdNZSuWt',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/87e0a8ae-2b3a-4541-ad89-7d6b1c41c15f.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:44:49.3610375',
        updateDate: '2018-04-10T19:02:15.3943357',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '22c531b8-4bb7-47d2-9e39-c48ae5407e5e',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'f51f1fb5-e170-41d2-91d9-25b31acf0fa2',
            order: 4,
            createDate: '2018-04-10T19:02:15.3943357',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'b3b42da9-836b-4988-84e8-2d92a996da01': {
        id: 'b3b42da9-836b-4988-84e8-2d92a996da01',
        name: '42 - Prepositional Phrases Functioning as Adverb Phrases',
        description: '',
        primaryVideoPath: '224062440',
        secondaryVideoPath: '',
        slideshowPath: 'ezH3BV5Yk0cVRT',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/26e2a5e3-5707-40f0-ad40-bc829b6f1890.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:45:08.8802717',
        updateDate: '2018-04-10T19:02:21.8942888',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '3bbb1d63-0557-4d9c-9caf-3639057f9fb6',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'b3b42da9-836b-4988-84e8-2d92a996da01',
            order: 5,
            createDate: '2018-04-10T19:02:21.8942888',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '023fa332-77b7-46e5-8d4a-31d70447f2e3': {
        id: '023fa332-77b7-46e5-8d4a-31d70447f2e3',
        name: '43 - Subject/Verb Agreement',
        description: '',
        primaryVideoPath: '220302663',
        secondaryVideoPath: '',
        slideshowPath: '8Y8jcUkEV4KI6o',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/34adc691-b240-4b49-b011-0f607a6cfc68.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:45:24.5878499',
        updateDate: '2018-04-10T19:02:27.172593',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'd40642b3-e8fc-4e41-8c57-38273565c966',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '023fa332-77b7-46e5-8d4a-31d70447f2e3',
            order: 22,
            createDate: '2018-04-10T19:02:27.172593',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '6a38d9d6-75cb-4d71-a2b9-1af5952a4a3c': {
        id: '6a38d9d6-75cb-4d71-a2b9-1af5952a4a3c',
        name: '44 - Transitive and Intransitive Verbs',
        description: '',
        primaryVideoPath: '124059735',
        secondaryVideoPath: '',
        slideshowPath: 'edwma6UNPMwzzc',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/f846aa84-8745-4179-9d51-6b59cf013f05.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:46:12.9853707',
        updateDate: '2018-04-10T19:02:32.578882',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '0350ded7-4964-4c41-9565-92be829fa3b8',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '6a38d9d6-75cb-4d71-a2b9-1af5952a4a3c',
            order: 15,
            createDate: '2018-04-10T19:02:32.578882',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '496935b7-332f-44d6-8801-fae1b73dfe21': {
        id: '496935b7-332f-44d6-8801-fae1b73dfe21',
        name: '45 - Direct Objects',
        description: '',
        primaryVideoPath: '124059738',
        secondaryVideoPath: '',
        slideshowPath: 'h68oHDRMO3vJmU',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/a68f2f3c-6332-4808-848f-1bfb7c58e27d.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:46:27.1407488',
        updateDate: '2018-04-10T19:02:38.2522583',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '16d70250-1b3a-4d45-a319-bb0fc7f84f03',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '496935b7-332f-44d6-8801-fae1b73dfe21',
            order: 16,
            createDate: '2018-04-10T19:02:38.2522583',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '05a3ba14-f99c-4eca-aeca-d6bac3f510ff': {
        id: '05a3ba14-f99c-4eca-aeca-d6bac3f510ff',
        name: '46 - Indirect Objects',
        description: '',
        primaryVideoPath: '124059739',
        secondaryVideoPath: '',
        slideshowPath: 'jqmRliwntc8GV7',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/5ff1b860-4dba-49fe-806d-13211a357d44.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:46:38.3293354',
        updateDate: '2018-04-10T19:02:45.0272293',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '6ea8da47-0fa1-4f38-bc0c-625bfdbba144',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '05a3ba14-f99c-4eca-aeca-d6bac3f510ff',
            order: 17,
            createDate: '2018-04-10T19:02:45.0272293',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '7a3ef918-5bea-4168-b8da-776653331c85': {
        id: '7a3ef918-5bea-4168-b8da-776653331c85',
        name: '47 - Objective Complements',
        description: '',
        primaryVideoPath: '220301766',
        secondaryVideoPath: '',
        slideshowPath: '48wFLp5JgQPKpb',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/d63a5d77-b9d1-433b-adcd-42d62484d343.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:46:55.0269727',
        updateDate: '2018-04-10T19:02:52.6394688',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '3fa63fce-1c64-41bb-ba61-bddc4298688e',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '7a3ef918-5bea-4168-b8da-776653331c85',
            order: 6,
            createDate: '2018-04-10T19:02:52.6394688',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '6beafd18-1e7b-4e7e-8663-612a7566ca53': {
        id: '6beafd18-1e7b-4e7e-8663-612a7566ca53',
        name: '48 - Subject Complements',
        description: '',
        primaryVideoPath: '124059741',
        secondaryVideoPath: '',
        slideshowPath: '1riQgztmi9lMDD',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/7290aaaf-7fd4-4a39-86cf-1a9c9b0d2978.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:47:10.1850684',
        updateDate: '2018-04-10T19:02:59.0731111',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '96b687ad-0db3-466f-90b8-e0d3ec750c21',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '6beafd18-1e7b-4e7e-8663-612a7566ca53',
            order: 18,
            createDate: '2018-04-10T19:02:59.0731111',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '7c34781a-9062-4cd9-a19c-6d0f9c95d4ed': {
        id: '7c34781a-9062-4cd9-a19c-6d0f9c95d4ed',
        name: '49 - Nominative Case Pronouns',
        description: '',
        primaryVideoPath: '224063459',
        secondaryVideoPath: '',
        slideshowPath: '8x0B80dj7ra93',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/f3f4844a-917c-4af4-a55f-0d51d30ccec0.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:47:26.794523',
        updateDate: '2018-04-10T19:03:04.9924749',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '9863bc62-38af-4a0c-b679-0236b1890483',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '7c34781a-9062-4cd9-a19c-6d0f9c95d4ed',
            order: 19,
            createDate: '2018-04-10T19:03:04.9924749',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'a89e97fc-a42e-49bd-a462-f448db7a6cd5': {
        id: 'a89e97fc-a42e-49bd-a462-f448db7a6cd5',
        name: '50 - Objective Case Pronouns',
        description: '',
        primaryVideoPath: '224063719',
        secondaryVideoPath: '',
        slideshowPath: 'iuCtedxz5MNQj1',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/2f66ab0c-809a-4c31-ab58-84c9acbe2400.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:47:41.3703075',
        updateDate: '2018-04-10T19:03:10.2933638',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '63c8a263-fcac-4f64-90a9-2a5035b7e3be',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'a89e97fc-a42e-49bd-a462-f448db7a6cd5',
            order: 20,
            createDate: '2018-04-10T19:03:10.2933638',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'e2bd2773-0127-42cc-9d7c-c4073e80fae5': {
        id: 'e2bd2773-0127-42cc-9d7c-c4073e80fae5',
        name: '51 - Possessive Case Pronouns',
        description: '',
        primaryVideoPath: '224063947',
        secondaryVideoPath: '',
        slideshowPath: 'FZz3SpO7a22ody',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/13ad15e9-f055-4431-aae0-9b78851273ff.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:47:55.7570646',
        updateDate: '2018-04-10T19:03:16.1386466',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '3018f89e-46f9-4e57-ad22-343376cac5f0',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'e2bd2773-0127-42cc-9d7c-c4073e80fae5',
            order: 21,
            createDate: '2018-04-10T19:03:16.1386466',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'f76f44f5-c6cb-423f-ae54-4c17268ea315': {
        id: 'f76f44f5-c6cb-423f-ae54-4c17268ea315',
        name: '52 - Reflexive Pronouns',
        description: '',
        primaryVideoPath: '223961466',
        secondaryVideoPath: '',
        slideshowPath: 'nMVx4ZPDvjToR2',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/57e81ef1-e96f-4016-8b3f-dc1bb2457cd3.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:48:10.2789244',
        updateDate: '2018-04-10T19:03:22.17248',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '7f2b6b22-87c6-4e1d-91f9-9e796d24c6da',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'f76f44f5-c6cb-423f-ae54-4c17268ea315',
            order: 7,
            createDate: '2018-04-10T19:03:22.17248',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'c42363f6-7b15-4777-bdfd-deb38cd77753': {
        id: 'c42363f6-7b15-4777-bdfd-deb38cd77753',
        name: '53 - Intensive Pronouns',
        description: '',
        primaryVideoPath: '223961641',
        secondaryVideoPath: '',
        slideshowPath: 'e23HPNMp2yJo4m',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/744a325a-3fba-40cf-a442-ca2666c67321.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:48:51.9968986',
        updateDate: '2018-04-10T19:03:28.3962234',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '915e4ee2-a8fd-448f-996a-203a33073bef',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'c42363f6-7b15-4777-bdfd-deb38cd77753',
            order: 8,
            createDate: '2018-04-10T19:03:28.3962234',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '0fb86407-f2f8-4e05-b56f-8c296ed13e0e': {
        id: '0fb86407-f2f8-4e05-b56f-8c296ed13e0e',
        name: '54 - Interrogative Pronouns vs. Interrogative Adjectives',
        description: '',
        primaryVideoPath: '124060642',
        secondaryVideoPath: '',
        slideshowPath: 'wzy0fGy8OWyGEY',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/14ec072c-8164-4450-ad10-e554471ee1d0.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:49:14.9108519',
        updateDate: '2018-04-10T19:03:41.3155476',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '328e0b9b-b4ec-477f-b883-8ac163c65238',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '0fb86407-f2f8-4e05-b56f-8c296ed13e0e',
            order: 9,
            createDate: '2018-04-10T19:03:41.3312288',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '22084de5-c00c-49b6-9ae2-f90e9cc36524': {
        id: '22084de5-c00c-49b6-9ae2-f90e9cc36524',
        name: '55 - Indefinite Pronouns vs. Indefinite Adjectives',
        description: '',
        primaryVideoPath: '124060643',
        secondaryVideoPath: '',
        slideshowPath: 'qWPsZlVtgImPWR',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/ecea631b-1302-4ce1-95d2-402b7565ea72.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:49:48.8088579',
        updateDate: '2018-04-10T19:03:47.9865813',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '27728e79-991b-4f26-a5bd-feeaa8eb3154',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '22084de5-c00c-49b6-9ae2-f90e9cc36524',
            order: 10,
            createDate: '2018-04-10T19:03:47.9865813',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'cc3fe909-92e0-439d-8ad2-753efd76c606': {
        id: 'cc3fe909-92e0-439d-8ad2-753efd76c606',
        name: '56 - Interjections',
        description: '',
        primaryVideoPath: '220241127',
        secondaryVideoPath: '',
        slideshowPath: 'aIkYZp3EKkg3CW',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/840943b1-bb74-447f-96b6-2e14edbff548.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:50:01.8480902',
        updateDate: '2018-04-10T19:03:53.9655512',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '1a1bd70c-64c0-486c-94d0-d77afcb7cf6a',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'cc3fe909-92e0-439d-8ad2-753efd76c606',
            order: 23,
            createDate: '2018-04-10T19:03:53.9655512',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'd74fada8-2078-4a5c-a178-30286619ab4b': {
        id: 'd74fada8-2078-4a5c-a178-30286619ab4b',
        name: '57 - Parts of Speech vs. Parts of the Sentence',
        description: '',
        primaryVideoPath: '224064298',
        secondaryVideoPath: '',
        slideshowPath: '2o5yW0kUQx5AwN',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/c7732314-39eb-492f-ab26-02143d249a56.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:50:24.1073614',
        updateDate: '2018-04-10T19:04:00.130366',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'c47437bf-2c94-4d8d-9000-cae5c10b3339',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'd74fada8-2078-4a5c-a178-30286619ab4b',
            order: 24,
            createDate: '2018-04-10T19:04:00.130366',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '47debadb-c97a-4935-8405-80af4713f328': {
        id: '47debadb-c97a-4935-8405-80af4713f328',
        name: '58 - Phrases Defined',
        description: '',
        primaryVideoPath: '124063795',
        secondaryVideoPath: '',
        slideshowPath: 'rB5Z2x6X8guezm',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/fb7cf9e1-a4f2-4be7-9472-31f30b92dc4f.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:50:38.7745009',
        updateDate: '2018-04-10T19:04:07.3514423',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'dee9cf90-3e97-4b3d-bc9a-ccc334201d8c',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '47debadb-c97a-4935-8405-80af4713f328',
            order: 22,
            createDate: '2018-04-10T19:04:07.3514423',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '96143de0-1a65-45a8-a2e3-6e58d5691011': {
        id: '96143de0-1a65-45a8-a2e3-6e58d5691011',
        name: '59 - Appositive Phrases',
        description: '',
        primaryVideoPath: '124063797',
        secondaryVideoPath: '',
        slideshowPath: 'mxd1KH89iMN2ks',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/586d4a55-82ad-4f87-a1df-2983d2939751.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:50:55.0012997',
        updateDate: '2018-04-10T19:04:12.2887904',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '191b1fa2-9e62-49b0-9747-347a3381557a',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '96143de0-1a65-45a8-a2e3-6e58d5691011',
            order: 23,
            createDate: '2018-04-10T19:04:12.2887904',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'c02ecfde-0127-4207-bd63-111d11b4ec2d': {
        id: 'c02ecfde-0127-4207-bd63-111d11b4ec2d',
        name: '60 - Commas: Essential and Non-Essential Elements',
        description: '',
        primaryVideoPath: '220242486',
        secondaryVideoPath: '',
        slideshowPath: 'q6C1sY28g4RFBd',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/caad52d6-b400-4112-8656-49bac6c6685c.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:51:21.121087',
        updateDate: '2018-04-10T19:04:17.780192',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'e9e41f83-fac0-4d9e-b12f-cd04983f1c6a',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'c02ecfde-0127-4207-bd63-111d11b4ec2d',
            order: 24,
            createDate: '2018-04-10T19:04:17.780192',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '78d29476-ee6f-49bf-a786-64a6377802be': {
        id: '78d29476-ee6f-49bf-a786-64a6377802be',
        name: '61 - Dashes',
        description: '',
        primaryVideoPath: '224315374',
        secondaryVideoPath: '',
        slideshowPath: 'NbVZIhZRQE4ya',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/b7deaf8d-9adf-4cb8-9991-d3c2862af7c8.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:51:34.862563',
        updateDate: '2018-04-10T19:04:29.1296195',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '27622413-7d6c-4745-a147-07e8c796aca8',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '78d29476-ee6f-49bf-a786-64a6377802be',
            order: 25,
            createDate: '2018-04-10T19:04:29.1296195',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'afcef363-2d0e-42a5-b486-4cafd1ace2ed': {
        id: 'afcef363-2d0e-42a5-b486-4cafd1ace2ed',
        name: '62 - Parentheses',
        description: '',
        primaryVideoPath: '224315402',
        secondaryVideoPath: '',
        slideshowPath: '2De5pEfbnIeSOO',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/a62dc42b-aefb-4610-b5a7-9b0c6a92c45d.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:51:45.757227',
        updateDate: '2018-04-10T19:04:35.1074777',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'a42b5f88-d41c-4bb4-b9ff-08a365bf6d9c',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'afcef363-2d0e-42a5-b486-4cafd1ace2ed',
            order: 26,
            createDate: '2018-04-10T19:04:35.1074777',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '4fe6fc31-f4bb-4168-84dd-c0ba6ee2a9c2': {
        id: '4fe6fc31-f4bb-4168-84dd-c0ba6ee2a9c2',
        name: '63 - Clauses Defined',
        description: '',
        primaryVideoPath: '224066757',
        secondaryVideoPath: '',
        slideshowPath: 'ABkQX60uJ7GHvm',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/b3a9a978-cb86-4773-99a8-a96aae10a4c0.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:52:05.7962662',
        updateDate: '2018-04-10T19:04:46.6781712',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '7fe57833-265b-4c09-a5d1-fbc77c265fba',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '4fe6fc31-f4bb-4168-84dd-c0ba6ee2a9c2',
            order: 25,
            createDate: '2018-04-10T19:04:46.6781712',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '15f11c71-ccbe-4ae9-9f3d-619b278e446b': {
        id: '15f11c71-ccbe-4ae9-9f3d-619b278e446b',
        name: '64 - Independent Clauses',
        description: '',
        primaryVideoPath: '220300507',
        secondaryVideoPath: '',
        slideshowPath: '4hefFT4KI7LPLn',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/2e6cb6ff-2524-4d96-bbf2-8af2c938e405.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:52:22.3270479',
        updateDate: '2018-04-10T19:04:51.7319646',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '99ec5431-b650-48f9-91ec-4d7437be1bec',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '15f11c71-ccbe-4ae9-9f3d-619b278e446b',
            order: 26,
            createDate: '2018-04-10T19:04:51.7319646',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'e0180ffe-e6e5-4736-9ab9-68c023873134': {
        id: 'e0180ffe-e6e5-4736-9ab9-68c023873134',
        name: '65 - Subordinating Conjunctions',
        description: '',
        primaryVideoPath: '224067124',
        secondaryVideoPath: '',
        slideshowPath: 'qMis7gHxbjxo7q',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/197736c3-153a-409e-94bb-061b3f89bb98.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:52:38.8991928',
        updateDate: '2018-04-10T19:04:57.3522997',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '91de20c8-00be-4f82-9f25-c88686169056',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'e0180ffe-e6e5-4736-9ab9-68c023873134',
            order: 27,
            createDate: '2018-04-10T19:04:57.3522997',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '160dcd63-d067-4691-8d7f-f7d7883acdcb': {
        id: '160dcd63-d067-4691-8d7f-f7d7883acdcb',
        name: '66 - Dependent/Subordinate Clauses',
        description: '',
        primaryVideoPath: '220242921',
        secondaryVideoPath: '',
        slideshowPath: 'GQJZfYVTskIZQN',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/ddaba06a-fc8c-4955-9754-f8f5ae9c407b.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:52:54.2871242',
        updateDate: '2018-04-10T19:05:02.7939046',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '32a35fb5-50c0-4e50-a20e-30e963ce23b1',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '160dcd63-d067-4691-8d7f-f7d7883acdcb',
            order: 28,
            createDate: '2018-04-10T19:05:02.7939046',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '6d013961-bf8b-4f4e-aec7-8c88abcaad3a': {
        id: '6d013961-bf8b-4f4e-aec7-8c88abcaad3a',
        name: '67 - Simple and Compound Sentences',
        description: '',
        primaryVideoPath: '124064281',
        secondaryVideoPath: '',
        slideshowPath: 'w1GEZiIfEVsDrr',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/ebbab241-c15f-48f1-8405-e738da41db06.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:53:14.126516',
        updateDate: '2018-04-10T19:05:07.6073255',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'e604796e-7531-428f-be63-ebc33c71a43d',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '6d013961-bf8b-4f4e-aec7-8c88abcaad3a',
            order: 29,
            createDate: '2018-04-10T19:05:07.6073255',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '24ff357d-47dd-4e81-8fb5-9923bcaa0479': {
        id: '24ff357d-47dd-4e81-8fb5-9923bcaa0479',
        name: '68 - Semicolons: Between Independent Clauses',
        description: '',
        primaryVideoPath: '124064283',
        secondaryVideoPath: '',
        slideshowPath: 'x4JG6fC2GNB9nm',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/d539187a-2b67-4b9a-a1a1-440ac60711b2.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:53:44.5727554',
        updateDate: '2018-04-10T19:05:12.9086356',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'af6ca03d-52c0-4344-b2c9-4f5f645707a2',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: '24ff357d-47dd-4e81-8fb5-9923bcaa0479',
            order: 30,
            createDate: '2018-04-10T19:05:12.9086356',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '10994d96-3f0a-4cfd-aa0e-17a78b953da1': {
        id: '10994d96-3f0a-4cfd-aa0e-17a78b953da1',
        name: '69 - Conjunctive Adverbs',
        description: '',
        primaryVideoPath: '220242742',
        secondaryVideoPath: '',
        slideshowPath: 'gGzHEYSo5XKgPc',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/6522c97f-3a2d-43a7-a28d-c01dbf7c33fc.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:53:57.0100132',
        updateDate: '2018-04-10T19:05:19.5584952',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '59688cfc-917a-4fd4-a68b-f0a81863b3b5',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '10994d96-3f0a-4cfd-aa0e-17a78b953da1',
            order: 11,
            createDate: '2018-04-10T19:05:19.5584952',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'f09466c3-a339-417c-ac43-a2d17cca8864': {
        id: 'f09466c3-a339-417c-ac43-a2d17cca8864',
        name: '70 - Run-on Sentences, Comma Splices, and Fragments',
        description: '',
        primaryVideoPath: '224067814',
        secondaryVideoPath: '',
        slideshowPath: 'MDSmGv6pZO2Wey',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/eaf75bc1-3137-4d0b-bed3-5461a204b00a.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:54:36.5864342',
        updateDate: '2018-04-10T19:05:24.8780627',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'aa52b74d-fc75-4154-b0d0-07333fc7b057',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: 'f09466c3-a339-417c-ac43-a2d17cca8864',
            order: 27,
            createDate: '2018-04-10T19:05:24.8780627',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'c0809959-ad95-40b5-b4de-bdd5fc61ba29': {
        id: 'c0809959-ad95-40b5-b4de-bdd5fc61ba29',
        name: '71 - Complex Sentences',
        description: '',
        primaryVideoPath: '224068170',
        secondaryVideoPath: '',
        slideshowPath: 'vEBOV7PlN35bNN',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/ebd5d1d3-ec9b-42f3-9c9e-d208ee4cf29b.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:54:53.3859939',
        updateDate: '2018-04-10T19:05:30.4617267',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'c44b65ea-45fb-447c-be6b-028bc5db9fba',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'c0809959-ad95-40b5-b4de-bdd5fc61ba29',
            order: 31,
            createDate: '2018-04-10T19:05:30.4617267',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'daf28d00-db3b-487f-b220-4316948a2adf': {
        id: 'daf28d00-db3b-487f-b220-4316948a2adf',
        name: '72 - Commas After Introductory Clauses',
        description: '',
        primaryVideoPath: '224068547',
        secondaryVideoPath: '',
        slideshowPath: 'LQKQgwUW3CJofW',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/4208c845-1477-4497-97da-4e8a8a9e0a5b.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:55:13.00456',
        updateDate: '2018-04-10T19:05:35.8034038',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'cbb7be98-ed6a-4228-b908-429dcedc2ba4',
            courseID: '45f989fc-5cff-4e54-a110-f9856d02e44b',
            lessonID: 'daf28d00-db3b-487f-b220-4316948a2adf',
            order: 32,
            createDate: '2018-04-10T19:05:35.8034038',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '45f989fc-5cff-4e54-a110-f9856d02e44b',
              name: 'Level 2 GrammarFlip Building Blocks',
              description:
                'Suggested for the middle school level or for students interested in reviewing intermediate level topics.  The following grammar lessons build upon the foundational topics from Level I.',
              createDate: '2018-03-29T20:46:01.6985064',
              updateDate: '2018-07-03T13:30:11.0721513',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '01ce4fa0-1a75-441c-9996-d703368f4453': {
        id: '01ce4fa0-1a75-441c-9996-d703368f4453',
        name: '73 - Compound-Complex Sentences',
        description: '',
        primaryVideoPath: '224068840',
        secondaryVideoPath: '',
        slideshowPath: 'lfId8e2iwTkZSy',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/829167ba-9dc3-49a6-8f7c-fed0656bb615.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:55:30.0850083',
        updateDate: '2018-04-10T19:05:41.6280492',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'e949037d-85c6-4789-ac69-9a6632ead71a',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '01ce4fa0-1a75-441c-9996-d703368f4453',
            order: 12,
            createDate: '2018-04-10T19:05:41.6436803',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '011910b6-e3e2-4d21-b3bf-d0c61d89e206': {
        id: '011910b6-e3e2-4d21-b3bf-d0c61d89e206',
        name: '74 - Parallel Construction',
        description: '',
        primaryVideoPath: '220302009',
        secondaryVideoPath: '',
        slideshowPath: 'utx9F2FXIC9LJS',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/69456bbb-528e-471e-ac3d-e98072e30153.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:55:52.7609758',
        updateDate: '2018-04-10T19:05:48.0399601',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '489a490c-a331-4d46-9465-7ad58579f049',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '011910b6-e3e2-4d21-b3bf-d0c61d89e206',
            order: 13,
            createDate: '2018-04-10T19:05:48.0555538',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '2739127e-fca5-4e06-b3dc-ae549c3b598c': {
        id: '2739127e-fca5-4e06-b3dc-ae549c3b598c',
        name: '75 - Colons',
        description: '',
        primaryVideoPath: '189698494',
        secondaryVideoPath: '',
        slideshowPath: 'I5qGw1ncB91dIE',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/e7808096-d3fe-4ff7-86a2-9cd08122c3f8.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:56:03.2870458',
        updateDate: '2018-04-10T19:05:53.3513759',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '53df3cd0-952a-4ae0-a628-ab8a0deaff14',
            courseID: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
            lessonID: '2739127e-fca5-4e06-b3dc-ae549c3b598c',
            order: 28,
            createDate: '2018-04-10T19:05:53.3513759',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: 'f8b631da-5a22-4e7f-9079-1b0a30e2435a',
              name: 'Level 1 GrammarFlip Foundations',
              description:
                'Perfect for elementary level learners or for middle school students interested in reviewing basic grammar concepts. Establish the foundation on which other grammar topics depend.',
              createDate: '2018-03-29T19:54:43.8481828',
              updateDate: '2018-07-03T13:28:52.8677053',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '8dd1eee6-fd2d-44fb-a124-f5b83cba3807': {
        id: '8dd1eee6-fd2d-44fb-a124-f5b83cba3807',
        name: '76 - Elliptical Clauses',
        description: '',
        primaryVideoPath: '220300266',
        secondaryVideoPath: '',
        slideshowPath: 'oZpUpSJhN2NLt',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/a6c98035-401f-4040-851a-48ad612baff5.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:56:18.1371696',
        updateDate: '2018-04-10T19:05:58.5938026',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '497bc687-8840-466a-9a13-f6c1d4df6084',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '8dd1eee6-fd2d-44fb-a124-f5b83cba3807',
            order: 14,
            createDate: '2018-04-10T19:05:58.6093856',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '393bddf5-bd14-48f6-a6c8-27bc6a518c03': {
        id: '393bddf5-bd14-48f6-a6c8-27bc6a518c03',
        name: '77 - Adjective Clauses and Relative Pronouns',
        description: '',
        primaryVideoPath: '178944865',
        secondaryVideoPath: '',
        slideshowPath: 'H3KtnfS2EqMcni',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/8072a15d-7e2a-477c-838a-9747ab0a0162.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:56:43.7432361',
        updateDate: '2018-04-10T19:06:04.6910818',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '1654870e-de30-4c66-a713-38c644eb0998',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '393bddf5-bd14-48f6-a6c8-27bc6a518c03',
            order: 15,
            createDate: '2018-04-10T19:06:04.6910818',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '1472152c-ca44-40d5-a1f9-3e5958a0ac78': {
        id: '1472152c-ca44-40d5-a1f9-3e5958a0ac78',
        name: '78 - Adverb Clauses and Relative Adverbs',
        description: '',
        primaryVideoPath: '178977309',
        secondaryVideoPath: '',
        slideshowPath: '7JGjI1aeNjFQwM',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/1efd1acd-0a9a-4b6e-ada1-85f43bcfdef1.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:57:07.4724543',
        updateDate: '2018-04-10T19:06:10.5520752',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'f36c5c0a-30a8-4797-97a7-ac1e91c3855b',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '1472152c-ca44-40d5-a1f9-3e5958a0ac78',
            order: 16,
            createDate: '2018-04-10T19:06:10.5520752',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'dd516782-077d-4208-8c9a-0ad3d98fa146': {
        id: 'dd516782-077d-4208-8c9a-0ad3d98fa146',
        name: '79 - Noun Clauses',
        description: '',
        primaryVideoPath: '178977589',
        secondaryVideoPath: '',
        slideshowPath: 'Hjw8UPicFq9Mzt',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/b4b7f3e1-9236-4e21-a5ba-787de1361b15.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:57:24.7902206',
        updateDate: '2018-04-10T19:06:15.8277556',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '3172b521-39df-4b87-99a3-ee9a5d506a2f',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'dd516782-077d-4208-8c9a-0ad3d98fa146',
            order: 17,
            createDate: '2018-04-10T19:06:15.8277556',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '843fe035-2007-461e-a955-94df680b5639': {
        id: '843fe035-2007-461e-a955-94df680b5639',
        name: '80 - Misplaced Modifiers: Part 2 (Clauses)',
        description: '',
        primaryVideoPath: '220300965',
        secondaryVideoPath: '',
        slideshowPath: 'Dr4lecpx8tiPt6',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/993c4819-4a7d-4bd6-86f7-0199d21695b9.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:57:41.7193017',
        updateDate: '2018-04-10T19:06:21.0020856',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '074270d8-f655-45ec-9b56-3ff1b81f93cb',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '843fe035-2007-461e-a955-94df680b5639',
            order: 18,
            createDate: '2018-04-10T19:06:21.0020856',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'd310aaa3-aa17-4d89-a427-c1d8254868a3': {
        id: 'd310aaa3-aa17-4d89-a427-c1d8254868a3',
        name: '81 - Who vs. Whom',
        description: '',
        primaryVideoPath: '220303262',
        secondaryVideoPath: '',
        slideshowPath: 'qGn0NjqFTDQJrZ',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/b82bb340-8f6f-471c-9798-da3c6a941b79.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:57:58.4023451',
        updateDate: '2018-04-10T19:06:35.9128683',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '7b980523-d6b1-4d51-9adc-762e5d8250cd',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'd310aaa3-aa17-4d89-a427-c1d8254868a3',
            order: 19,
            createDate: '2018-04-10T19:06:35.9128683',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'a2cdc501-6561-409c-8798-17dafaccb695': {
        id: 'a2cdc501-6561-409c-8798-17dafaccb695',
        name: '82 - Participles and Participial Phrases',
        description: '',
        primaryVideoPath: '176201208',
        secondaryVideoPath: '',
        slideshowPath: 'DVO3FvfHnuPu2t',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/da1fe1f9-4a8b-4391-9cde-3443a8c640c5.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:58:12.3752216',
        updateDate: '2018-04-10T19:06:48.6799125',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'fdb37631-b6f5-4444-96d0-ea5c8c6a2697',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'a2cdc501-6561-409c-8798-17dafaccb695',
            order: 20,
            createDate: '2018-04-10T19:06:48.6799125',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'd1a7c3ae-2e8f-4fe8-99c4-0ba3045b0ed7': {
        id: 'd1a7c3ae-2e8f-4fe8-99c4-0ba3045b0ed7',
        name: '83 - Dangling Participles',
        description: '',
        primaryVideoPath: '220300002',
        secondaryVideoPath: '',
        slideshowPath: 'dB8XdADEvEwb1D',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/a29cf192-c078-4c39-a0e5-759889c52b53.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:58:26.2311073',
        updateDate: '2018-04-10T19:06:54.7382218',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: 'a222e26f-00e8-4acb-814f-28592cc7f70d',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'd1a7c3ae-2e8f-4fe8-99c4-0ba3045b0ed7',
            order: 21,
            createDate: '2018-04-10T19:06:54.7382218',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      'f3c346c1-7594-4e2e-8154-f7b16bc3ebad': {
        id: 'f3c346c1-7594-4e2e-8154-f7b16bc3ebad',
        name: '84 - Gerunds and Gerund Phrases',
        description: '',
        primaryVideoPath: '178978131',
        secondaryVideoPath: '',
        slideshowPath: 'syvDHWHeR30S1k',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/059f65dc-0c17-4503-ac5b-fa843a95dd52.jpg',
        isPublished: true,
        createDate: '2017-04-22T17:58:44.1774954',
        updateDate: '2018-04-10T19:07:00.1814917',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '7f074f25-bed3-4a87-b5b5-e429f45b6dd1',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: 'f3c346c1-7594-4e2e-8154-f7b16bc3ebad',
            order: 22,
            createDate: '2018-04-10T19:07:00.1985874',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '9a672f71-0cb9-4dda-b7cb-c207c82cb986': {
        id: '9a672f71-0cb9-4dda-b7cb-c207c82cb986',
        name: '85 - Possessive Use with Gerunds',
        description: '',
        primaryVideoPath: '220302252',
        secondaryVideoPath: '',
        slideshowPath: '2pGxgSeXeq78YB',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/be1cce57-eee3-4e1e-a706-4189c7049d5e.jpg',
        isPublished: true,
        createDate: '2017-04-22T18:02:15.7300928',
        updateDate: '2018-04-10T19:07:06.7830111',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '2299ef72-910e-49fd-a141-9328b75fe7b9',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '9a672f71-0cb9-4dda-b7cb-c207c82cb986',
            order: 23,
            createDate: '2018-04-10T19:07:06.7830111',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      },
      '89067898-e21d-43e5-9ffb-387cb9bfe779': {
        id: '89067898-e21d-43e5-9ffb-387cb9bfe779',
        name: '86 - Infinitives and Infinitive Phrases',
        description: '',
        primaryVideoPath: '178978379',
        secondaryVideoPath: '',
        slideshowPath: 'azyQH1U5gJxaXi',
        imagePath:
          'https://bpgrammarflip.blob.core.windows.net/lessons/1f0ffe96-7815-483a-aa4f-e8828ce15d3f.jpg',
        isPublished: true,
        createDate: '2017-04-22T18:02:35.7453596',
        updateDate: '2018-06-28T14:13:44.8244152',
        creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
        courseID: '00000000-0000-0000-0000-000000000000',
        courseLessons: [
          {
            id: '53a17489-a157-4902-8eba-982d76328f5e',
            courseID: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
            lessonID: '89067898-e21d-43e5-9ffb-387cb9bfe779',
            order: 25,
            createDate: '2018-06-28T14:13:44.8244152',
            updateDate: null,
            creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
            updaterID: null,
            course: {
              id: '289ac98b-cafd-4a08-afaa-5cfa5d1bcb24',
              name: 'Level 3 GrammarFlip Advanced Topics',
              description:
                'Recommended for high school level students or for middle school students interested in challenging themselves beyond the intermediate level.',
              createDate: '2018-03-29T20:50:09.4787239',
              updateDate: '2018-07-03T13:30:22.2955199',
              creatorID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              updaterID: 'cb217e0e-634e-4159-9ccf-0f3e51ef38ca',
              isPublished: true
            },
            lesson: null
          }
        ]
      }
    },
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
