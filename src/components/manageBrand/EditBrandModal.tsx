/*
* Manage Brand Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { Ibrand, IinitialState, ItableFiltersReducer } from '../../models';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import CommonModal from '../common/CommonModal';
import EditBrandForm from './EditBrandForm';
import {
  saveBrand,
  updateBrand,
  toggleEditBrandModal,
  clearSelectedBrandID
} from '../../actions/manageBrandActions';
import { initialBrand } from '../../reducers/initialState';

interface Iprops {
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
  selectedBrand: Ibrand;
  clearSelectedID: typeof clearSelectedBrandID;
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
    if (this.props.selectedBrand && this.props.selectedBrand.id) {
      modalTitle = this.props.t(`manageBrand:editBrand`);
    } else {
      modalTitle = this.props.t(`manageBrand:newBrand`);
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
  const selectedBrand =
    state.manageBrand.data[state.manageBrand.selectedBrandID] || initialBrand;
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageBrand.showEditBrandModal,
    tableFilters: state.manageBrand.tableFilters,
    selectedBrandID: state.manageBrand.selectedBrandID,
    selectedBrand
  };
};

export default connect(
  mapStateToProps,
  {
    saveBrand,
    updateBrand,
    toggleModal: toggleEditBrandModal,
    updateQueueProduct,
    clearSelectedID: clearSelectedBrandID
  }
)(ManageInventoryModal);
