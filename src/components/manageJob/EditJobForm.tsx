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
import { forEach, differenceBy } from 'lodash'; // find, filter
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Ioption, Ijob } from '../../models';
import { toggleEditJobModal, updateJob } from '../../actions/manageJobActions';
import constants from '../../constants/constants';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const FormTable = ({
  handler,
  touched,
  hasError,
  meta,
  pristine,
  errors,
  submitted
}: AbstractControl) => <Col xs={meta.colWidth}>{meta.label}</Col>;

const buildFieldConfig = (
  customerOptions: any[],
  facilityOptions: any[],
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
    type: {
      render: FormUtil.Select,
      meta: {
        options: constants.typeOptions,
        label: 'common:type',
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
        colWidth: 6
      },
      options: {
        validators: Validators.required
      }
    },
    endDate: {
      render: FormUtil.Datetime,
      meta: {
        label: 'jobManage:endDate',
        colWidth: 6
      },
      options: {
        validators: Validators.required
      }
    },
    fseList: {
      render: FormTable,
      meta: {
        colWidth: 12,
        data: [
          { id: 1, name: 'Martin Shueltz', isLead: true },
          { id: 2, name: 'Denise Richards', isLead: false }
        ]
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
  updateJob: typeof updateJob;
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
      // const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      //   return find(this.props.selectedJob.facilities, { id: fac.value })
      //     ? true
      //     : false;
      // });
      this.jobForm.patchValue({ facilities: this.props.facilityOptions });
    }
    // if (
    //   differenceBy(
    //     prevProps.customerOptions,
    //     this.props.customerOptions,
    //     "value"
    //   ).length ||
    //   prevProps.customerOptions.length !== this.props.customerOptions.length
    // ) {
    //   const customerSelectControl = this.jobForm.get(
    //     "customerID"
    //   ) as AbstractControlEdited;
    //   customerSelectControl.meta.options = this.props.customerOptions;
    //   customerSelectControl.stateChanges.next();
    //   // now select the customer the user just added
    //   // might be a better way to do this, but we are comparing the two arrays and finding the new customer
    //   const newCustomer = filter(this.props.customerOptions, (cust: any) => {
    //     return find(prevProps.customerOptions, { value: cust.value })
    //       ? false
    //       : true;
    //   });
    //   this.jobForm.patchValue({ customerID: newCustomer[0] });
    // }
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

    // const {
    //   customerID,
    //   facilities,
    //   securityFunctions
    // } = this.props.selectedJob;
    // this.jobForm.patchValue({
    //   customerID: find(
    //     this.props.customerOptions,
    //     (cust: Ioption) => cust.value === customerID
    //   )
    // });
    // if there is a customerID then get facilities
    // if (customerID.length) {
    //   this.props.getFacilitiesByCustomer(customerID);
    // }
    // const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
    //   return find(facilities, { id: fac.value }) ? true : false;
    // });
    // this.jobForm.patchValue({ facilities: facilitiesArray });
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
    // this.props.updateUser({
    //   id: this.props.selectedJob.id,
    //   ...this.jobForm.value,
    //   customerID: this.jobForm.value.customerID.value,
    //   facilities: facilitiesArray,
    //   securityFunctions: securityFunctionsArray,
    //   email: this.props.selectedJob.email // have to add back the email because disabling the input removes it
    // });
  };
  setForm = (form: AbstractControl) => {
    this.jobForm = form;
    this.jobForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `job-form manage-form ${this.props.colorButton}`;

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
