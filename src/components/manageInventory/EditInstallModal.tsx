/*
* Manage Inventory Modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateInstall,
  saveInstall,
  toggleEditInstallModal
} from '../../actions/manageInventoryActions';
import {
  IinitialState,
  Iproduct,
  IproductInfo,
  IinstallBase
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
  customerOptions: any[];
  facilityOptions: any[];
  updateInstall: typeof updateInstall;
  saveInstall: typeof saveInstall;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  productInfo: IproductInfo;
}

class ManageInstallModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let submitFunc;
    let modalTitle;
    if (this.props.selectedItem.productID) {
      submitFunc = this.props.updateInstall;
      modalTitle = this.props.t('manageInventory:editInstallModalTitle');
    } else {
      submitFunc = this.props.saveInstall;
      modalTitle = this.props.t('manageInventory:saveInstallModalTitle');
    }
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleEditInstallModal}
        body={
          <EditInstallForm
            handleSubmit={submitFunc}
            handleCancel={this.props.toggleEditInstallModal}
            selectedItem={this.props.selectedItem}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            customerOptions={this.props.customerOptions}
            facilityOptions={this.props.facilityOptions}
            productInfo={this.props.productInfo}
          />
        }
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
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    showModal: state.manageInventory.showEditInstallModal,
    productInfo: state.manageInventory.productInfo
  };
};

export default connect(
  mapStateToProps,
  {
    updateInstall,
    saveInstall,
    toggleEditInstallModal
  }
)(ManageInstallModal);
