/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import * as React from 'react';
import { connect } from 'react-redux';
import { toggleEditCustomerModal } from '../../actions/userQueueActions';
import {
  IinitialState
  // Icustomer
} from '../../models';
import CommonModal from '../common/CommonModal';
import { TranslationFunction } from 'react-i18next';
// import { map } from 'lodash';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditCustomerModal: boolean;
  loading: boolean;
  toggleEditCustomerModal: () => void;
}

class EditQueueUserModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditCustomerModal}
        className="customer-edit second-modal"
        onHide={this.props.toggleEditCustomerModal}
        body={<div> make the customer form </div>}
        title={this.props.t('common:editCustomerModalTitle')}
        container={document.getElementById('two-pane-layout')}
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
    toggleEditCustomerModal
  }
)(EditQueueUserModal);
