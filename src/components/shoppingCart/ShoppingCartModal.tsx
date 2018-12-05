/*
* Edit Shopping Cart Modal - Container
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  IproductInfo,
  IshoppingCart,
  ItableFiltersReducer
} from '../../models';
import {
  addToCart,
  decreaseFromCart,
  deleteFromCart,
  updateQuantityCart,
  checkout,
  toggleShoppingCartModal
} from '../../actions/shoppingCartActions';
import CommonModal from '../common/CommonModal';
import ShoppingCartForm from './ShoppingCartForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  facilityOptions: any[];
  productInfo: IproductInfo;
  addToCart: typeof addToCart;
  updateQuantityCart: typeof updateQuantityCart;
  decreaseFromCart: typeof decreaseFromCart;
  deleteFromCart: typeof deleteFromCart;
  checkout: typeof checkout;
  toggleShoppingCartModal: typeof toggleShoppingCartModal;
  cart: IshoppingCart;
  tableFilters: ItableFiltersReducer;
}

class EditQuoteModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={this.props.toggleShoppingCartModal}
        body={<ShoppingCartForm {...this.props} />}
        title={this.props.t('manageInventory:requestForQuote')}
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
    showModal: state.manageInventory.showShoppingCartModal,
    productInfo: state.manageInventory.productInfo,
    cart: state.manageInventory.cart,
    tableFilters: state.manageInventory.tableFilters
  };
};

export default connect(
  mapStateToProps,
  {
    addToCart,
    decreaseFromCart,
    deleteFromCart,
    toggleShoppingCartModal,
    checkout,
    updateQuantityCart
  }
)(EditQuoteModal);
