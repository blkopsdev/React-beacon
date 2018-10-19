/*
* Search New Products Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  Iproduct,
  IproductInfo,
  ItableFiltersReducer,
  IproductQueueObject
} from '../../models';
import {
  updateProduct,
  saveProduct,
  toggleEditProductModal,
  toggleSearchNewProductsModal,
  getProducts,
  resetNewProducts,
  setSelectedProduct,
  toggleEditInstallModal
} from '../../actions/manageInventoryActions';
import CommonModal from '../common/CommonModal';
import SearchNewProductsForm from './SearchNewProductsForm';

interface Iprops {
  selectedItem: Iproduct;
  selectedQueueObject?: IproductQueueObject;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  toggleEditProductModal: typeof toggleEditProductModal;
  toggleSearchNewProductsModal: typeof toggleSearchNewProductsModal;
  productInfo: IproductInfo;
  tableFilters: ItableFiltersReducer;
  getProducts: typeof getProducts;
  newProducts: { [key: string]: Iproduct };
  resetNewProducts: typeof resetNewProducts;
  setSelectedProduct: typeof setSelectedProduct;
  toggleEditInstallModal: typeof toggleEditInstallModal;
}

class SearchNewProductsModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleSearchNewProductsModal}
        body={<SearchNewProductsForm {...this.props} />}
        title={this.props.t('searchNewProductModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showSearchNewProductsModal,
    productInfo: state.manageInventory.productInfo,
    tableFilters: state.manageInventory.tableFilters,
    newProducts: state.manageInventory.newProducts
  };
};

export default connect(
  mapStateToProps,
  {
    updateProduct,
    saveProduct,
    toggleEditProductModal,
    getProducts,
    toggleSearchNewProductsModal,
    toggleEditInstallModal,
    resetNewProducts,
    setSelectedProduct
  }
)(SearchNewProductsModal);
