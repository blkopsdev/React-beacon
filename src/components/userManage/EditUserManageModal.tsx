/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateUser,
  toggleEditUserModal,
  toggleSecurityFunctionsModal
} from '../../actions/userManageActions';
import {
  getFacilitiesByCustomer,
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/userQueueActions';
import { IinitialState, Iuser } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserManageForm from './UserManageForm';
import { TranslationFunction } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';

interface Iprops {
  selectedUser: Iuser;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditUserModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateUser: typeof updateUser;
  toggleEditUserModal: () => void;
  getFacilitiesByCustomer: () => Promise<void>;
  toggleEditCustomerModal: () => void;
  toggleEditFacilityModal: () => void;
  toggleSecurityFunctionsModal: () => void;
}

class EditManageUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditUserModal}
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
            toggleEditFacilityModal={this.props.toggleEditFacilityModal}
            toggleSecurityFunctionsModal={
              this.props.toggleSecurityFunctionsModal
            }
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
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    showEditUserModal: state.showEditUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateUser,
    toggleEditUserModal,
    getFacilitiesByCustomer,
    toggleEditCustomerModal,
    toggleEditFacilityModal,
    toggleSecurityFunctionsModal
  }
)(EditManageUserModal);
