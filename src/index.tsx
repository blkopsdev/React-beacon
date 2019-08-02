/*
* Index is the entry point for the app. 
* Initial routes are here and secondary routes are in TwoPanelLayout
*/
import 'react-app-polyfill/ie11';
// import 'custom-event-polyfill';
import { Provider } from 'react-redux';
import {
  faCog,
  faCalendarCheck,
  faTh,
  faCheck,
  faTimes,
  faPlus,
  faMinus,
  faHospital,
  faSignOut,
  faListAlt,
  faClock,
  faEdit,
  faSortAmountUp,
  faSortAmountDown,
  faClipboardList,
  faWrench,
  faHistory,
  faBars
} from '@fortawesome/pro-regular-svg-icons';
import {
  faUsers,
  faSearch,
  faUser,
  faShoppingCart,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';

import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';

import { PersistGate } from 'redux-persist/integration/react';
import { TrackJS } from 'trackjs';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// import project css
import 'react-toggle/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';

// import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.css';
import { constants } from './constants/constants';
import { msalApp } from './components/auth/Auth-Utils';
import App from './App';

library.add(
  faCog,
  faBars,
  faUsers,
  faCalendarCheck,
  faTh,
  faCheck,
  faTimes,
  faSearch,
  faHospital,
  faUser,
  faSignOut,
  faShoppingCart,
  faChevronDown,
  faChevronRight,
  faWrench,
  faListAlt,
  faPlus,
  faMinus,
  faClock,
  faEdit,
  faSortAmountUp,
  faSortAmountDown,
  faClipboardList,
  faHistory
);

if (!(window !== window.parent && !window.opener)) {
  console.log('registering service worker');
  registerServiceWorker();
  const { store, persistor } = configureStore();

  // set Axios default header for accepting JSON
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.timeout = constants.httpTimeout;

  // Trackjs

  TrackJS.install({
    token: '7acefdd92da44ad595db60cb7c09af8c',
    application: 'mymedgas',
    version: process.env.REACT_APP_VERSION,
    enabled: !(window.location.host.indexOf('localhost') >= 0)
    // for more configuration options, see https://docs.trackjs.com
  });

  // set the window name for UTA transaction window
  window.name = 'MyMedGas';

  /*
* flush writes the current state to storage - this will be right after USER_LOGOUT_SUCCESS is triggered
in userActions.  then we pause the persistor in order to prevent anything else from being persisted while we logout.
*/
  const handleLogout = () => {
    persistor.flush().then(() => {
      persistor.pause();
      msalApp.logout();
    });
  };
  document.addEventListener('userLogout', handleLogout, false);

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </I18nextProvider>,
    document.getElementById('root') as HTMLElement
  );
} else {
  console.log('loading silent refresh in iFrame');
}
