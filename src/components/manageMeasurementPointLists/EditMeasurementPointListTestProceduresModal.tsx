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
} from '../../actions/manageMeasurementPointListsActions';
import { initialMeasurementPointTab } from '../../reducers/initialState';
import { EditMeasurementPointListTestProceduresForm } from './EditMeasurementPointListTestProceduresForm';

interface Iprops {
  colorButton: string;
  t: TranslationFunction;
  customerID: string;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  toggleModal: () => void;
  selectedTab: ImeasurementPointListTab;
  selectedMeasurementPointList: ImeasurementPointList;
  updateGlobalMeasurementPointList: (
    mpl: ImeasurementPointList,
    persistToAPI: boolean,
    isCustomer: boolean
  ) => Promise<void>;
}

class EditMeasurementPointListTestProceduresModalClass extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  render() {
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="edit-tab second-modal"
        onHide={this.props.toggleModal}
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
    toggleModal: toggleEditMeasurementPointListTestProceduresModal,
    updateGlobalMeasurementPointList
  }
)(EditMeasurementPointListTestProceduresModalClass);
