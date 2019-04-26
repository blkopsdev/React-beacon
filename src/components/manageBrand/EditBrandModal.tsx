/*
* Manage Brand Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState
  // Ibuilding,
  // Ifloor,
  // Ilocation,
  // ItableFiltersReducer,
  // Ifacility
} from '../../models';
import {
  saveAnyLocation,
  updateAnyLocation,
  toggleEditLocationModal
} from '../../actions/manageLocationActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import CommonModal from '../common/CommonModal';
import EditBrandForm from './EditBrandForm';

interface Iprops {
  selectedItem: any;
  selectedType: 'Building' | 'Floor' | 'Location' | 'Room';
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  // saveAnyLocation: typeof saveAnyLocation;
  // updateAnyLocation: typeof updateAnyLocation;
  toggleModal: () => void;
  // tableFilters: ItableFiltersReducer;
  // facility: Ifacility;
  // selectedBuilding: Ibuilding;
  // selectedFloor: Ifloor;
  // selectedLocation: Ilocation;
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
        onHide={this.props.toggleModal}
        body={<EditBrandForm {...this.props} />}
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
    showModal: state.manageBrand.showEditBrandModal
    // tableFilters: state.manageBrand.,
    // facility: state.manageLocation.facility,
    // selectedBuilding,
    // selectedFloor,
    // selectedLocation
  };
};

export default connect(
  mapStateToProps,
  {
    saveAnyLocation,
    updateAnyLocation,
    toggleModal: toggleEditLocationModal,
    updateQueueProduct
  }
)(ManageInventoryModal);
