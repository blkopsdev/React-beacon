/*
* Manage Install Modal - Container
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  IinstallBase,
  Iproduct,
  IproductInfo,
  ItableFiltersReducer,
  Ifacility,
  Iuser
} from '../../models';
import {
  updateInstall,
  saveInstall,
  toggleEditInstallModal,
  deleteInstall
} from '../../actions/manageInventoryActions';
import { saveAnyLocation } from '../../actions/manageLocationActions';
import CommonModal from '../common/CommonModal';
import EditInstallForm from './EditInstallForm';

interface Iprops {
  selectedProduct: Iproduct;
  selectedItem: IinstallBase;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  facility: Ifacility;
  updateInstall: typeof updateInstall;
  saveInstall: typeof saveInstall;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  productInfo: IproductInfo;
  deleteInstall: typeof deleteInstall;
  tableFilters: ItableFiltersReducer;
  secondModal: boolean;
  saveAnyLocation: any;
  user: Iuser;
}

class ManageInstallModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let modalTitle;
    if (this.props.selectedItem.id) {
      modalTitle = this.props.t('manageInventory:editInstallModalTitle');
    } else {
      modalTitle = this.props.t('manageInventory:saveInstallModalTitle');
    }
    const className = this.props.secondModal
      ? 'install-edit second-modal'
      : 'install-edit';

    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className={className}
        onHide={this.props.toggleEditInstallModal}
        body={<EditInstallForm {...this.props} />}
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
    facility: state.manageLocation.facility,
    showModal: state.manageInventory.showEditInstallModal,
    productInfo: state.manageInventory.productInfo,
    tableFilters: state.manageInventory.tableFilters,
    secondModal: state.manageInventory.showSearchNewProductsModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateInstall,
    saveInstall,
    toggleEditInstallModal,
    deleteInstall,
    saveAnyLocation
  }
)(ManageInstallModal);
