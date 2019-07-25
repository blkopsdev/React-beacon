/* 
* EditJobForm 
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  FieldConfig,
  GroupProps,
  FormGroup
} from 'react-reactive-form';
import { find, filter } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Ioption, Ijob } from '../../models';
import { updateJob, createJob } from '../../actions/manageJobActions';
import { constants } from 'src/constants/constants';
import * as moment from 'moment';
import { getFacilitiesByCustomer } from 'src/actions/commonActions';

interface Iprops {
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
  toggleModal: () => void;
  updateFormValue: (formValue: { [key: string]: any }) => void;
  setFormValues: (formValues: { [key: string]: any }) => void;
  formValues: { [key: string]: any };
  clearSelectedID: () => void;
}
interface Istate {
  fieldConfig: FieldConfig;
}

class EditJobForm extends React.Component<Iprops, Istate> {
  private formGroup: FormGroup;
  private subscription: any;
  private debounce: any;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: this.buildFieldConfig()
    };
  }
  componentWillMount() {
    if (this.props.selectedJob.customerID.length) {
      this.props.getFacilitiesByCustomer(this.props.selectedJob.customerID);
    }
    if (this.props.selectedJob.id.length) {
      if (this.props.formValues.id !== this.props.selectedJob.id) {
        this.props.setFormValues({ id: this.props.selectedJob.id });
      }
    } else {
      this.props.setFormValues({});
    }
  }

  componentDidUpdate(prevProps: Iprops) {
    if (
      JSON.stringify(prevProps.facilityOptions) !==
      JSON.stringify(this.props.facilityOptions)
    ) {
      this.setState({ fieldConfig: this.buildFieldConfig() });
    }
    if (
      JSON.stringify(prevProps.customerOptions) !==
      JSON.stringify(this.props.customerOptions)
    ) {
      this.setState({ fieldConfig: this.buildFieldConfig() });
    }
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.props.clearSelectedID();
  }

  buildFieldConfig = () => {
    const {
      customerOptions,
      facilityOptions,
      fseOptions,
      formValues
    } = this.props;
    const disabled = false;
    let {
      customerID,
      facilityID,
      jobTypeID,
      startDate,
      endDate,
      assignedUserID,
      userJobs
    } = this.props.selectedJob;

    customerID = formValues.customerID
      ? formValues.customerID.value
      : customerID;
    facilityID = formValues.facilityID
      ? formValues.facilityID.value
      : facilityID;
    jobTypeID = formValues.jobTypeID ? formValues.jobTypeID.value : jobTypeID;
    startDate = formValues.startDate ? formValues.startDate : startDate;
    endDate = formValues.endDate ? formValues.endDate : endDate;
    assignedUserID = formValues.assignedUserID
      ? formValues.assignedUserID.value
      : assignedUserID;
    userJobs = formValues.users ? formValues.users : userJobs;

    const selectedUsers = filter(this.props.fseOptions, (fac: any) => {
      return find(userJobs, (user: any) => {
        if (user.userID === fac.value || user.value === fac.value) {
          return true;
        } else {
          return false;
        }
      });
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
          label: 'type',
          colWidth: 12,
          placeholder: 'typeSearchPlaceholder',
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
          label: 'startDate',
          colWidth: 12,
          showTime: false,
          name: 'start-date'
          // isValidDate: (current: any) => {
          //   return (
          //     moment.isMoment(current) &&
          //     current.isAfter(moment().subtract(1, 'day'))
          //   );
          // }
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
          label: 'endDate',
          colWidth: 12,
          showTime: false,
          name: 'end-date',
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
          value: selectedEndDate,
          disabled
        }
      },
      assignedUserID: {
        render: FormUtil.Select,
        meta: {
          options: fseOptions,
          label: 'fseLead',
          colWidth: 12,
          placeholder: 'typeSearchPlaceholder',
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
          label: 'fseMembers',
          colWidth: 12,
          placeholder: 'typeSearchPlaceholder',
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
    return FormUtil.translateForm(fieldConfig, this.props.t);
  };

  /*
  * (reusable)
  * subscribe to the formGroup changes
  */
  subscribeToChanges = () => {
    for (const key in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(key)) {
        this.subscription = this.formGroup
          .get(key)
          .valueChanges.subscribe((value: any) => {
            this.onValueChanges(value, key);
          });
      }
    }
  };

  /*
  * (reusable)
  * set the table filters to redux on each value change
  */
  onValueChanges = (value: any, key: string) => {
    switch (key) {
      case 'startDate':
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          const startDateMoment = moment.isMoment(value)
            ? value
            : moment(value);
          this.props.updateFormValue({
            startDate: startDateMoment.toISOString()
          });
          this.checkIfStartDateBeforeEndDate({ startDate: value });
        }, 500);
        break;
      case 'endDate':
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          const endDateMoment = moment.isMoment(value) ? value : moment(value);
          this.props.updateFormValue({
            startDate: endDateMoment.toISOString()
          });
          this.checkIfStartDateBeforeEndDate({ endDate: value });
        }, 500);
        break;
      case 'customerID':
        this.props.updateFormValue({ [key]: value });
        if (value && value.value) {
          this.props.getFacilitiesByCustomer(value.value);
        }
        break;
      default:
        this.props.updateFormValue({ [key]: value });
        break;
    }
  };

  /*
  * Check if the date is in the past or if the start is before the end date
  * TODO the react-datetime does not call the validation function.  Next step is to replace react-datetime with react-datepicker
  */
  checkIfStartDateBeforeEndDate = ({ startDate, endDate }: any) => {
    console.log('checking start end date', startDate);
    if (startDate && moment.isMoment(startDate)) {
      if (startDate.isAfter(this.formGroup.value.endDate)) {
        toastr.warning(
          this.props.t('startDateWarning'),
          '',
          constants.toastrError
        );
        const startDateControl = this.formGroup.get('startDate');
        startDateControl.setErrors({ beforeStart: true });
      } else if (startDate.isBefore(moment(), 'day')) {
        toastr.warning(
          this.props.t('common:warning'),
          this.props.t('pastDateWarning'),
          constants.toastrError
        );
        // const startDateControl = this.formGroup.get('startDate');
        // startDateControl.setErrors({ beforeStart: true });
      } else {
        const startDateControl = this.formGroup.get('startDate');
        startDateControl.setErrors(null);
      }
    } else if (endDate && moment.isMoment(endDate)) {
      if (this.formGroup.value.startDate.isAfter(endDate)) {
        toastr.warning(
          this.props.t('startDateWarning'),
          '',
          constants.toastrError
        );
        const endDateControl = this.formGroup.get('endDate');
        endDateControl.setErrors({ beforeStart: true });
      } else if (endDate.isBefore(moment(), 'day')) {
        toastr.warning(
          this.props.t('common:warning'),
          this.props.t('pastDateWarning'),
          constants.toastrError
        );
        // const endDateControl = this.formGroup.get('endDate');
        // endDateControl.setErrors({ beforeStart: true });
      } else {
        const endDateControl = this.formGroup.get('endDate');
        endDateControl.setErrors(null);
      }
    } else {
      console.error('missing start and end date');
    }
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.formGroup.status === 'INVALID') {
      this.formGroup.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.formGroup.value);
    if (this.props.selectedJob.id.length) {
      this.props.updateJob(this.props.selectedJob, this.formGroup.value);
    } else {
      this.props.createJob(this.formGroup.value);
    }
  };
  setForm = (form: FormGroup) => {
    this.formGroup = form;
    this.formGroup.meta = {
      loading: this.props.loading
    };
    this.subscribeToChanges();
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
            onClick={() => {
              this.props.toggleModal();
              this.props.setFormValues({});
            }}
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
