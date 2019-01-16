import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

// import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  ImeasurementPointList,
  ImeasurementPointQuestion
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointQuestionModal
} from '../../actions/manageMeasurementPointListsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementPointQuestionForm from './EditMeasurementPointQuestionForm';
import constants from '../../constants/constants';

interface Iprops {
  selectedMeasurementPointList: ImeasurementPointList;
  selectedMeasurementPointQuestion: ImeasurementPointQuestion;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditMeasurementPointListModal: boolean;
  showEditMeasurementPointQuestionModal: boolean;
  loading: boolean;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointQuestionModal: typeof toggleEditMeasurementPointQuestionModal;
}

class EditMeasurementPointQuestionModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  getTitle() {
    if (
      this.props.selectedMeasurementPointQuestion &&
      this.props.selectedMeasurementPointQuestion.type ===
        constants.measurementPointQuestionTypes.PROCEDURE
    ) {
      return 'ProcedureModalTitle';
    } else if (
      this.props.selectedMeasurementPointQuestion &&
      this.props.selectedMeasurementPointQuestion.type ===
        constants.measurementPointQuestionTypes.GROUP
    ) {
      return 'GroupModalTitle';
    } else {
      return 'QuestionModalTitle';
    }
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditMeasurementPointQuestionModal}
        className="measurements-edit second-modal"
        onHide={this.props.toggleEditMeasurementPointQuestionModal}
        body={<EditMeasurementPointQuestionForm {...this.props} />}
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
    showEditMeasurementPointQuestionModal:
      state.manageMeasurementPointLists.showEditMeasurementPointQuestionModal
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditMeasurementPointListModal,
    toggleEditMeasurementPointQuestionModal
  }
)(EditMeasurementPointQuestionModal);
