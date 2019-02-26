import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

// import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  ImeasurementPointList,
  ImeasurementPoint
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  addQuestionToMeasurementPointList
} from '../../actions/manageMeasurementPointListsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementPointForm from './EditMeasurementPointForm';
import constants from '../../constants/constants';

interface Iprops {
  selectedMeasurementPointList: ImeasurementPointList;
  selectedMeasurementPoint: ImeasurementPoint;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditMeasurementPointListModal: boolean;
  showEditMeasurementPointModal: boolean;
  loading: boolean;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addQuestionToMeasurementPointList: typeof addQuestionToMeasurementPointList;
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
      this.props.selectedMeasurementPoint &&
      this.props.selectedMeasurementPoint.type ===
        constants.measurementPointTypes.PROCEDURE
    ) {
      return 'ProcedureModalTitle';
    } else if (
      this.props.selectedMeasurementPoint &&
      this.props.selectedMeasurementPoint.type ===
        constants.measurementPointTypes.GROUP
    ) {
      return 'GroupModalTitle';
    } else {
      return 'QuestionModalTitle';
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
  return {
    user: state.user,
    // userManage: state.manageUser,
    loading: state.ajaxCallsInProgress > 0,
    showEditMeasurementPointListModal:
      state.manageMeasurementPointLists.showEditMeasurementPointListModal,
    showEditMeasurementPointModal:
      state.manageMeasurementPointLists.showEditMeasurementPointModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditMeasurementPointListModal,
    toggleEditMeasurementPointModal,
    addQuestionToMeasurementPointList
  }
)(EditMeasurementPointModal);
