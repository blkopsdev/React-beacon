/*
* Measurement Point Result Add Status Modal
*/

import { TranslationFunction } from 'react-i18next';
import * as React from 'react';

import CommonModal from '../common/CommonModal';
import { toggleMPResultAddModal } from '../../actions/manageInventoryActions';
import { connect } from 'react-redux';
import { IinitialState } from '../../models';
import { submitMeasurementPointResult } from '../../actions/measurementPointResultsActions';
import { MPResultAddForm } from './MPResultAddForm';

interface Iprops {
  colorButton: any;
  secondModal: boolean;
  t: TranslationFunction;
  selectedInstallBaseID: string;
}
interface IdispatchProps {
  toggleModal: () => void;
  showModal: boolean;
  submitMeasurementPointResult: typeof submitMeasurementPointResult;
  loading: boolean;
}

const MPResultAddModalClass = (props: Iprops & IdispatchProps) => {
  const className = props.secondModal
    ? 'install-edit second-modal'
    : 'install-edit';

  return (
    <CommonModal
      modalVisible={props.showModal}
      className={className}
      onHide={props.toggleModal}
      body={<MPResultAddForm {...props} />}
      title={props.t('MPResultAddModalTitle')}
      container={document.getElementById('two-pane-layout')}
    />
  );
};

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showMPResultAddModal
  };
};

export const MPResultAddModal = connect(
  mapStateToProps,
  { toggleModal: toggleMPResultAddModal, submitMeasurementPointResult }
)(MPResultAddModalClass);
