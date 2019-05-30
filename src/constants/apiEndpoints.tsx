const root = process.env.REACT_APP_SERVER_DOMAIN;
const trainingRoot = process.env.REACT_APP_SERVER_DOMAIN_TRAINING;
console.log(
  `ENV: ${process.env.NODE_ENV} SERVER_DOMAIN: ${root}/ Version: ${
    process.env.REACT_APP_VERSION
  }`
);

const API = {
  POST: {
    building: `${root}/building`,
    customer: {
      add: `${root}/customer`
    },

    job: {
      create: `${root}/job/create`,
      update: `${root}/job/update`
    },

    facility: {
      add: `${root}/facility/add`
    },
    floor: `${root}/floor`,
    location: `${root}/location`,
    room: `${root}/room`,
    inventory: {
      updateproduct: `${root}/inventory/updateproduct`,
      addproduct: `${root}/inventory/addproduct`,
      quote: `${root}/inventory/quote`,
      updateinstall: `${root}/inventory/update`,
      addinstall: `${root}/inventory/add`,
      deleteInstall: `${root}/inventory/delete`,
      installContact: `${root}/inventory/contact`,
      approveproduct: `${root}/inventory/approve`,
      importInstall: `${root}/inventory/excelimport`,
      mergeProduct: `${root}/inventory/mergeproduct`
    },
    user: {
      login: `${root}/user/login`,
      signup: `${root}/user/signup`,
      approve: `${root}/user/approve`,
      reject: `${root}/user/reject`,
      update: `${root}/user/update`,
      updateprofile: `${root}/user/updateprofile`,
      updateteam: `${root}/user/updateteammember`,
      saveteam: `${root}/user/saveteammember`,
      deleteTeamMember: `${root}/user/deleteteammember`
    },
    training: {
      savelessonprogress: `${root}/training/savelessonprogress`,
      trainingCheckout: `${root}/training/savetrainingtransaction`,
      savequiz: `${root}/training/savequiz`,
      startQuiz: `${root}/training/startquiz`
    },
    measurementPoint: {
      addglobalmpl: `${root}/MeasurementPoint/AddGlobalMeasurementPointList`,
      addResults: `${root}/MeasurementPoint/AddJobMeasurementPointListResults`
    },
    report: {
      run: `${root}/report/run`
    },
    brand: {
      add: `${root}/brand`
    },
    alert: {
      create: `${root}/alert`,
      markAsRead: `${root}/alert/{alertId}/viewed`
    }
  },
  PUT: {
    building: `${root}/building`,
    floor: `${root}/floor`,
    location: `${root}/location`,
    room: `${root}/room`,
    measurementPoint: {
      updateglobalmpl: `${root}/MeasurementPoint/UpdateGlobalMeasurementPointList`,
      updatecustomermpl: `${root}/MeasurementPoint/UpdateCustomerMeasurementPointList`
    },
    brand: {
      update: `${root}/brand`
    },
    alert: {
      update: `${root}/alert`
    },
    facility: {
      update: `${root}/facility/{id}`
    },
    customer: {
      update: `${root}/customer/{id}`
    }
  },
  DELETE: {
    building: `${root}/building`,
    floor: `${root}/floor`,
    location: `${root}/location`,
    room: `${root}/room`,
    measurementPoint: {
      deleteglobalmpl: `${root}/MeasurementPoint/deleteglobalmeasurementpointlist`,
      deletecustomermpl: `${root}/MeasurementPoint/deletecustomermeasurementpointlist`,
      deleteglobalmeasurementpoint: `${root}/MeasurementPoint/deleteglobalmeasurementpoint`,
      deletecustomermeasurementpoint: `${root}/MeasurementPoint/deleteglobalmeasurementpoint`,
      deleteglobalmeasurementpointselectoption: `${root}/MeasurementPoint/deleteglobalmeasurementpointselectoption`,
      deletecustomermeasurementpointselectoption: `${root}/MeasurementPoint/deletecustomermeasurementpointselectoption`
    },
    user: `${root}/user/deleteaccount`,
    brand: {
      remove: `${root}/brand`
    },
    alert: {
      delete: `${root}/alert`
    }
  },
  GET: {
    building: {
      getall: `${root}/building/getall`
    },

    customer: {
      getall: `${root}/customer/getall`,
      search: `${root}/customer/search`
    },
    job: {
      getall: `${root}/job/getall`,
      getassigned: `${root}/job/getassigned`
    },
    facility: {
      getbyid: `${root}/facility`,
      getbycustomer: `${root}/facility/getbycustomer`
    },
    inventory: {
      getinventory: `${root}/inventory/search`, // unused
      getproductinfo: `${root}/inventory/getproductinfo`,
      getproductqueue: `${root}/inventory/getproductqueue`,
      products: `${root}/inventory/products`
    },
    floor: {
      getall: `${root}/floor/getall`
    },
    location: {
      getall: `${root}/location/getall`
    },
    room: {
      getall: `${root}/room/getall`
    },
    user: {
      getuserqueue: `${root}/user/getuserqueue`,
      getfseusers: `${root}/user/getfseusers`,
      getusersearch: `${root}/user/search`,
      getteamsearch: `${root}/user/searchteam`
    },
    training: {
      getprogressbylesson: `${root}/training/getprogressbylesson`,
      getalllessonprogress: `${root}/training/getalllessonprogress`,
      getPurchasedTraining: `${root}/training/getpurchasedtraining`,
      getAdminProgress: `${root}/training/getadminprogress`,
      getQuizResults: `${root}/training/getquizresults`
    },
    trainingCurriculum: {
      allCourses: `${trainingRoot}/course/getall`,
      allLessons: `${trainingRoot}/lesson/getall`,
      lessonByCourseID: `${trainingRoot}/lesson/getbycourse`,
      quizzesByLessonID: `${trainingRoot}/quiz/getall`,
      allQuizzes: `${trainingRoot}/quiz/getentirelist`
    },
    measurementPoint: {
      getall: `${root}/measurementpoint/GetAllMeasurementPointLists`,
      getJobResults: `${root}/MeasurementPoint/GetJobMeasurementPointListResults`,
      getFacilityMeasurementPointListResults: `${root}/MeasurementPoint/GetFacilityMeasurementPointListResults`,
      getMeasurementPointList: `${root}/measurementpoint/getmeasurementpointlist`
    },
    report: {
      defaults: `${root}/report/defaults`
    },
    brand: {
      getall: `${root}/brand/getall`,
      getsingle: `${root}/brand`
    },
    alert: {
      single: `${root}/alert/{alertId}`,
      all: `${root}/alert/getall`,
      search: `${root}/alert/search`
    }
  }
};

export default API;
