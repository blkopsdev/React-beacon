/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateUser,
  toggleEditUserModal
} from '../../actions/userManageActions';
import {
  getFacilitiesByCustomer,
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/userQueueActions';
import { IinitialState, Icustomer, Ifacility, Iuser } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserManageForm from './UserManageForm';
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
  selectedUser: Iuser;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditManageUserModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateUser: typeof updateUser;
  toggleEditUserModal: () => void;
  getFacilitiesByCustomer: () => Promise<void>;
  toggleEditCustomerModal: () => void;
  toggleEditFacilityModal: () => void;
}

class EditManageUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditManageUserModal}
        className="user-edit"
        onHide={this.props.toggleEditUserModal}
        body={
          <UserManageForm
            handleSubmit={this.props.updateUser}
            handleCancel={this.props.toggleEditUserModal}
            selectedUser={this.props.selectedUser}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            customerOptions={this.props.customerOptions}
            facilityOptions={this.props.facilityOptions}
            getFacilitiesByCustomer={this.props.getFacilitiesByCustomer}
            toggleEditCustomerModal={this.props.toggleEditCustomerModal}
          />
        }
        title={this.props.t('editUserModalTitle')}
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
    customerOptions: getCustomerOptions(state.customers),
    facilityOptions: getFacilitityOptions(state.facilities),
    showEditManageUserModal: state.showEditManageUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateUser,
    toggleEditUserModal,
    getFacilitityOptions,
    getCustomerOptions,
    getFacilitiesByCustomer,
    toggleEditCustomerModal,
    toggleEditFacilityModal
  }
)(EditManageUserModal);