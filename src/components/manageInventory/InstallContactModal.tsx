/*
* Manage Install Modal - Container
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  IinstallBase,
  Iproduct,
  IproductInfo
} from '../../models';
import {
  toggleInstallContactModal,
  installContact
} from '../../actions/manageInventoryActions';
import CommonModal from '../common/CommonModal';
import InstallContactForm from './InstallContactForm';

interface Iprops {
  selectedInstall: IinstallBase;
  selectedProduct: Iproduct;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  toggleInstallContactModal: typeof toggleInstallContactModal;
  installContact: typeof installContact;
  productInfo: IproductInfo;
}

class InstallContactModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="install-edit"
        onHide={this.props.toggleInstallContactModal}
        body={
          <InstallContactForm
            {...this.props}
            productName={this.props.selectedProduct.name}
          />
        }
        title={this.props.t('installContactTitle')}
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
    showModal: state.manageInventory.showInstallContactModal,
    productInfo: state.productInfo,
    tableFilters: state.manageInventory.tableFilters
  };
};

export default connect(
  mapStateToProps,
  {
    toggleInstallContactModal,
    installContact
  }
)(InstallContactModal);
