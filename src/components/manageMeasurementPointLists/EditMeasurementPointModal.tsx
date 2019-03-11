import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

// import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  ImeasurementPointList,
  ImeasurementPoint,
  ImeasurementPointListTab
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  saveMeasurementPointToMeasurementPointList,
  updateMeasurementPoint
} from '../../actions/manageMeasurementPointListsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementPointForm from './EditMeasurementPointForm';
import { constants } from 'src/constants/constants';
import { initialMeasurementPointTab } from 'src/reducers/initialState';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditMeasurementPointListModal: boolean;
  showEditMeasurementPointModal: boolean;
  loading: boolean;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  saveMeasurementPointToMeasurementPointList: typeof saveMeasurementPointToMeasurementPointList;
  selectedMeasurementPointList: ImeasurementPointList;
  selectedTab: ImeasurementPointListTab;
  updateMeasurementPoint: typeof updateMeasurementPoint;
  selectedMeasurementPoint: ImeasurementPoint;
}

class EditMeasurementPointModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  getTitle() {
    if (
      this.props.selectedMeasurementPoint.id.length &&
      this.props.selectedMeasurementPoint.type ===
        constants.measurementPointTypes.GROUP
    ) {
      return 'GroupModalTitle';
    } else {
      return 'measurementPointModalTitle';
    }
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditMeasurementPointModal}
        className="measurements-edit second-modal"
        onHide={this.props.toggleEditMeasurementPointModal}
        body={<EditMeasurementPointForm {...this.props} />}
        title={this.props.t(this.getTitle())}
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
    // userManage: state.manageUser,
    loading: state.ajaxCallsInProgress > 0,
    showEditMeasurementPointListModal:
      state.manageMeasurementPointLists.showEditMeasurementPointListModal,
    showEditMeasurementPointModal:
      state.manageMeasurementPointLists.showEditMeasurementPointModal,
    selectedTab,
    selectedMeasurementPointList:
      state.manageMeasurementPointLists.selectedMeasurementPointList,
    selectedMeasurementPoint:
      state.manageMeasurementPointLists.selectedMeasurementPoint
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditMeasurementPointListModal,
    toggleEditMeasurementPointModal,
    saveMeasurementPointToMeasurementPointList,
    updateMeasurementPoint
  }
)(EditMeasurementPointModal);
