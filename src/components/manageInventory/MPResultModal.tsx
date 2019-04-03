/*
* Measurement Point Results Modal
*/

import { TranslationFunction } from 'react-i18next';
import * as React from 'react';

import CommonModal from '../common/CommonModal';
import { toggleMPResultModal } from 'src/actions/manageInventoryActions';
import { connect } from 'react-redux';
import { IinitialState, ImeasurementPointResult } from 'src/models';
import { MPResultList } from './MPResultList';

interface Iprops {
  colorButton: any;
  secondModal: boolean;
  t: TranslationFunction;
}
interface IdispatchProps {
  toggleModal: () => void;
  showModal: boolean;
  selectedItem: ImeasurementPointResult;
}

const MPResultModalClass = (props: Iprops & IdispatchProps) => {
  const className = props.secondModal
    ? 'install-edit second-modal'
    : 'install-edit';

  return (
    <CommonModal
      modalVisible={props.showModal}
      className={className}
      onHide={props.toggleModal}
      body={<MPResultList {...props} />}
      title={props.t('MeasurementPointResultModalTitle')}
      container={document.getElementById('two-pane-layout')}
    />
  );
};

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showMPResultModal,
    selectedItem: state.measurementPointResults.selectedResult
  };
};

export const MPResultModal = connect(
  mapStateToProps,
  { toggleModal: toggleMPResultModal }
)(MPResultModalClass);
