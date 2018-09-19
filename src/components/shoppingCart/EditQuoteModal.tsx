/*
* Edit Quote Modal
*/

import * as React from 'react';
import { connect } from 'react-redux';
import {
  addToCart,
  decreaseFromCart,
  deleteFromCart,
  checkout
} from '../../actions/shoppingCartActions';
import { toggleEditQuoteModal } from '../../actions/manageInventoryActions';
import { IinitialState, IproductInfo } from '../../models';
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
  decreaseFromCart: typeof decreaseFromCart;
  deleteFromCart: typeof deleteFromCart;
  checkout: typeof checkout;
  toggleEditQuoteModal: typeof toggleEditQuoteModal;
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
        body={
          <EditQuoteForm
            handleSubmit={this.props.checkout}
            handleCancel={this.props.toggleEditQuoteModal}
            loading={this.props.loading}
            colorButton={this.props.colorButton}
            facilityOptions={this.props.facilityOptions}
            productInfo={this.props.productInfo}
          />
        }
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
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.user.facilities),
    showModal: state.manageInventory.showEditQuoteModal,
    productInfo: state.manageInventory.productInfo
  };
};

export default connect(
  mapStateToProps,
  {
    addToCart,
    decreaseFromCart,
    deleteFromCart,
    toggleEditQuoteModal,
    checkout
  }
)(EditQuoteModal);
