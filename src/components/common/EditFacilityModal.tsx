/*
* Edit Facility Modal
* responsible for editing a facility
* this modal is rendered inside the UserQueueForm component because we pass the selectedCustomer
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { Icustomer, Ifacility, IinitialState, Ioption } from '../../models';
import {
  addFacility,
  toggleEditFacilityModal,
  updateFacility
} from '../../actions/commonActions';
import CommonModal from './CommonModal';
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
  modalClass?: string;
  selectedCustomer?: Icustomer & Ioption;
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
  selectedCustomer: Icustomer & Ioption;
  selectedFacility: Ifacility;
}

class EditFacilityModal extends React.Component<Iprops & IdispatchProps, {}> {
  static defaultProps = {
    modalClass: 'second-modal'
  };

  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    const { selectedFacility, t, modalClass } = this.props;
    const formTitle =
      selectedFacility && selectedFacility.name
        ? t('manageCustomerAndFacility:editFacility')
        : t('manageCustomerAndFacility:newFacility');

    return (
      <CommonModal
        modalVisible={this.props.showEditFacilityModal}
        className={`customer-edit ${modalClass}`}
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
            handleCancel={this.props.toggleModal}
            colorButton={this.props.colorButton}
            loading={this.props.loading}
            selectedCustomer={this.props.selectedCustomer}
          />
        }
        title={formTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const selectedCustomer =
    ownProps.selectedCustomer ||
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
