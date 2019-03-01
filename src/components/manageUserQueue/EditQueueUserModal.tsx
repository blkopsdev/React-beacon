/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { map } from 'lodash';
import * as React from 'react';

import {
  Icustomer,
  Ifacility,
  IinitialState,
  Ioption,
  IqueueObject
} from '../../models';
import {
  getFacilitiesByCustomer,
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import {
  updateQueueUser,
  toggleEditQueueUserModal,
  approveUser
} from '../../actions/manageUserQueueActions';
import CommonModal from '../common/CommonModal';
import EditQueueUserForm from './EditQueueUserForm';

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
  toggleEditQueueUserModal: typeof toggleEditQueueUserModal;
  getFacilitiesByCustomer: () => Promise<void>;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  approveUser: typeof approveUser;
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
        onHide={this.props.toggleEditQueueUserModal}
        body={<EditQueueUserForm {...this.props} />}
        title={this.props.t('newUserModalTitle')}
        container={document.getElementById('modal-one')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    userQueue: state.manageUserQueue,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: getCustomerOptions(state.customers),
    facilityOptions: getFacilitityOptions(state.facilities),
    showEditQueueUserModal: state.manageUserQueue.showEditQueueUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateQueueUser,
    getFacilitiesByCustomer,
    toggleEditQueueUserModal,
    toggleEditCustomerModal,
    toggleEditFacilityModal,
    approveUser
  }
)(EditQueueUserModal);
