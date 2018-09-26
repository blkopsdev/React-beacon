/*
* Manage Inventory Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  Iproduct,
  IproductInfo,
  ItableFilters
} from '../../models';
import {
  updateProduct,
  saveProduct,
  toggleEditProductModal
} from '../../actions/manageInventoryActions';
import CommonModal from '../common/CommonModal';
import EditProductForm from './EditProductForm';

interface Iprops {
  selectedItem: Iproduct;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  facilityOptions: any[];
  updateProduct: typeof updateProduct;
  saveProduct: typeof saveProduct;
  toggleEditProductModal: typeof toggleEditProductModal;
  productInfo: IproductInfo;
  tableFilters: ItableFilters;
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
      modalTitle = this.props.t('manageInventory:editModalTitle');
    } else {
      modalTitle = this.props.t('manageInventory:saveModalTitle');
    }
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleEditProductModal}
        body={<EditProductForm {...this.props} />}
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
    showModal: state.manageInventory.showEditProductModal,
    productInfo: state.manageInventory.productInfo,
    tableFilters: state.manageInventory.tableFilters
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
