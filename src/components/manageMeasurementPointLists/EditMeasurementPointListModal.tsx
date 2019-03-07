import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  IinitialState,
  ImeasurementPointList,
  Ioption,
  Iuser
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  addGlobalMeasurementPointList,
  updateGlobalMeasurementPointList,
  addQuestionToMeasurementPointList,
  deleteGlobalMeasurementPoint
} from '../../actions/manageMeasurementPointListsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementPointListForm from './EditMeasurementPointListForm';
// import { find } from 'lodash';

interface Iprops {
  measurementPointListTypeOptions: any[];
  // selectedMeasurementPointListId: ImeasurementPointList;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  user: Iuser;
  selectedMeasurementPointList: ImeasurementPointList;
  showEditMeasurementPointListModal: boolean;
  loading: boolean;
  mainCategoryOptions: Ioption[];
  standardOptions: Ioption[];
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addGlobalMeasurementPointList: typeof addGlobalMeasurementPointList;
  updateGlobalMeasurementPointList: typeof updateGlobalMeasurementPointList;
  addQuestionToMeasurementPointList: typeof addQuestionToMeasurementPointList;
  deleteGlobalMeasurementPoint: typeof deleteGlobalMeasurementPoint;
}

class EditMeasurementPointListModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditMeasurementPointListModal}
        className="measurements-edit"
        onHide={this.props.toggleEditMeasurementPointListModal}
        body={<EditMeasurementPointListForm {...this.props} />}
        title={this.props.t('EditMeasurementPointListModalTitle')}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    userManage: state.manageUser,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    showEditMeasurementPointListModal:
      state.manageMeasurementPointLists.showEditMeasurementPointListModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    standardOptions: state.productInfo.standardOptions,
    mainCategoryOptions: state.productInfo.mainCategoryOptions,
    selectedMeasurementPointList:
      state.manageMeasurementPointLists.selectedMeasurementPointList
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditMeasurementPointListModal,
    toggleEditMeasurementPointModal,
    addGlobalMeasurementPointList,
    updateGlobalMeasurementPointList,
    addQuestionToMeasurementPointList,
    deleteGlobalMeasurementPoint
  }
)(EditMeasurementPointListModal);
