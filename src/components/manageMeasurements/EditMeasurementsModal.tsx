import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, IMeasurementListObject, Ioption } from '../../models';
import {
  toggleEditMeasurementsModal,
  toggleEditGroupModal,
  toggleEditProcedureModal,
  toggleEditQuestionModal
} from '../../actions/manageMeasurementsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementsForm from './EditMeasurementsForm';

interface Iprops {
  measurementPointListTypeOptions: any[];
  selectedMeasurementPointList: IMeasurementListObject;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditMeasurementsModal: boolean;
  loading: boolean;
  productGroupOptions: Ioption[];
  standardOptions: Ioption[];
  toggleEditMeasurementsModal: typeof toggleEditMeasurementsModal;
  toggleEditQuestionModal: typeof toggleEditQuestionModal;
  toggleEditProcedureModal: typeof toggleEditProcedureModal;
  toggleEditGroupModal: typeof toggleEditGroupModal;
}

class EditMeasurementsModal extends React.Component<
  Iprops & IdispatchProps,
  {}
> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    return (
      <CommonModal
        modalVisible={this.props.showEditMeasurementsModal}
        className="measurements-edit"
        onHide={this.props.toggleEditMeasurementsModal}
        body={<EditMeasurementsForm {...this.props} />}
        title={this.props.t('editMeasurementsModalTitle')}
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
    showEditMeasurementsModal:
      state.manageMeasurements.showEditMeasurementsModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    standardOptions: state.productInfo.standardOptions,
    productGroupOptions: state.productInfo.productGroupOptions
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditMeasurementsModal,
    toggleEditGroupModal,
    toggleEditProcedureModal,
    toggleEditQuestionModal
  }
)(EditMeasurementsModal);
