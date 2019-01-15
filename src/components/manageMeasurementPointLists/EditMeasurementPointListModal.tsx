import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, ImeasurementPointList, Ioption } from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointQuestionModal
} from '../../actions/manageMeasurementPointListsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementPointListForm from './EditMeasurementPointListForm';

interface Iprops {
  measurementPointListTypeOptions: any[];
  selectedMeasurementPointList: ImeasurementPointList;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditMeasurementPointListModal: boolean;
  loading: boolean;
  productGroupOptions: Ioption[];
  standardOptions: Ioption[];
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointQuestionModal: typeof toggleEditMeasurementPointQuestionModal;
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
    productGroupOptions: state.productInfo.productGroupOptions
  };
};

export default connect(
  mapStateToProps,
  {
    toggleEditMeasurementPointListModal,
    toggleEditMeasurementPointQuestionModal
  }
)(EditMeasurementPointListModal);
