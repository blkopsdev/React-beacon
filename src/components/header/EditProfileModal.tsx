/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { getFacilitiesByCustomer } from '../../actions/userQueueActions';
import {
  toggleEditProfileModal,
  updateUserProfile
} from '../../actions/userActions';
import { IinitialState, Icustomer, Ifacility, Iuser } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserProfileForm from './UserProfileForm';
import { TranslationFunction } from 'react-i18next';
import { map } from 'lodash';

const getCustomerOptions = (customers: Icustomer[]) => {
  return map(customers, (cust: Icustomer) => {
    return { value: cust.id, label: cust.name };
  });
};

const getFacilitityOptions = (facilities: Ifacility[]) => {
  return map(facilities, (facility: Ifacility) => {
    return { value: facility.id, label: facility.name };
  });
};

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditProfileModal: boolean;
  loading: boolean;
  customers: any[];
  facilityOptions: any[];
  updateUserProfile: typeof updateUserProfile;
  toggleEditProfileModal: () => void;
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  user: Iuser;
}

class EditManageUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }
  componentWillMount() {
    this.props.getFacilitiesByCustomer(this.props.user.customerID);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditProfileModal}
        className="user-edit"
        onHide={this.props.toggleEditProfileModal}
        body={
          <UserProfileForm
            handleSubmit={this.props.updateUserProfile}
            handleCancel={this.props.toggleEditProfileModal}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            customers={this.props.customers}
            facilities={this.props.facilityOptions}
            facilityOptions={this.props.facilityOptions}
            user={this.props.user}
          />
        }
        title={this.props.t('user:editProfileModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    userManage: state.userManage,
    loading: state.ajaxCallsInProgress > 0,
    // customerOptions: getCustomerOptions(state.customers),
    customers: state.customers,
    facilityOptions: getFacilitityOptions(state.facilities),
    showEditProfileModal: state.showEditProfileModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditProfileModal,
    getFacilitityOptions,
    getCustomerOptions,
    getFacilitiesByCustomer,
    updateUserProfile
  }
)(EditManageUserModal);
