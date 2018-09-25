/*
* Edit Quote Modal - Container
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  addToCart,
  decreaseFromCart,
  deleteFromCart,
  updateQuantityCart,
  checkout
} from '../../actions/shoppingCartActions';
import { toggleEditQuoteModal } from '../../actions/manageInventoryActions';
import {
  IinitialState,
  IproductInfo,
  IshoppingCart,
  Ioption
} from '../../models';
// import constants from '../../constants/constants';
import CommonModal from '../common/CommonModal';
import EditQuoteForm from './EditQuoteForm';
import { TranslationFunction } from 'react-i18next';
import { FormUtil } from '../common/FormUtil';

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
  toggleEditQuoteModal: typeof toggleEditQuoteModal;
  cart: IshoppingCart;
  selectedFacility: Ioption;
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
        onHide={this.props.toggleEditQuoteModal}
        body={<EditQuoteForm {...this.props} />}
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
    showModal: state.manageInventory.showEditQuoteModal,
    productInfo: state.manageInventory.productInfo,
    cart: state.manageInventory.cart,
    selectedFacility: state.manageInventory.selectedFacility
  };
};

export default connect(
  mapStateToProps,
  {
    addToCart,
    decreaseFromCart,
    deleteFromCart,
    toggleEditQuoteModal,
    checkout,
    updateQuantityCart
  }
)(EditQuoteModal);
