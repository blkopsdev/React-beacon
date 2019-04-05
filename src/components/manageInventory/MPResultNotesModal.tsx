/*
* Measurement Point Result Notes Modal
*/

import { TranslationFunction } from 'react-i18next';
import * as React from 'react';

import CommonModal from '../common/CommonModal';
import {
  toggleMPResultModal,
  toggleMPResultNotes
} from 'src/actions/manageInventoryActions';
import { connect } from 'react-redux';
import { IinitialState, ImeasurementPointResult } from 'src/models';
import { RichTextView } from '../common/RichTextView';

interface Iprops {
  colorButton: any;
  secondModal: boolean;
  t: TranslationFunction;
}
interface IdispatchProps {
  toggleModal: typeof toggleMPResultModal;
  showModal: boolean;
  selectedItem: ImeasurementPointResult;
}

const MPResultListNotesModalClass = (props: Iprops & IdispatchProps) => {
  const className = props.secondModal
    ? 'install-edit second-modal'
    : 'install-edit';

  return (
    <CommonModal
      modalVisible={props.showModal}
      className={className}
      onHide={props.toggleModal}
      body={
        <RichTextView
          {...props}
          HTMLcontent={props.selectedItem.compiledNotes}
        />
      }
      title={props.t('MPResultNotesModalTitle')}
      container={document.getElementById('two-pane-layout')}
    />
  );
};

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showMPResultNotes,
    selectedItem: state.measurementPointResults.selectedResult
  };
};

export const MPResultListNotesModal = connect(
  mapStateToProps,
  { toggleModal: toggleMPResultNotes }
)(MPResultListNotesModalClass);
