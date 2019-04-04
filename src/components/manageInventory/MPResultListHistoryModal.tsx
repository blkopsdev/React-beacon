/*
* Measurement Point Results List History Modal
*/

import { TranslationFunction } from 'react-i18next';
import * as React from 'react';

import CommonModal from '../common/CommonModal';
import {
  toggleMPResultHistory,
  toggleMPResultNotes
} from 'src/actions/manageInventoryActions';
import { connect } from 'react-redux';
import { IinitialState, ImeasurementPointResult } from 'src/models';
import { MPResultHistory } from './MPResultHistory';
import { values } from 'lodash';
import { updateMeasurementPointResult } from 'src/actions/measurementPointResultsActions';
// import * as moment from 'moment';

interface Iprops {
  colorButton: any;
  secondModal: boolean;
  t: TranslationFunction;
  locationString: string;
  selectedInstallBaseID: string;
}
interface IdispatchProps {
  toggleModal: () => void;
  showModal: boolean;
  selectedItem: ImeasurementPointResult;
  MPListResults: ImeasurementPointResult[];
  updateMeasurementPointResult: typeof updateMeasurementPointResult;
  toggleMPResultNotes: () => void;
}

const MPResultListHistoryModalClass = (props: Iprops & IdispatchProps) => {
  const className = props.secondModal
    ? 'install-edit second-modal'
    : 'install-edit';

  return (
    <CommonModal
      modalVisible={props.showModal}
      className={className}
      onHide={props.toggleModal}
      body={
        <MPResultHistory
          {...props}
          installBaseID={props.selectedInstallBaseID}
        />
      }
      title={props.t('MPresultHistoryModalTitle')}
      container={document.getElementById('two-pane-layout')}
    />
  );
};

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  // let filteredInstallBaseResults: ImeasurementPointResult[] = [];
  //   filteredInstallBaseResults = values(filter(state.measurementPointResults.measurementPointResultsByID,
  //     result =>
  //       result.installBaseID === state.measurementPointResults.selectedResult.id
  //   ));

  // if (filteredInstallBaseResults.length) {
  //   filteredInstallBaseResults = orderBy(
  //     filteredInstallBaseResults,
  //     res => moment.utc(res.updateDate).unix(),
  //     'desc'
  //   );
  const MPListResults = values(
    state.measurementPointResults.measurementPointResultsByID
  );
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageInventory.showMPResultHistoryModal,
    selectedItem: state.measurementPointResults.selectedResult,
    MPListResults
  };
};

export const MPResultListHistoryModal = connect(
  mapStateToProps,
  {
    toggleModal: toggleMPResultHistory,
    updateMeasurementPointResult,
    toggleMPResultNotes
  }
)(MPResultListHistoryModalClass);
