/*
* Manage Location Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iroom,
  ItableFiltersReducer,
  Ifacility
} from '../../models';
import {
  saveAnyLocation,
  updateAnyLocation,
  toggleEditLocationModal
} from '../../actions/manageLocationActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import CommonModal from '../common/CommonModal';
import EditLocationForm from './EditLocationForm';

interface Iprops {
  selectedItem: any;
  selectedType: string;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  saveAnyLocation: typeof saveAnyLocation;
  updateAnyLocation: typeof updateAnyLocation;
  toggleEditLocationModal: typeof toggleEditLocationModal;
  tableFilters: ItableFiltersReducer;
  facility: Ifacility;
  selectedBuilding: Ibuilding;
  selectedFloor: Ifloor;
  selectedLocation: Ilocation;
  selectedRoom: Iroom;
}

class ManageInventoryModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let modalTitle;
    if (this.props.selectedItem && this.props.selectedItem.id) {
      modalTitle = this.props.t(
        `manageLocation:edit${this.props.selectedType}`
      );
    } else {
      modalTitle = this.props.t(`manageLocation:new${this.props.selectedType}`);
    }
    const className = 'user-edit';
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className={className}
        onHide={this.props.toggleEditLocationModal}
        body={<EditLocationForm {...this.props} />}
        title={modalTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageLocation.showEditLocationModal,
    tableFilters: state.manageLocation.tableFilters,
    facility: state.manageLocation.facility,
    selectedBuilding: state.manageLocation.selectedBuilding,
    selectedFloor: state.manageLocation.selectedFloor,
    selectedLocation: state.manageLocation.selectedLocation,
    selectedRoom: state.manageLocation.selectedRoom
  };
};

export default connect(
  mapStateToProps,
  {
    saveAnyLocation,
    updateAnyLocation,
    toggleEditLocationModal,
    updateQueueProduct
  }
)(ManageInventoryModal);
