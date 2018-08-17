const root = process.env.REACT_APP_SERVER_DOMAIN;
console.log(`ENV: ${process.env.NODE_ENV} SERVER_DOMAIN: ${root}`);

const API = {
  POST: {
    user: {
      login: `${root}user/login`,
      signup: `${root}user/signup`,
      approve: `${root}user/approve`,
      reject: `${root}user/reject`,
      update: `${root}user/update`
    }
  },
  GET: {
    user: {
      getuserqueue: `${root}user/getuserqueue`,
      getusersearch: `${root}user/search`
    },
    customer: {
      getall: `${root}customer/getall`
    },
    facility: {
      getbycustomer: `${root}facility/getbycustomer`
    }
  }
};

export default API;
