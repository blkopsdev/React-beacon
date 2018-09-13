/*
* Manage Inventory Modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateProduct,
  saveProduct,
  toggleEditInventoryModal
} from '../../actions/manageInventoryActions';
import { IinitialState, Iproduct, IproductInfo } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import ManageInventoryForm from './ManageInventoryForm';
import { TranslationFunction } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';

interface Iprops {
  selectedItem: Iproduct;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditUserModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateProduct: typeof updateProduct;
  saveProduct: typeof saveProduct;
  toggleEditInventoryModal: typeof toggleEditInventoryModal;
  productInfo: IproductInfo;
}

class ManageInventoryModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let submitFunc;
    let modalTitle;
    if (this.props.selectedItem) {
      submitFunc = this.props.updateProduct;
      modalTitle = this.props.t('manageInventory:editModalTitle');
    } else {
      submitFunc = this.props.saveProduct;
      modalTitle = this.props.t('manageInventory:saveModalTitle');
    }
    return (
      <CommonModal
        modalVisible={this.props.showEditUserModal}
        className="user-edit"
        onHide={this.props.toggleEditInventoryModal}
        body={
          <ManageInventoryForm
            handleSubmit={submitFunc}
            handleCancel={this.props.toggleEditInventoryModal}
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
    userManage: state.teamManage,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    showEditUserModal: state.showEditInventoryModal,
    productInfo: state.productInfo
  };
};

export default connect(
  mapStateToProps,
  {
    updateProduct,
    saveProduct,
    toggleEditInventoryModal
  }
)(ManageInventoryModal);