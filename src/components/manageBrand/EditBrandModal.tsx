/*
* Manage Brand Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState, ItableFiltersReducer
  // Ibuilding,
  // Ifloor,
  // Ilocation,
  // ItableFiltersReducer,
  // Ifacility
} from '../../models';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import CommonModal from '../common/CommonModal';
import EditBrandForm from './EditBrandForm';
import {saveBrand, updateBrand, toggleEditBrandModal} from "../../actions/manageBrandActions";

interface Iprops {
  selectedItem: any;
  selectedType: 'Brand';
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  saveBrand: typeof saveBrand;
  updateBrand: typeof updateBrand;
  toggleModal: () => void;
  tableFilters: ItableFiltersReducer;
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
        `manageBrand:edit${this.props.selectedType}`
      );
    } else {
      modalTitle = this.props.t(`manageBrand:new${this.props.selectedType}`);
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
    showModal: state.manageBrand.showEditBrandModal,
    tableFilters: state.manageBrand.tableFilters,
    // facility: state.manageLocation.facility,
    // selectedBuilding,
    // selectedFloor,
    // selectedLocation
  };
};

export default connect(
  mapStateToProps,
  {
    saveBrand,
    updateBrand,
    toggleModal: toggleEditBrandModal,
    updateQueueProduct
  }
)(ManageInventoryModal);
