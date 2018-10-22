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
import constants from '../../constants/constants';
import * as moment from 'moment';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

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
        placeholder: 'userManage:customerSearchPlaceholder'
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
        placeholder: 'userQueue:facilitySearchPlaceholder'
      },
      options: {
        validators: Validators.required
      }
    },
    jobTypeID: {
      render: FormUtil.Select,
      meta: {
        options: constants.typeOptions,
        label: 'jobManage:type',
        colWidth: 12,
        placeholder: 'jobManage:typeSearchPlaceholder'
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
        showTime: false
      },
      options: {
        validators: Validators.required
      }
    },
    endDate: {
      render: FormUtil.Datetime,
      meta: {
        label: 'jobManage:endDate',
        colWidth: 12,
        showTime: false
      },
      options: {
        validators: Validators.required
      }
    },
    assignedUserID: {
      render: FormUtil.Select,
      meta: {
        options: fseOptions,
        label: 'jobManage:fseLead',
        colWidth: 12,
        placeholder: 'jobManage:typeSearchPlaceholder'
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
        isMulti: true
      },
      options: {
        validators: Validators.required
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedJob) {
      return;
    }
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
      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        return (this.props.selectedJob.facilityID = fac.value);
      });
      this.jobForm.patchValue({ facilityID: facilitiesArray[0] });
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
      console.error('missing job');
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
        constants.typeOptions,
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
  }

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
        this.jobForm.value.users.map((u: any) => u.value)
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
        this.jobForm.value.users.map((u: any) => u.value)
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

    const formClassName = `job-form user-form manage-form ${
      this.props.colorButton
    }`;

    return (
      <div>
        <div className={formClassName}>
          <form onSubmit={this.handleSubmit} className="job-form">
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="link"
                type="button"
                className="pull-left left-side"
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
        </div>
      </div>
    );
  }
}
export default translate('jobManage')(EditJobForm);
