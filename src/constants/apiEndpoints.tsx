const root = process.env.REACT_APP_SERVER_DOMAIN;
console.log(`ENV: ${process.env.NODE_ENV} SERVER_DOMAIN: ${root}`);

const API = {
  POST: {
    building: `${root}building`,
    customer: {
      add: `${root}customer/add`
    },

    job: {
      create: `${root}job/create`
    },

    facility: {
      add: `${root}facility/add`
    },
    floor: `${root}floor`,
    location: `${root}location`,
    room: `${root}room`,
    inventory: {
      updateproduct: `${root}inventory/updateproduct`,
      addproduct: `${root}inventory/addproduct`,
      quote: `${root}inventory/quote`,
      updateinstall: `${root}inventory/update`,
      addinstall: `${root}inventory/add`,
      deleteInstall: `${root}inventory/delete`,
      installContact: `${root}inventory/contact`,
      approveproduct: `${root}inventory/approve`
    },
    user: {
      login: `${root}user/login`,
      signup: `${root}user/signup`,
      approve: `${root}user/approve`,
      reject: `${root}user/reject`,
      update: `${root}user/update`,
      updateprofile: `${root}user/updateprofile`,
      updateteam: `${root}user/updateteammember`,
      saveteam: `${root}user/saveteammember`,
      deleteTeamMember: `${root}user/deleteteammember`
    }
  },
  PUT: {
    job: {
      update: `${root}job`
    }
  },
  GET: {
    building: {
      getall: `${root}building/getall`
    },

    customer: {
      getall: `${root}customer/getall`
    },
    job: {
      getall: `${root}job/getall`,
      getassigned: `${root}job/getassigned`
    },
    jobtype: {
      getall: `${root}jobtype/getall`
    },
    facility: {
      getbycustomer: `${root}facility/getbycustomer`
    },
    inventory: {
      getinventory: `${root}inventory/search`, // unused
      getproductinfo: `${root}inventory/getproductinfo`,
      getproductqueue: `${root}inventory/getproductqueue`,
      products: `${root}inventory/products`
    },
    floor: {
      getall: `${root}floor/getall`
    },
    location: {
      getall: `${root}location/getall`
    },
    room: {
      getall: `${root}room/getall`
    },
    user: {
      getuserqueue: `${root}user/getuserqueue`,
      getfseusers: `${root}user/getfseusers`,
      getusersearch: `${root}user/search`,
      getteamsearch: `${root}user/searchteam`
    }
  }
};

export default API;
