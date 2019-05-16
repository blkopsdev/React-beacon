/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, Iuser, Ifacility } from '../../models';
import {
  getFacilitiesByCustomer,
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import {
  updateUser,
  toggleEditUserModal,
  toggleSecurityFunctionsModal,
  setEditUserFormValues,
  updateEditUserFormValue
} from '../../actions/manageUserActions';
import CommonModal from '../common/CommonModal';
import EditUserForm from './EditUserForm';
import { filter } from 'lodash';

interface Iprops {
  selectedUser: Iuser;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateUser: typeof updateUser;
  toggleModal: () => void;
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  toggleSecurityFunctionsModal: typeof toggleSecurityFunctionsModal;
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
}

class EditManageUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleModal}
        body={<EditUserForm {...this.props} />}
        title={this.props.t('editUserModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const customerID =
    state.manageUser.editUserFormValues.customerID ||
    ownProps.selectedUser.customerID;
  const filteredFacilities = filter(
    state.facilities,
    (facility: Ifacility) => facility.customerID === customerID
  );
  return {
    user: state.user,
    userManage: state.manageUser,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(filteredFacilities),
    showModal: state.manageUser.showEditUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    formValues: state.manageUser.editUserFormValues
  };
};

export default connect(
  mapStateToProps,
  {
    updateUser,
    toggleModal: toggleEditUserModal,
    getFacilitiesByCustomer,
    toggleEditCustomerModal,
    toggleEditFacilityModal,
    toggleSecurityFunctionsModal,
    setFormValues: setEditUserFormValues,
    updateFormValue: updateEditUserFormValue
  }
)(EditManageUserModal);
