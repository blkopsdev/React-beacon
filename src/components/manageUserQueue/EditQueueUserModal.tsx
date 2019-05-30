/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { Ifacility, IinitialState, Ioption, IqueueObject } from '../../models';
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
  updateEditUserFormValue
} from '../../actions/manageUserQueueActions';
import CommonModal from '../common/CommonModal';
import EditQueueUserForm from './EditQueueUserForm';
import { filter } from 'lodash';
import { FormUtil } from '../common/FormUtil';

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
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
}

class EditQueueUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

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
  const customerID =
    state.manageUserQueue.editUserFormValues.customerID ||
    ownProps.selectedQueueObject.user.customerID;
  const filteredFacilities = filter(
    state.facilities,
    (facility: Ifacility) => facility.customerID === customerID
  );

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
    updateFormValue: updateEditUserFormValue
  }
)(EditQueueUserModal);
