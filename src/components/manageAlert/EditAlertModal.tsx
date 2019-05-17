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
  // IAlert
} from '../../models';
import {
  saveAlert,
  updateAlert,
  toggleEditAlertModal
} from '../../actions/manageAlertActions';
import CommonModal from '../common/CommonModal';
import EditAlertForm from './EditAlertForm';
import { initialAlert } from '../../reducers/initialState';
import {
  clearSelectedAlertID,
  setAlertFormValues,
  updateAlertFormValue
} from '../../actions/manageAlertActions';

// import { map } from 'lodash';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditAlertModal: boolean;
  loading: boolean;
  toggleModal: typeof toggleEditAlertModal;
  saveAlert: typeof saveAlert;
  updateAlert: typeof updateAlert;
  selectedAlert: any;
  clearSelectedAlertID: typeof clearSelectedAlertID;
  updateFormValue: typeof updateAlertFormValue;
  setFormValues: typeof setAlertFormValues;
  formValues: { [key: string]: any };
}

class EditAlertModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditAlertModal}
        className="alert-edit"
        onHide={this.props.toggleModal}
        body={
          <EditAlertForm
            {...this.props}
            handleSubmit={this.props.saveAlert}
            handleEdit={this.props.updateAlert}
            handleCancel={this.props.toggleModal}
            colorButton={this.props.colorButton}
            loading={this.props.loading}
          />
        }
        title={this.props.t('common:newAlertModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const selectedAlert =
    state.manageAlert.data[state.manageAlert.selectedAlertID] || initialAlert;
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showEditAlertModal: state.manageAlert.showEditAlertModal,
    selectedAlert,
    formValues: state.manageAlert.alertFormValues
  };
};

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleEditAlertModal,
    saveAlert,
    updateAlert,
    clearSelectedAlertID,
    updateFormValue: updateAlertFormValue,
    setFormValues: setAlertFormValues
  }
)(EditAlertModal);
