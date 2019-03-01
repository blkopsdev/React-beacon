/*
* Edit Facility Modal
* responsible for editing a facility
* this modal is rendered inside the UserQueueForm component because we pass the selectedCustomer
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { IinitialState } from '../../models';
import {
  addFacility,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import CommonModal from '../common/CommonModal';
import EditFacilityForm from '../common/EditFacilityForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
  selectedCustomer: { value: string; label: string };
}

interface IdispatchProps {
  showEditFacilityModal: boolean;
  loading: boolean;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
  addFacility: typeof addFacility;
}

class EditFacilityModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    const selectedCustomerLabel = this.props.selectedCustomer
      ? this.props.selectedCustomer.label
      : '';
    return (
      <CommonModal
        modalVisible={this.props.showEditFacilityModal}
        className="customer-edit second-modal"
        onHide={this.props.toggleEditFacilityModal}
        body={
          <EditFacilityForm
            handleSubmit={this.props.addFacility}
            handleCancel={this.props.toggleEditFacilityModal}
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
    showEditFacilityModal: state.showEditFacilityModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditFacilityModal,
    addFacility
  }
)(EditFacilityModal);
