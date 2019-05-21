/*
* Edit Facility Modal
* responsible for editing a facility
* this modal is rendered inside the UserQueueForm component because we pass the selectedCustomer
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { Icustomer, Ifacility, IinitialState } from '../../models';
import {
  addFacility,
  toggleEditFacilityModal,
  updateFacility
} from '../../actions/commonActions';
import CommonModal from '../common/CommonModal';
import EditFacilityForm from './EditFacilityForm';
import {
  clearSelectedFacilityID,
  setFacilityFormValues,
  updateFacilityFormValue
} from '../../actions/manageCustomerAndFacilityActions';
import { initialCustomer, initialFacility } from '../../reducers/initialState';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditFacilityModal: boolean;
  loading: boolean;
  toggleModal: () => void;
  addFacility: typeof addFacility;
  updateFacility: typeof updateFacility;
  updateFormValue: typeof updateFacilityFormValue;
  setFormValues: typeof setFacilityFormValues;
  clearSelectedFacilityID: typeof setFacilityFormValues;
  formValues: { [key: string]: any };
  selectedCustomer: Icustomer;
  selectedFacility: Ifacility;
}

class EditFacilityModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    const selectedCustomerLabel = this.props.selectedCustomer
      ? this.props.selectedCustomer.name
      : '';
    return (
      <CommonModal
        modalVisible={this.props.showEditFacilityModal}
        className="customer-edit"
        onHide={this.props.toggleModal}
        body={
          <EditFacilityForm
            clearSelectedFacilityID={this.props.clearSelectedFacilityID}
            selectedFacility={this.props.selectedFacility}
            updateFormValue={this.props.updateFormValue}
            setFormValues={this.props.setFormValues}
            formValues={this.props.formValues}
            handleSubmit={this.props.addFacility}
            handleEdit={this.props.updateFacility}
            toggleModal={this.props.toggleModal}
            colorButton={this.props.colorButton}
            loading={this.props.loading}
            selectedCustomer={this.props.selectedCustomer}
          />
        }
        title={`${this.props.t(
          'common:newFacilityModalTitle'
        )} for ${selectedCustomerLabel}`}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const selectedCustomer =
    state.customers[state.customerAndFacilityManage.selectedCustomerID] ||
    initialCustomer;

  const selectedFacility: Ifacility =
    state.facilities[state.customerAndFacilityManage.selectedFacilityID] ||
    initialFacility;

  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditFacilityModal: state.showEditFacilityModal,
    formValues: state.customerAndFacilityManage.facilityFormValues,
    selectedFacility,
    selectedCustomer
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleEditFacilityModal,
    addFacility,
    updateFacility,
    updateFormValue: updateFacilityFormValue,
    setFormValues: setFacilityFormValues,
    clearSelectedFacilityID
  }
)(EditFacilityModal);
