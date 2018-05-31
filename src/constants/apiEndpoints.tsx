
let root;
if (process.env.NODE_ENV === 'production') {
  root = 'http://private-cad60-corecare.apiary-mock.com/'; // TODO replace with production URL
} else {
  root = 'http://private-cad60-corecare.apiary-mock.com/';
}
const API = {
  GET: {
    user: {
      login : `${root}user/login`
    }
  }
};

export default API;
