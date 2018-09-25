/*
* Manage Install Modal - Container
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateInstall,
  saveInstall,
  toggleEditInstallModal,
  deleteInstall
} from '../../actions/manageInventoryActions';
import {
  IinitialState,
  Iproduct,
  IproductInfo,
  IinstallBase,
  Ioption
} from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import EditInstallForm from './EditInstallForm';
import { TranslationFunction } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';

interface Iprops {
  selectedProduct: Iproduct;
  selectedItem: IinstallBase;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  facilityOptions: any[];
  updateInstall: typeof updateInstall;
  saveInstall: typeof saveInstall;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  productInfo: IproductInfo;
  selectedFacility: Ioption;
  deleteInstall: typeof deleteInstall;
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
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="install-edit"
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
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    showModal: state.manageInventory.showEditInstallModal,
    productInfo: state.manageInventory.productInfo,
    selectedFacility: state.manageInventory.selectedFacility
  };
};

export default connect(
  mapStateToProps,
  {
    updateInstall,
    saveInstall,
    toggleEditInstallModal,
    deleteInstall
  }
)(ManageInstallModal);
