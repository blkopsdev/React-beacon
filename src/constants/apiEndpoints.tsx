let root;
console.log('ENV:' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  root = 'http://private-cad60-corecare.apiary-mock.com/'; // TODO replace with production URL
} else if (process.env.NODE_ENV === 'test') {
  root = 'http://private-cad60-corecare.apiary-mock.com/';
} else if (process.env.NODE_ENV === 'development') {
  root = 'http://beacon-corecare-api-dev.azurewebsites.net/';
  // root = 'http://private-cad60-corecare.apiary-mock.com/';
  // root = 'https://virtserver.swaggerhub.com/Big-Pixel/Core-Care/1.0.21/'; // swagger
} else {
  console.error('invalid NODE_ENV');
}

const API = {
  POST: {
    user: {
      login: `${root}user/login`,
      signup: `${root}user/signup`
    }
  },
  GET: {
    user: {
      getuserqueue: `${root}user/getuserqueue`
    }
  }
};

export default API;
