/*
* Edit Management Point List Test Procedures Modal
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  ImeasurementPointListTab,
  ImeasurementPointList
} from '../../models';

import CommonModal from '../common/CommonModal';
import {
  updateGlobalMeasurementPointList,
  toggleEditMeasurementPointListTestProceduresModal
} from 'src/actions/manageMeasurementPointListsActions';
import { initialMeasurementPointTab } from 'src/reducers/initialState';
import { EditMeasurementPointListTestProceduresForm } from './EditMeasurementPointListTestProceduresForm';

interface Iprops {
  colorButton: string;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  toggleEditMeasurementPointListTestProceduresModal: typeof toggleEditMeasurementPointListTestProceduresModal;
  selectedTab: ImeasurementPointListTab;
  selectedMeasurementPointList: ImeasurementPointList;
  updateGlobalMeasurementPointList: typeof updateGlobalMeasurementPointList;
}

class EditMeasurementPointListTestProceduresModalClass extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="edit-tab second-modal"
        onHide={this.props.toggleEditMeasurementPointListTestProceduresModal}
        body={<EditMeasurementPointListTestProceduresForm {...this.props} />}
        title={this.props.t('editTestProcedures')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const selectedTab =
    state.manageMeasurementPointLists.selectedMeasurementPointList.measurementPointTabs.find(
      tab => tab.id === state.manageMeasurementPointLists.selectedTabID
    ) || initialMeasurementPointTab;
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal:
      state.manageMeasurementPointLists
        .showEditMeasurementPointListTestProceduresModal,
    selectedMeasurementPointList:
      state.manageMeasurementPointLists.selectedMeasurementPointList,
    selectedTab
  };
};

export const EditMeasurementPointListTestProceduresModal = connect(
  mapStateToProps,
  {
    toggleEditMeasurementPointListTestProceduresModal,
    updateGlobalMeasurementPointList
  }
)(EditMeasurementPointListTestProceduresModalClass);
