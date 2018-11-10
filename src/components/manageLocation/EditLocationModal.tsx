/*
* Manage Product Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { IinitialState, Ibuilding, ItableFiltersReducer } from '../../models';
import {
  saveBuilding,
  toggleEditLocationModal
} from '../../actions/manageLocationActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import CommonModal from '../common/CommonModal';
import EditLocationForm from './EditLocationForm';

interface Iprops {
  selectedItem: Ibuilding;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  saveBuilding: typeof saveBuilding;
  toggleEditLocationModal: typeof toggleEditLocationModal;
  tableFilters: ItableFiltersReducer;
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
      modalTitle = this.props.t('manageLocation:editModalTitle');
    } else {
      modalTitle = this.props.t('manageLocation:saveModalTitle');
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
    tableFilters: state.manageLocation.tableFilters
  };
};

export default connect(
  mapStateToProps,
  {
    saveBuilding,
    toggleEditLocationModal,
    updateQueueProduct
  }
)(ManageInventoryModal);
