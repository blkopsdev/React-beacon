/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateUser,
  getFacilitiesByCustomer,
  toggleEditQueueUserModal,
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/userQueueActions';
import {
  IinitialState,
  Icustomer,
  Ifacility,
  IqueueObject
} from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import UserQueueForm from './UserQueueForm';
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
  selectedQueueObject: IqueueObject;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditQueueUserModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateUser: typeof updateUser;
  toggleEditQueueUserModal: () => void;
  getFacilitiesByCustomer: () => Promise<void>;
  toggleEditCustomerModal: () => void;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
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
        body={
          <UserQueueForm
            handleSubmit={this.props.updateUser}
            handleCancel={this.props.toggleEditQueueUserModal}
            selectedQueueObject={this.props.selectedQueueObject}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            customerOptions={this.props.customerOptions}
            facilityOptions={this.props.facilityOptions}
            getFacilitiesByCustomer={this.props.getFacilitiesByCustomer}
            toggleEditCustomerModal={this.props.toggleEditCustomerModal}
            toggleEditFacilityModal={this.props.toggleEditFacilityModal}
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
    userQueue: state.userQueue,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: getCustomerOptions(state.customers),
    facilityOptions: getFacilitityOptions(state.facilities),
    showEditQueueUserModal: state.showEditQueueUserModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateUser,
    getFacilitiesByCustomer,
    toggleEditQueueUserModal,
    toggleEditCustomerModal,
    toggleEditFacilityModal
  }
)(EditQueueUserModal);
