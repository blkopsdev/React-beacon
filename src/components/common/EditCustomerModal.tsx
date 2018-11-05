/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState
  // Icustomer
} from '../../models';
import {
  addCustomer,
  toggleEditCustomerModal
} from '../../actions/commonActions';
import CommonModal from '../common/CommonModal';
import EditCustomerForm from '../common/EditCustomerForm';

// import { map } from 'lodash';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditCustomerModal: boolean;
  loading: boolean;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  addCustomer: typeof addCustomer;
}

class EditCustomerModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditCustomerModal}
        className="customer-edit second-modal"
        onHide={this.props.toggleEditCustomerModal}
        body={
          <EditCustomerForm
            handleSubmit={this.props.addCustomer}
            handleCancel={this.props.toggleEditCustomerModal}
            colorButton={this.props.colorButton}
            loading={this.props.loading}
          />
        }
        title={this.props.t('common:newCustomerModalTitle')}
        container={document.getElementById('modal-two')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditCustomerModal: state.showEditCustomerModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditCustomerModal,
    addCustomer
  }
)(EditCustomerModal);
