/*
* Manage Product Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  Iproduct,
  IproductInfo,
  ItableFiltersReducer,
  IproductQueueObject,
  Iuser
} from '../../models';
import {
  updateProduct,
  saveProduct,
  toggleEditProductModal,
  toggleSearchNewProductsModal
} from '../../actions/manageInventoryActions';
import { updateQueueProduct } from '../../actions/manageProductQueueActions';
import CommonModal from '../common/CommonModal';
import EditProductForm from './EditProductForm';

interface Iprops {
  selectedItem: Iproduct;
  selectedQueueObject?: IproductQueueObject;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  updateProduct: typeof updateProduct;
  saveProduct: typeof saveProduct;
  toggleModal: () => void;
  productInfo: IproductInfo;
  tableFilters: ItableFiltersReducer;
  secondModal: boolean;
  updateQueueProduct: typeof updateQueueProduct;
  user: Iuser;
  toggleSearchNewProductsModal: typeof toggleSearchNewProductsModal;
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
    if (this.props.selectedQueueObject && this.props.selectedQueueObject.id) {
      modalTitle = this.props.t('manageProductQueue:editModalTitle');
    } else if (this.props.selectedItem && this.props.selectedItem.id) {
      modalTitle = this.props.t('manageInventory:editModalTitle');
    } else {
      modalTitle = this.props.t('manageInventory:saveModalTitle');
    }
    const className = this.props.secondModal
      ? 'user-edit second-modal'
      : 'user-edit';
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className={className}
        onHide={this.props.toggleModal}
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
    showModal: state.manageInventory.showEditProductModal,
    productInfo: state.productInfo,
    tableFilters: state.manageInventory.tableFilters
  };
};

export default connect(
  mapStateToProps,
  {
    updateProduct,
    saveProduct,
    toggleModal: toggleEditProductModal,
    updateQueueProduct,
    toggleSearchNewProductsModal
  }
)(ManageInventoryModal);
