/*
* Edit Facility Modal
* responsible for editing a facility
* this modal is rendered inside the UserQueueForm component because we pass the selectedCustomer
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  toggleEditFacilityModal,
  addFacility
} from '../../actions/userQueueActions';
import { IinitialState } from '../../models';
import CommonModal from '../common/CommonModal';
import { TranslationFunction } from 'react-i18next';
import EditFacilityForm from '../common/EditFacilityForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
  selectedCustomer: { value: string; label: string };
}

interface IdispatchProps {
  showEditFacilityModal: boolean;
  loading: boolean;
  toggleEditFacilityModal: () => void;
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
