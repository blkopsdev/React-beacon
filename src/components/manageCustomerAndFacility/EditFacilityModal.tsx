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
  toggleEditFacilityModal
} from '../../actions/commonActions';
import CommonModal from '../common/CommonModal';
import EditFacilityForm from './EditFacilityForm';
import {
  setFacilityFormValues,
  updateFacilityFormValue
} from '../../actions/manageCustomerAndFacilityActions';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
  selectedCustomer: Icustomer;
  selectedFacility: Ifacility;
}

interface IdispatchProps {
  showEditFacilityModal: boolean;
  loading: boolean;
  toggleModal: () => void;
  addFacility: typeof addFacility;
  updateFormValue: typeof updateFacilityFormValue;
  setFormValues: typeof setFacilityFormValues;
  formValues: { [key: string]: any };
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
            selectedFacility={this.props.selectedFacility}
            updateFormValue={this.props.updateFormValue}
            setFormValues={this.props.setFormValues}
            formValues={this.props.formValues}
            handleSubmit={this.props.addFacility}
            handleCancel={this.props.toggleModal}
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
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditFacilityModal: state.showEditFacilityModal,
    formValues: state.customerAndFacilityManage.facilityFormValues
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleEditFacilityModal,
    addFacility,
    updateFormValue: updateFacilityFormValue,
    setFormValues: setFacilityFormValues
  }
)(EditFacilityModal);
