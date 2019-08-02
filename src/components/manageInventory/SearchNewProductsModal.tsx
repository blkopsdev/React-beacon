/*
* Search New Products Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';
import { filter } from 'lodash';
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
  resetNewProducts
} from '../../actions/manageInventoryActions';
import CommonModal from '../common/CommonModal';
import SearchNewProductsForm from './SearchNewProductsForm';

interface Iprops {
  selectedItem: Iproduct;
  selectedQueueObject?: IproductQueueObject;
  colorButton: any;
  t: TranslationFunction;
  isApproved?: boolean;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  toggleEditProductModal: typeof toggleEditProductModal;
  toggleModal: () => void;
  productInfo: IproductInfo;
  tableFilters: ItableFiltersReducer;
  getProducts: typeof getProducts;
  newProducts: { [key: string]: Iproduct };
  resetNewProducts: typeof resetNewProducts;
  secondModal?: boolean;
  handleProductSelect: (product: Iproduct) => void;
}

class SearchNewProductsModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  render() {
    const className = this.props.secondModal
      ? 'user-edit second-modal'
      : 'user-edit';
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className={className}
        onHide={this.props.toggleModal}
        body={<SearchNewProductsForm {...this.props} />}
        title={this.props.t('searchNewProductModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  // TODO temporary fix for unaproved products.   This can be removed once we start using the P3 API.
  // see this slack thread: https://thebigpixel.slack.com/archives/GCXFYDYKG/p1557935711142400
  const unApprovedProducts = filter(
    state.manageInventory.newProducts,
    product => {
      let shouldInclude = true;
      // if we are filtering for isApproved (in the productqueue merge list), then filter out non-approved products
      if (
        ownProps.isApproved !== undefined &&
        product.isApproved !== ownProps.isApproved
      ) {
        shouldInclude = false;
      }
      // if this product has been merged, never show it in the list of available products
      if (product.mergedProductID && product.mergedProductID.length) {
        shouldInclude = false;
      }
      return shouldInclude;
    }
  );

  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showSearchNewProductsModal,
    productInfo: state.productInfo,
    tableFilters: state.manageInventory.tableFilters,
    // newProducts: state.manageInventory.newProducts
    newProducts: unApprovedProducts
  };
};

export default connect(
  mapStateToProps,
  {
    updateProduct,
    saveProduct,
    toggleEditProductModal,
    getProducts,
    toggleModal: toggleSearchNewProductsModal,
    resetNewProducts
  }
)(SearchNewProductsModal);
