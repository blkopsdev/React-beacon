/*
* Edit Management Point List Tab modal
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
  toggleEditMeasurementPointTabModal,
  updateMeasurementPointListTab
} from 'src/actions/manageMeasurementPointListsActions';
import { initialMeasurementPointTab } from 'src/reducers/initialState';
import { EditMeasurementPointListTabForm } from './EditMeasurementPointListTabForm';

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
  updateMeasurementPointListTab: typeof updateMeasurementPointListTab;
}

class EditMeasurementPointListTabModalClass extends React.Component<
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
        onHide={this.props.toggleModal}
        body={<EditMeasurementPointListTabForm {...this.props} />}
        title={this.props.t('editTab')}
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
      state.manageMeasurementPointLists.showEditMeasurementPointTabModal,
    selectedMeasurementPointList:
      state.manageMeasurementPointLists.selectedMeasurementPointList,
    selectedTab
  };
};

export const EditMeasurementPointListTabModal = connect(
  mapStateToProps,
  {
    toggleModal: toggleEditMeasurementPointTabModal,
    updateMeasurementPointListTab
  }
)(EditMeasurementPointListTabModalClass);
