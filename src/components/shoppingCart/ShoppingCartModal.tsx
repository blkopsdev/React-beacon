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
  ItableFiltersReducer,
  Iuser
} from '../../models';
import {
  addToCart,
  decreaseFromCart,
  deleteFromCart,
  updateQuantityCart,
  toggleShoppingCartModal
} from '../../actions/shoppingCartActions';
import CommonModal from '../common/CommonModal';
import { requestQuote } from '../../actions/manageInventoryActions';

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
  checkout?: typeof requestQuote;
  toggleShoppingCartModal: typeof toggleShoppingCartModal;
  cart: IshoppingCart;
  tableFilters: ItableFiltersReducer;
  title: string;
  cartName: string;
  ShoppingCartForm: any;
  showCost?: boolean;
  user: Iuser;
}

class EditQuoteModal extends React.Component<Iprops & IdispatchProps, {}> {
  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="user-edit"
        onHide={() => this.props.toggleShoppingCartModal(this.props.cartName)}
        body={<this.props.ShoppingCartForm {...this.props} />}
        title={this.props.title}
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
    showModal:
      state.manageInventory.showShoppingCartModal ||
      state.training.showShoppingCartModal,
    productInfo: state.productInfo,
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
    updateQuantityCart
  }
)(EditQuoteModal);
