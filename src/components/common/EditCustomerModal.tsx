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
} from '../../models';
import {
  addCustomer,
  toggleEditCustomerModal,
  updateCustomer
} from '../../actions/commonActions';
import CommonModal from './CommonModal';
import EditCustomerForm from './EditCustomerForm';
import {
  clearSelectedCustomerID,
  setCustomerFormValues,
  updateCustomerFormValue
} from '../../actions/manageCustomerAndFacilityActions';


interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditCustomerModal: boolean;
  loading: boolean;
  toggleModal: () => void;
  addCustomer: typeof addCustomer;
  updateCustomer: typeof updateCustomer;
  selectedCustomer: any;
  clearSelectedCustomerID: typeof clearSelectedCustomerID;
  updateFormValue: typeof updateCustomerFormValue;
  setFormValues: typeof setCustomerFormValues;
  formValues: { [key: string]: any };
}

class EditCustomerModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    const { selectedCustomer, t } = this.props;

    const formTitle =
      selectedCustomer && selectedCustomer.name
        ? t('manageCustomerAndFacility:editCustomer')
        : t('manageCustomerAndFacility:newFacility');

    return (
      <CommonModal
        modalVisible={this.props.showEditCustomerModal}
        className="customer-edit"
        onHide={this.props.toggleModal}
        body={
          <EditCustomerForm
            {...this.props}
            handleSubmit={this.props.addCustomer}
            handleEdit={this.props.updateCustomer}
            handleCancel={this.props.toggleModal}
            colorButton={this.props.colorButton}
            loading={this.props.loading}
          />
        }
        title={formTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditCustomerModal: state.showEditCustomerModal,
    formValues: state.customerAndFacilityManage.customerFormValues
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleEditCustomerModal,
    addCustomer,
    updateCustomer,
    clearSelectedCustomerID,
    updateFormValue: updateCustomerFormValue,
    setFormValues: setCustomerFormValues
  }
)(EditCustomerModal);
