import { ThunkAction } from 'redux-thunk';
import { SortingRule } from 'react-table';

export interface ItableFiltersReducer {
  search: string;
  page: number;
  company?: Ioption;
  type?: Ioption;
  startDate?: string;
  endDate?: string;
  facility?: Ioption;
  customer?: Ioption;
  productGroup?: Ioption;
  manufacturer?: Ioption;
  sorted?: SortingRule[];
}
export interface ItableFiltersParams {
  search?: string;
  page?: number;
  company?: Ioption;
  type?: Ioption;
  startDate?: string;
  endDate?: string;
  facility?: Ioption;
  customer?: Ioption;
  productGroup?: Ioption;
  manufacturer?: Ioption;
  sorted?: SortingRule[];
}

export interface Iuser {
  password: string;
  username: string;
  isAuthenticated: boolean;
  token: string;
  email: string;
  securityFunctions: string[];
  first: string;
  last: string;
  position: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  id: string;
  managerID?: string;
  tempAddress?: string;
  tempAddress2?: string;
  tempCity?: string;
  tempState?: string;
  tempZip?: string;
  lastLoginDate?: string;
  createDate?: string;
  customerID: string;
  facilities: Array<{ id: string }>;
  hasTeamMembers: boolean;
  appVersion: string;
  manager?: any;
  isActive?: boolean;
  customer?: Icustomer;
}
// export interface ImanageUserQueueReducer {
//   [key: string]: Iuser;
// }
// export interface ImanageUserQueueReducer {
//   [key: string]: Iuser;
// }
export interface IqueueObject {
  id: string;
  user: Iuser;
}

export interface ItempUser {
  email: string;
  first: string;
  last: string;
  position: string;
  tempAddress: string;
  tempAddress2: string;
  tempCity: string;
  tempState: string;
  tempZip: string;
}
export interface IbaseDataObject {
  id: string;
  name: string;
  createDate: string;
  updateDate: string;
  creatorID: string;
  updaterID: string;
}
// export interface ImainCategory extends IbaseDataObject {}
export interface Isubcategory extends IbaseDataObject {
  mainCategoryID: string;
  mainCategory: IbaseDataObject;
}
// export interface Istandard extends IbaseDataObject {}
export interface Ibrand extends IbaseDataObject {
  code: string;
}
// export interface Imanufacturer extends IbaseDataObject {}
export interface IgasType extends IbaseDataObject {
  code: string;
}
// export interface Ipower extends IbaseDataObject {}
export interface IsystemSize extends IbaseDataObject {
  code: string;
}
export interface IproductGroup extends IbaseDataObject {
  code: string;
}
export interface IinstallBase extends IbaseDataObject {
  code: string;

  productID: string;
  product: Iproduct;
  facilityID: string;
  facility: Ifacility;
  nickname: string;
  remarks: string;
  serialNumber: string;
  rfid: string;
  installDate: string;
  prodDate: string;
  buildingID: string;
  floorID: string;
  locationID: string;
  roomID: string;
}

export interface Iproduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  imagePath: string;
  subcategoryID: string;
  standardID: string;
  brandID: string;
  manufacturerID: string;
  gasTypeID: string;
  powerID: string;
  systemSizeID: string;
  productGroupID: string;
  subcategory: Isubcategory;
  // standard: IbaseDataObject;
  // brand: Ibrand;
  // manufacturer: IbaseDataObject;
  // gasType: IgasType;
  // power: IbaseDataObject;
  // systemSize: IsystemSize;
  // productGroup: IproductGroup;
  installs: IinstallBase[];
  quantity: number;
}

export interface IshoppingCartProduct {
  name: string;
  quantity: number;
  id: string;
  cost: number;
}

export interface IquoteItem {
  productID: string;
  quantity: number;
}

export interface ImanageUserQueueReducer {
  data: IqueueObject[];
  totalPages: number;
  showEditQueueUserModal: boolean;
  tableFilters: ItableFiltersReducer;
}

export interface ImanageUserReducer {
  data: Iuser[];
  totalPages: number;
  showEditUserModal: boolean;
  tableFilters: ItableFiltersReducer;
}

export interface Ibuilding {
  id?: string;
  name: string;
  floors: Ifloor[];
  facilityID?: string;
}
export interface Ifloor {
  id?: string;
  name: string;
  locations: Ilocation[];
  buildingID?: string;
}
export interface Ilocation {
  id?: string;
  name: string;
  rooms: Iroom[];
  floorID: string;
}
export interface Iroom {
  id?: string;
  name: string;
  locationID?: string;
}

export interface ImanageLocationReducer {
  data: any[];
  facility: IfacilityComplete;
  totalPages: number;
  showEditLocationModal: boolean;
  tableFilters: ItableFiltersReducer;
  selectedBuilding: Ibuilding;
  selectedFloor: Ifloor;
  selectedLocation: Ilocation;
  selectedRoom: Iroom;
}

export interface IuserJob {
  id: string;
  userID: string;
  jobID: string;
  user: Iuser;
}
export interface Ijob {
  id?: string;
  customerID: string;
  facilityID: string;
  assignedUserID: string;
  jobTypeID?: string;
  userJobs?: IuserJob[];
  startDate: string;
  endDate: string;
  status?: string;
}
export interface ImanageJobReducer {
  data: Ijob[];
  jobTypes: any[];
  fseUsers: Iuser[];
  totalPages: number;
  showEditJobModal: boolean;
  tableFilters: ItableFiltersReducer;
}
export interface ImanageTeamReducer {
  data: Iuser[];
  totalPages: number;
  showEditTeamModal: boolean;
  tableFilters: ItableFiltersReducer;
}

export interface IshoppingCart {
  addedIDs: string[];
  productsByID: { [key: string]: IshoppingCartProduct };
}
export interface ImanageInventoryReducer {
  data: Iproduct[];
  totalPages: number;
  cart: IshoppingCart;
  productInfo: IproductInfo;
  showEditProductModal: boolean;
  showEditInstallModal: boolean;
  showShoppingCartModal: boolean;
  showInstallContactModal: boolean;
  showSearchNewProductsModal: boolean;
  showImportInstall: boolean;
  tableFilters: ItableFiltersReducer;
  selectedProduct: Iproduct;
  newProducts: { [key: string]: Iproduct };
}

export interface IproductQueueObject {
  id: string;
  productID: string;
  createDate: string;
  creatorID: string;
  product: Iproduct;
}
export interface ImanageProductQueueReducer {
  data: IproductQueueObject[];
  totalPages: number;
  showApproveProductModal: boolean;
  tableFilters: ItableFiltersReducer;
}

export interface ImanageTrainingProgress {
  userName: string;
  courseName: string;
  progress: string;
  results: string;
}

export interface ImanageTrainingReducer {
  data: ImanageTrainingProgress[];
  totalPages: number;
  tableFilters: ItableFiltersReducer;
}

export interface Iredirect {
  redirectToReferrer: boolean;
  pathname: string;
}
export interface IproductInfo {
  brands: { [key: string]: Ibrand };
  gasTypes: { [key: string]: IgasType };
  manufacturers: { [key: string]: IbaseDataObject };
  mainCategories: { [key: string]: IbaseDataObject };
  powers: { [key: string]: IbaseDataObject };
  productGroups: { [key: string]: IproductGroup };
  standards: { [key: string]: IbaseDataObject };
  subcategories: { [key: string]: Isubcategory };
  systemSizes: { [key: string]: IsystemSize };
  brandOptions: Ioption[];
  gasTypeOptions: Ioption[];
  mainCategoryOptions: Ioption[];
  manufacturerOptions: Ioption[];
  powerOptions: Ioption[];
  productGroupOptions: Ioption[];
  standardOptions: Ioption[];
  subcategoryOptions: Ioption[];
  systemSizeOptions: Ioption[];
}

export interface IinitialState {
  user: Iuser;
  ajaxCallsInProgress: number;
  redirect: Iredirect;
  manageUserQueue: ImanageUserQueueReducer;
  manageUser: ImanageUserReducer;
  manageJob: ImanageJobReducer;
  manageTeam: ImanageTeamReducer;
  manageInventory: ImanageInventoryReducer;
  manageProductQueue: ImanageProductQueueReducer;
  manageLocation: ImanageLocationReducer;
  customers: Icustomer[];
  facilities: Ifacility[];
  showEditCustomerModal: boolean;
  showEditFacilityModal: boolean;
  showEditProfileModal: boolean;
  showSecurityFunctionsModal: boolean;
  training: ItrainingReducer;
  manageTraining: ImanageTrainingReducer;
}

export interface Itile {
  icon: string | string[];
  title: string;
  src: string;
  srcBanner: string;
  color: string;
  width: number;
  height: number;
  url: string;
  securityFunction: string;
  description: string;
}

export interface Icustomer {
  id: string;
  name: string;
  vat?: string;
}
export interface Ifacility {
  id: string;
  name: string;
  customerID: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  buildings?: Ibuilding[];
}
export interface IfacilityComplete extends Ifacility {
  buildings: Ibuilding[];
}

export interface Ioption {
  value: string;
  label: string;
}

// these are copied from react-redux-toastr beacuse could not figure out any other way to make typescript happy
export type transitionInType = 'bounceIn' | 'bounceInDown' | 'fadeIn';
export type transitionOutType = 'bounceOut' | 'bounceOutUp' | 'fadeOut';

export type ThunkResult<R> = ThunkAction<R, IinitialState, undefined, any>;

/* 
* TRAINING MODELS
*/
// export interface GFBadge {
//   id: string;
//   name: string;
//   description: boolean;
//   hook: string;
//   count: number;
//   imagePath: string;
// }
export interface GFClass {
  id: string;
  name: string;
  code: string;
  classSize: number;
  createDate: string;
}

export interface GFCourse {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export interface GFLesson {
  id: string;
  name: string;
  description: string;
  courseID: string;
  imagePath: string;
  order: number;
  primaryVideoPath: string;
  slideshowPath: string;
  courseLessons: Array<{ id: string; courseID: string }>;
  cost: number;
  score?: number;
  quizName?: string;
}

export interface GFLessons {
  [key: string]: GFLesson;
}
export interface GFClassProgressRaw {
  [key: string]: GFStudentQuizResult[];
}

export interface GFLessonsWithProgress {
  quiz01Results: GFStudentQuizResult[];
  quiz02Results: GFStudentQuizResult[];
  quiz03Results: GFStudentQuizResult[];
  quiz04Results: GFStudentQuizResult[];
  quiz05Results: GFStudentQuizResult[];
  lessonHasProgress: boolean;
}

export interface GFStudentWithProgress {
  quiz01Results: GFStudentQuizResult[];
  quiz02Results: GFStudentQuizResult[];
  quiz03Results: GFStudentQuizResult[];
  quiz04Results: GFStudentQuizResult[];
  quiz05Results: GFStudentQuizResult[];
}

export interface GFQuizQuestion {
  id: string;
  text: string;
  type: string;
  options: any[];
  correctAnswer: string;
  correctText: string;
  wrongText: string;
  order: number;
  userAnswer?: any;
  userCorrect?: boolean;
}

export interface GFQuizItem {
  id: string;
  name: string;
  imagePath: string;
  isComplete: boolean;
  videoPath: string;
  instructions: string;
  lessonID: string;
  questions: GFQuizQuestion[];
  isTimed: boolean;
  startTime?: string;
  createDate?: any;
  updateDate?: any;
  studentCanAccess?: any;
  score?: number;
}

export interface GFStudentQuizResult {
  id?: string;
  studentID: string;
  lessonID: string;
  quizID: string;
  quiz: GFQuizItem;
  answers: any[];
  score: number;
  createDate: string;
  className: string;
}

export interface LessonProgress {
  id?: string;
  lessonID: string;
  userID: string;
  currentTime: number;
  percentageComplete: number;
  totalTime: number;
  timeSpent: number;
  isComplete?: boolean;
}

export interface ItrainingReducer {
  courses: GFCourse[];
  lessons: GFLessons | any;
  lesson: GFLesson;
  quizzes: { [key: string]: GFQuizItem };
  quiz: GFQuizItem;
  lessonProgress: { [key: string]: LessonProgress };
  cart: IshoppingCart;
  showShoppingCartModal: boolean;
  purchasedTraining: string[];
}
