/*
* Edit Job Modal and Redux Connector
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { IinitialState, Ijob } from '../../models';
import { getFacilitiesByCustomer } from '../../actions/commonActions';
import {
  updateJob,
  createJob,
  toggleEditJobModal,
  updateJobFormValue,
  setJobFormValues,
  clearSelectedJobID
} from '../../actions/manageJobActions';
import CommonModal from '../common/CommonModal';
import EditJobForm from './EditJobForm';
import { initialJob } from '../../reducers/initialState';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  selectedJob: Ijob;
  showEditJobModal: boolean;
  loading: boolean;
  customerOptions: any[];
  facilityOptions: any[];
  fseOptions: any[];
  updateJob: typeof updateJob;
  createJob: typeof createJob;
  toggleModal: () => void;
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
  clearSelectedID: () => void;
}

class EditManageJobModal extends React.Component<Iprops & IdispatchProps, {}> {
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
        onHide={this.props.toggleModal}
        body={<EditJobForm {...this.props} />}
        title={modalTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const selectedJob =
    state.manageJob.data[state.manageJob.selectedJobID] || initialJob;
  return {
    user: state.user,
    jobManage: state.manageJob,
    loading: state.ajaxCallsInProgress > 0,
    customerOptions: FormUtil.convertToOptions(state.customers),
    facilityOptions: FormUtil.convertToOptions(state.facilities),
    fseOptions: FormUtil.convertToOptions(state.manageJob.fseUsers),
    showEditJobModal: state.manageJob.showEditJobModal,
    formValues: state.manageJob.jobFormValues,
    selectedJob
  };
};

export default connect(
  mapStateToProps,
  {
    updateJob,
    createJob,
    toggleModal: toggleEditJobModal,
    getFacilitiesByCustomer,
    updateFormValue: updateJobFormValue,
    setFormValues: setJobFormValues,
    clearSelectedID: clearSelectedJobID
  }
)(EditManageJobModal);
