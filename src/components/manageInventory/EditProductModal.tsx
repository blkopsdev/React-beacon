/*
* Manage Inventory Modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateProduct,
  saveProduct,
  toggleEditProductModal
} from '../../actions/manageInventoryActions';
import { IinitialState, Iproduct, IproductInfo } from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import EditProductForm from './EditProductForm';
import { TranslationFunction } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';

interface Iprops {
  selectedItem: Iproduct;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateProduct: typeof updateProduct;
  saveProduct: typeof saveProduct;
  toggleEditProductModal: typeof toggleEditProductModal;
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
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleEditProductModal}
        body={
          <EditProductForm
            handleSubmit={submitFunc}
            handleCancel={this.props.toggleEditProductModal}
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
    showModal: state.manageInventory.showEditProductModal,
    productInfo: state.manageInventory.productInfo
  };
};

export default connect(
  mapStateToProps,
  {
    updateProduct,
    saveProduct,
    toggleEditProductModal
  }
)(ManageInventoryModal);
