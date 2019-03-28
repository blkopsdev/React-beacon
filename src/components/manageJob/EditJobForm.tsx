/* 
* EditJobForm 
* Edit existing users
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps
} from 'react-reactive-form';
import { find, filter } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Ioption, Ijob } from '../../models';
import {
  toggleEditJobModal,
  updateJob,
  createJob
} from '../../actions/manageJobActions';
import { constants } from 'src/constants/constants';
import * as moment from 'moment';
import { getFacilitiesByCustomer } from 'src/actions/commonActions';

interface Iprops extends React.Props<EditJobForm> {
  selectedJob: Ijob;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: Ioption[];
  getFacilitiesByCustomer: (value: string) => Promise<void>;
  facilityOptions: Ioption[];
  fseOptions: Ioption[];
  updateJob: typeof updateJob;
  createJob: typeof createJob;
  toggleEditJobModal: typeof toggleEditJobModal;
}
interface Istate {
  fieldConfig: FieldConfig;
}

class EditJobForm extends React.Component<Iprops, Istate> {
  public jobForm: AbstractControl;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: FormUtil.translateForm(this.buildFieldConfig(), this.props.t)
    };
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      JSON.stringify(prevProps.facilityOptions) !==
      JSON.stringify(this.props.facilityOptions)
    ) {
      const fieldConfig = FormUtil.translateForm(
        this.buildFieldConfig(),
        this.props.t
      );
      this.setState({ fieldConfig });
    }
    if (
      JSON.stringify(prevProps.customerOptions) !==
      JSON.stringify(this.props.customerOptions)
    ) {
      const fieldConfig = FormUtil.translateForm(
        this.buildFieldConfig(),
        this.props.t
      );
      this.setState({ fieldConfig });
    }
  }
  componentWillMount() {
    if (this.props.selectedJob.customerID.length) {
      this.props.getFacilitiesByCustomer(this.props.selectedJob.customerID);
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  buildFieldConfig = () => {
    const { customerOptions, facilityOptions, fseOptions } = this.props;
    const disabled = false;
    const {
      customerID,
      facilityID,
      jobTypeID,
      startDate,
      endDate,
      assignedUserID,
      userJobs
    } = this.props.selectedJob;

    const selectedUsers = filter(this.props.fseOptions, (fac: any) => {
      return find(userJobs, { userID: fac.value }) ? true : false;
    });
    const selectedCustomer =
      this.props.customerOptions.find(
        customer => customer.value === customerID
      ) || null;
    const selectedFacility =
      this.props.facilityOptions.find(
        facility => facility.value === facilityID
      ) || null;
    const selectedJobType =
      constants.jobTypeOptions.find(type => type.value === jobTypeID) || null;
    const selectedStartDate = moment.isMoment(startDate)
      ? startDate
      : moment.utc(startDate);
    const selectedEndDate = moment.isMoment(endDate)
      ? endDate
      : moment.utc(endDate);
    const selectedAssignedUser =
      this.props.fseOptions.find(fse => fse.value === assignedUserID) || null;

    // Field config to configure form
    const fieldConfigControls = {
      customerID: {
        render: FormUtil.Select,
        meta: {
          options: customerOptions,
          getFacilitiesByCustomer,
          label: 'common:customer',
          colWidth: 12,
          placeholder: 'userManage:customerSearchPlaceholder',
          name: 'customer'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: selectedCustomer,
          disabled
        }
      },
      facilityID: {
        render: FormUtil.Select,
        meta: {
          options: facilityOptions,
          label: 'common:facility',
          colWidth: 12,
          placeholder: 'userQueue:facilitySearchPlaceholder',
          name: 'facility'
        },
        options: {
          validators: Validators.required
        },
        formState: {
          value: selectedFacility,
          disabled
        }
      },
      jobTypeID: {
        render: FormUtil.Select,
        meta: {
          options: constants.jobTypeOptions,
          label: 'jobManage:type',
          colWidth: 12,
          placeholder: 'jobManage:typeSearchPlaceholder',
          name: 'job-type'
        },
        options: {
          validators: Validators.required
        },
        formState: {
          value: selectedJobType,
          disabled
        }
      },
      startDate: {
        render: FormUtil.Datetime,
        meta: {
          label: 'jobManage:startDate',
          colWidth: 12,
          showTime: false,
          name: 'start-date',
          isValidDate: (current: any) => {
            return (
              moment.isMoment(current) &&
              current.isAfter(moment().subtract(1, 'day'))
            );
          }
        },
        options: {
          validators: [Validators.required, FormUtil.validators.isValidMoment]
        },
        formState: {
          value: selectedStartDate,
          disabled
        }
      },
      endDate: {
        render: FormUtil.Datetime,
        meta: {
          label: 'jobManage:endDate',
          colWidth: 12,
          showTime: false,
          name: 'end-date',
          isValidDate: (current: any) => {
            return moment.isMoment(current) && current.isAfter(moment());
          }
        },
        options: {
          validators: [Validators.required, FormUtil.validators.isValidMoment]
        },
        formState: {
          value: selectedEndDate,
          disabled
        }
      },
      assignedUserID: {
        render: FormUtil.Select,
        meta: {
          options: fseOptions,
          label: 'jobManage:fseLead',
          colWidth: 12,
          placeholder: 'jobManage:typeSearchPlaceholder',
          name: 'assigned-lead-user'
        },
        options: {
          validators: Validators.required
        },
        formState: {
          value: selectedAssignedUser,
          disabled
        }
      },
      users: {
        render: FormUtil.Select,
        meta: {
          options: fseOptions,
          label: 'jobManage:fseMembers',
          colWidth: 12,
          placeholder: 'jobManage:typeSearchPlaceholder',
          isMulti: true,
          name: 'assigned-user',
          required: false
        },
        formState: {
          value: selectedUsers,
          disabled
        }
      }
    } as { [key: string]: GroupProps };
    const fieldConfig = {
      controls: { ...fieldConfigControls }
    };
    return fieldConfig as FieldConfig;
  };
  subscribeDateChanges = () => {
    this.subscription = this.jobForm
      .get('startDate')
      .valueChanges.subscribe((value: any) => {
        this.checkIfStartDateBeforeEndDate({ startDate: value });
      });
    this.subscription = this.jobForm
      .get('endDate')
      .valueChanges.subscribe((value: any) => {
        this.checkIfStartDateBeforeEndDate({ endDate: value });
      });
    this.subscription = this.jobForm
      .get('customerID')
      .valueChanges.subscribe((value: any) => {
        if (value && value.value) {
          this.props.getFacilitiesByCustomer(value.value);
        }
      });
  };

  /*
  * Check if the date is in the past or if the start is before the end date
  * TODO the react-datetime does not call the validation function.  Next step is to replace react-datetime with react-datepicker
  */
  checkIfStartDateBeforeEndDate = ({ startDate, endDate }: any) => {
    console.log('checking start end date', startDate);
    if (startDate && moment.isMoment(startDate)) {
      if (startDate.isAfter(this.jobForm.value.endDate)) {
        toastr.warning(
          this.props.t('startDateWarning'),
          '',
          constants.toastrError
        );
        const startDateControl = this.jobForm.get('startDate');
        startDateControl.setErrors({ beforeStart: true });
      } else if (startDate.isBefore(moment(), 'day')) {
        toastr.warning(
          this.props.t('pastDateWarning'),
          '',
          constants.toastrError
        );
        const startDateControl = this.jobForm.get('startDate');
        startDateControl.setErrors({ beforeStart: true });
      } else {
        const startDateControl = this.jobForm.get('startDate');
        startDateControl.setErrors(null);
      }
    } else if (endDate && moment.isMoment(endDate)) {
      if (this.jobForm.value.startDate.isAfter(endDate)) {
        toastr.warning(
          this.props.t('startDateWarning'),
          '',
          constants.toastrError
        );
        const endDateControl = this.jobForm.get('endDate');
        endDateControl.setErrors({ beforeStart: true });
      } else if (endDate.isBefore(moment(), 'day')) {
        toastr.warning(
          this.props.t('pastDateWarning'),
          '',
          constants.toastrError
        );
        const endDateControl = this.jobForm.get('endDate');
        endDateControl.setErrors({ beforeStart: true });
      } else {
        const endDateControl = this.jobForm.get('endDate');
        endDateControl.setErrors(null);
      }
    } else {
      console.error('missing start and end date');
    }
  };

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove?: boolean
  ) => {
    e.preventDefault();
    if (this.jobForm.status === 'INVALID') {
      this.jobForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.jobForm.value);
    const users = this.jobForm.value.users
      ? this.jobForm.value.users.map((u: any) => u.value)
      : [];
    if (this.props.selectedJob && this.props.selectedJob.id) {
      this.props.updateJob(this.props.selectedJob, this.jobForm.value, users);
    } else {
      this.props.createJob(this.jobForm.value, users);
    }
  };
  setForm = (form: AbstractControl) => {
    this.jobForm = form;
    this.jobForm.meta = {
      loading: this.props.loading
    };
    this.subscribeDateChanges();
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix job-form beacon-form ${
      this.props.colorButton
    }`;

    return (
      <form onSubmit={this.handleSubmit} className={formClassName}>
        <FormGenerator
          onMount={this.setForm}
          fieldConfig={this.state.fieldConfig}
        />
        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle="default"
            type="button"
            className="pull-left"
            onClick={this.props.toggleEditJobModal}
          >
            {t('cancel')}
          </Button>
          <Button
            bsStyle={this.props.colorButton}
            type="submit"
            disabled={this.props.loading}
          >
            {t('save')}
          </Button>
        </Col>
      </form>
    );
  }
}
export default translate('jobManage')(EditJobForm);
