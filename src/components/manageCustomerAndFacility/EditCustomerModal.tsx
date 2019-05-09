/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState
  // Icustomer
} from '../../models';
import {
  addCustomer,
  toggleEditCustomerModal
} from '../../actions/commonActions';
import CommonModal from '../common/CommonModal';
import EditCustomerForm from './EditCustomerForm';
import { initialCustomer } from '../../reducers/initialState';
import {
  clearSelectedCustomerAndFacilityID,
  setCustomerFormValues,
  updateCustomerFormValue
} from '../../actions/manageCustomerAndFacilityActions';

// import { map } from 'lodash';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditCustomerModal: boolean;
  loading: boolean;
  toggleModal: () => void;
  addCustomer: typeof addCustomer;
  selectedCustomer: any;
  clearSelectedCustomerAndFacilityID: typeof clearSelectedCustomerAndFacilityID;
  updateFormValue: typeof updateCustomerFormValue;
  setFormValues: typeof setCustomerFormValues;
  formValues: { [key: string]: any };
}

class EditCustomerModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditCustomerModal}
        className="customer-edit"
        onHide={this.props.toggleModal}
        body={
          <EditCustomerForm
            {...this.props}
            handleSubmit={this.props.addCustomer}
            handleCancel={this.props.toggleModal}
            colorButton={this.props.colorButton}
            loading={this.props.loading}
          />
        }
        title={this.props.t('common:newCustomerModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const selectedCustomer =
    state.customerAndFacilityManage.data[
      state.customerAndFacilityManage.selectedCustomerID
    ] || initialCustomer;
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditCustomerModal: state.showEditCustomerModal,
    selectedCustomer,
    formValues: state.customerAndFacilityManage.customerFormValues
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleEditCustomerModal,
    addCustomer,
    clearSelectedCustomerAndFacilityID,
    updateFormValue: updateCustomerFormValue,
    setFormValues: setCustomerFormValues
  }
)(EditCustomerModal);
