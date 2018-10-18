/*
* The HeaderMenu only displays if we have an authenticated user.
* It is responsible for displaying the welcome message and the dropdown menu for logged in users
* spinner is from : http://tobiasahlin.com/spinkit/
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, Ijob } from '../../models';
import { getFacilitiesByCustomer } from '../../actions/commonActions';
import { updateJob, toggleEditJobModal } from '../../actions/manageJobActions';
import CommonModal from '../common/CommonModal';
import EditJobForm from './EditJobForm';

interface Iprops {
  selectedJob: Ijob;
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showEditJobModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  updateJob: typeof updateJob;
  toggleEditJobModal: typeof toggleEditJobModal;
  getFacilitiesByCustomer: (value: string) => Promise<void>;
}

class EditManageJobModal extends React.Component<Iprops & IdispatchProps, {}> {
  constructor(props: Iprops & IdispatchProps) {
    super(props);
  }

  render() {
    let modalTitle;
    if (this.props.selectedJob && this.props.selectedJob.id) {
      modalTitle = this.props.t('jobManage:editModalTitle');
    } else {
      modalTitle = this.props.t('jobManage:saveModalTitle');
    }
    return (
      <CommonModal
        modalVisible={this.props.showEditJobModal}
        className="job-edit"
        onHide={this.props.toggleEditJobModal}
        body={<EditJobForm {...this.props} />}
        title={modalTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  return {
    user: state.user,
    jobManage: state.manageJob,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    showEditJobModal: state.manageJob.showEditJobModal
  };
};

export default connect(
  mapStateToProps,
  {
    updateJob,
    toggleEditJobModal,
    getFacilitiesByCustomer
  }
)(EditManageJobModal);
