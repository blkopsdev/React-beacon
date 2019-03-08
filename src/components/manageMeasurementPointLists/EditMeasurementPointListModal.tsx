import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  ImeasurementPointList,
  Iuser,
  ImeasurementPointListTab,
  IproductInfo
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  addGlobalMeasurementPointList,
  updateGlobalMeasurementPointList,
  setSelectedTabID
} from '../../actions/manageMeasurementPointListsActions';
import CommonModal from '../common/CommonModal';
import EditMeasurementPointListForm from './EditMeasurementPointListForm';
import { initialMeasurementPointTab } from 'src/reducers/initialState';
// import { find } from 'lodash';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  user: Iuser;
  selectedMeasurementPointList: ImeasurementPointList;
  showEditMeasurementPointListModal: boolean;
  loading: boolean;
  productInfo: IproductInfo;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addGlobalMeasurementPointList: typeof addGlobalMeasurementPointList;
  updateGlobalMeasurementPointList: (
    m: ImeasurementPointList,
    l: boolean
  ) => Promise<void>;
  selectedTabID: string;
  selectedTab: ImeasurementPointListTab;
  setSelectedTabID: typeof setSelectedTabID;
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
  const selectedTab =
    state.manageMeasurementPointLists.selectedMeasurementPointList.measurementPointTabs.find(
      tab => tab.id === state.manageMeasurementPointLists.selectedTabID
    ) || initialMeasurementPointTab;
  return {
    user: state.user,
    userManage: state.manageUser,
    loading: state.ajaxCallsInProgress > 0,
    showEditMeasurementPointListModal:
      state.manageMeasurementPointLists.showEditMeasurementPointListModal,
    showEditCustomerModal: state.showEditCustomerModal,
    showEditFacilityModal: state.showEditFacilityModal,
    productInfo: state.productInfo,
    selectedTabID: state.manageMeasurementPointLists.selectedTabID,
    selectedTab,
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
    setSelectedTabID
  }
)(EditMeasurementPointListModal);
