const root = process.env.REACT_APP_SERVER_DOMAIN;
console.log(`ENV: ${process.env.NODE_ENV} SERVER_DOMAIN: ${root}`);

const API = {
  POST: {
    user: {
      login: `${root}user/login`,
      signup: `${root}user/signup`,
      approve: `${root}user/approve`,
      reject: `${root}user/reject`,
      update: `${root}user/update`,
      updateprofile: `${root}user/updateprofile`,
      updateteam: `${root}user/updateteammember`,
      saveteam: `${root}user/saveteammember`
    },
    customer: {
      add: `${root}customer/add`
    },
    facility: {
      add: `${root}facility/add`
    },
    inventory: {
      updateproduct: `${root}inventory/updateproduct`,
      addproduct: `${root}inventory/addproduct`,
      quote: `${root}inventory/quote`,
      updateinstall: `${root}inventory/update`,
      addinstall: `${root}inventory/add`
    }
  },
  GET: {
    user: {
      getuserqueue: `${root}user/getuserqueue`,
      getusersearch: `${root}user/search`,
      getteamsearch: `${root}user/searchteam`
    },
    customer: {
      getall: `${root}customer/getall`
    },
    facility: {
      getbycustomer: `${root}facility/getbycustomer`
    },
    inventory: {
      getinventory: `${root}inventory/search`, // unused
      getproductinfo: `${root}inventory/getproductinfo`
    }
  }
};

export default API;
