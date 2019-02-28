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
  Observable
} from 'react-reactive-form';
import { forEach, differenceBy, find, filter } from 'lodash';
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

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

// const checkIfStartDateBeforeEndDate = (startDate, endDate) => {

// }

const buildFieldConfig = (
  customerOptions: any[],
  facilityOptions: any[],
  fseOptions: any[],
  getFacilitiesByCustomer: (value: string) => Promise<void>
) => {
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
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              getFacilitiesByCustomer(c.value.value);
            }
          }
        ]
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
      }
    }
  };
  const fieldConfig = {
    controls: { ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

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

class EditJobForm extends React.Component<Iprops, {}> {
  public jobForm: AbstractControl;
  public fieldConfig: FieldConfig;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        this.props.customerOptions,
        this.props.facilityOptions,
        this.props.fseOptions,
        this.props.getFacilitiesByCustomer
      ),
      this.props.t
    );
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      differenceBy(
        prevProps.facilityOptions,
        this.props.facilityOptions,
        'value'
      ).length ||
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facilitySelectControl = this.jobForm.get(
        'facilityID'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
      if (this.props.selectedJob) {
        const facilitiesArray = filter(
          this.props.facilityOptions,
          (fac: any) => {
            return (this.props.selectedJob.facilityID = fac.value);
          }
        );
        this.jobForm.patchValue({ facilityID: facilitiesArray[0] });
      } else {
        this.jobForm.patchValue({ facilityID: null });
      }
    }
    if (
      differenceBy(
        prevProps.customerOptions,
        this.props.customerOptions,
        'value'
      ).length ||
      prevProps.customerOptions.length !== this.props.customerOptions.length
    ) {
      const customerSelectControl = this.jobForm.get(
        'customerID'
      ) as AbstractControlEdited;
      customerSelectControl.meta.options = this.props.customerOptions;
      customerSelectControl.stateChanges.next();
      // now select the customer the user just added
      // might be a better way to do this, but we are comparing the two arrays and finding the new customer
      const newCustomer = filter(this.props.customerOptions, (cust: any) => {
        return find(prevProps.customerOptions, { value: cust.value })
          ? false
          : true;
      });
      this.jobForm.patchValue({ customerID: newCustomer[0] });
    }
  }

  componentDidMount() {
    if (!this.props.selectedJob) {
      return;
    }
    // set values
    forEach(this.props.selectedJob, (value, key) => {
      this.jobForm.patchValue({ [key]: value });
    });

    const {
      customerID,
      facilityID,
      assignedUserID,
      userJobs,
      jobTypeID,
      startDate,
      endDate
    } = this.props.selectedJob;
    this.jobForm.patchValue({
      customerID: find(
        this.props.customerOptions,
        (cust: Ioption) => cust.value === customerID
      )
    });
    // if there is a customerID then get facilities
    if (customerID.length) {
      this.props.getFacilitiesByCustomer(customerID);
    }
    const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      return facilityID === fac.value;
    });
    this.jobForm.patchValue({ facilityID: facilitiesArray[0] });

    this.jobForm.patchValue({
      startDate: moment.utc(startDate),
      endDate: moment.utc(endDate)
    });

    this.jobForm.patchValue({
      jobTypeID: find(
        constants.jobTypeOptions,
        (item: Ioption) => item.value === jobTypeID
      )
    });

    // if assigned user
    this.jobForm.patchValue({
      assignedUserID: find(
        this.props.fseOptions,
        (item: Ioption) => item.value === assignedUserID
      )
    });

    const fseArray = filter(this.props.fseOptions, (fac: any) => {
      return find(userJobs, { userID: fac.value }) ? true : false;
    });
    this.jobForm.patchValue({ users: fseArray });

    this.subscribeDateChanges();
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
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
      this.props.updateJob(
        {
          id: this.props.selectedJob.id,
          customerID: this.jobForm.value.customerID.value,
          facilityID: this.jobForm.value.facilityID.value,
          assignedUserID: this.jobForm.value.assignedUserID.value,
          jobTypeID: this.jobForm.value.jobTypeID.value,
          startDate: this.jobForm.value.startDate.format(),
          endDate: this.jobForm.value.endDate.format(),
          status: this.props.selectedJob.status
        },
        users
      );
    } else {
      this.props.createJob(
        {
          customerID: this.jobForm.value.customerID.value,
          facilityID: this.jobForm.value.facilityID.value,
          assignedUserID: this.jobForm.value.assignedUserID.value,
          jobTypeID: this.jobForm.value.jobTypeID.value,
          startDate: this.jobForm.value.startDate.format(),
          endDate: this.jobForm.value.endDate.format(),
          status: 'New'
        },
        users
      );
    }
  };
  setForm = (form: AbstractControl) => {
    this.jobForm = form;
    this.jobForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix job-form beacon-form ${
      this.props.colorButton
    }`;

    return (
      <form onSubmit={this.handleSubmit} className={formClassName}>
        <FormGenerator onMount={this.setForm} fieldConfig={this.fieldConfig} />
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
