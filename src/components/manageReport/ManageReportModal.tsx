/*
* Manage Report Modal and Container
*/

import { TranslationFunction } from 'react-i18next';
import { connect } from 'react-redux';
import * as React from 'react';

import {
  IinitialState,
  Ireport,
  IdefaultReport,
  Ioption,
  Ijob
} from '../../models';
import CommonModal from '../common/CommonModal';
import {
  updateReport,
  runReport,
  toggleEditReportModal
} from '../../actions/manageReportActions';
import { FormUtil } from '../common/FormUtil';
import { constants } from '../../constants/constants';
import { initialDefaultReport } from '../../reducers/initialState';
import { map, orderBy, filter } from 'lodash';
import * as moment from 'moment';
import { EditReportForm } from './ManageReportForm';

interface Iprops {
  colorButton: any;
  t: TranslationFunction;
}

interface IdispatchProps {
  showModal: boolean;
  loading: boolean;
  toggleModal: () => void;
  selectedItem: Ireport;
  selectedDefaultReport: IdefaultReport;
  updateReport: typeof updateReport;
  runReport: typeof runReport;
  jobOptions: Ioption[];
}

class EditManageJobModal extends React.Component<Iprops & IdispatchProps, {}> {
  render() {
    const { t } = this.props;
    const modalTitle = t(
      constants.reportTypeEnumInverse[
        this.props.selectedDefaultReport.reportType
      ]
    );
    return (
      <CommonModal
        modalVisible={this.props.showModal}
        className="job-edit"
        onHide={this.props.toggleModal}
        body={<EditReportForm {...this.props} />}
        title={modalTitle}
        container={document.getElementById('two-pane-layout')}
      />
    );
  }
}

const mapStateToProps = (state: IinitialState, ownProps: Iprops) => {
  const { selectedDefaultReportID } = state.manageReport;
  const selectedDefaultReport =
    state.manageReport.defaultReportsByID[selectedDefaultReportID] ||
    initialDefaultReport;
  const facilityID = state.manageReport.tableFilters.facility
    ? state.manageReport.tableFilters.facility.value
    : state.user.facilities[0].id;
  const filteredJobs = filter(
    state.manageJob.data,
    job => job.facilityID === facilityID
  );
  const jobOptions = prepJobsForOptions(filteredJobs);
  return {
    user: state.user,
    loading: state.ajaxCallsInProgress > 0,
    showModal: state.manageReport.showEditReportModal,
    selectedItem: state.manageReport.selectedReport,
    selectedDefaultReport,
    jobOptions
  };
};

export default connect(
  mapStateToProps,
  {
    updateReport,
    runReport,
    toggleModal: toggleEditReportModal
  }
)(EditManageJobModal);

const prepJobsForOptions = (jobs: Ijob[]) => {
  const jobsWithName = map(jobs, job => {
    const startDate = moment
      .utc(job.startDate)
      .local()
      .format('MM/DD/YYYY');
    const jobType = constants.jobTypesByID[job.jobTypeID];
    const name = `${startDate} ${jobType}`;
    return { ...job, name };
  });

  return FormUtil.convertToOptions(
    orderBy(jobsWithName, res => moment.utc(res.startDate).unix(), 'desc')
  );
};
