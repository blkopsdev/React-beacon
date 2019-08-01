/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { IinitialState, Ioption, IqueueObject, Ifacility } from '../../models';
import {
  getFacilitiesByCustomer,
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import {
  updateQueueUser,
  toggleEditQueueUserModal,
  approveUser,
  setEditUserFormValues,
  updateEditUserFormValues
} from '../../actions/manageUserQueueActions';
import CommonModal from '../common/CommonModal';
import EditQueueUserForm from './EditQueueUserForm';
import { FormUtil } from '../common/FormUtil';
import { filter } from 'lodash';

interface Iprops {
  selectedQueueObject: IqueueObject;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditQueueUserModal: boolean;
  loading: boolean;
  customerOptions: Ioption[];
  facilityOptions: Ioption[];
  updateQueueUser: typeof updateQueueUser;
  toggleModal: () => void;
  getFacilitiesByCustomer: () => Promise<void>;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  approveUser: typeof approveUser;
  updateFormValues: (formValues: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
}

class EditQueueUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditQueueUserModal}
        className="user-edit"
        onHide={this.props.toggleModal}
        body={<EditQueueUserForm {...this.props} />}
        title={this.props.t('newUserModalTitle')}
        container={document.getElementById('modal-one')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const customerID = state.manageUserQueue.editUserFormValues.customerID
    ? state.manageUserQueue.editUserFormValues.customerID.value
    : ownProps.selectedQueueObject.user.customerID;
  const filteredFacilities =
    filter(
      state.facilities,
      (facility: Ifacility) => facility.customerID === customerID
    ) || [];

  return {
    user: state.user,
    userQueue: state.manageUserQueue,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(filteredFacilities),
    showEditQueueUserModal: state.manageUserQueue.showEditQueueUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    formValues: state.manageUserQueue.editUserFormValues
  };
};

export default connect(
  mapStateToProps,
  {
    updateQueueUser,
    getFacilitiesByCustomer,
    toggleModal: toggleEditQueueUserModal,
    toggleEditCustomerModal,
    toggleEditFacilityModal,
    approveUser,
    setFormValues: setEditUserFormValues,
    updateFormValues: updateEditUserFormValues
  }
)(EditQueueUserModal);
