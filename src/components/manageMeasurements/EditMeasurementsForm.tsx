/* 
* EditMeasurementsForm 
* Edit measurement point lists
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
  // Observable
} from 'react-reactive-form';
import { forEach, find } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import { Ioption, IMeasurementListObject } from '../../models';
import {
  toggleEditCustomerModal,
  toggleEditFacilityModal
} from '../../actions/commonActions';
import { toggleEditMeasurementsModal } from '../../actions/manageMeasurementsActions';
// import EditFacilityModal from '../common/EditFacilityModal';
import constants from '../../constants/constants';

// passing in an object, but we need an array back
// const securityOptions = [
//   ...FormUtil.convertToOptions(constants.securityFunctions)
// ];

// interface IstateChanges extends Observable<any> {
//   next: () => void;
// }

// interface AbstractControlEdited extends AbstractControl {
//   stateChanges: IstateChanges;
// }

const buildFieldConfig = (
  typeOptions: any[],
  productGroupOptions: any[],
  standardOptions: any[],
  toggleEditCustomerModalCB: typeof toggleEditCustomerModal,
  toggleEditFacilityModalCB: typeof toggleEditFacilityModal
) => {
  // Field config to configure form
  const fieldConfigControls = {
    type: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: typeOptions,
        label: 'manageMeasurements:type',
        colWidth: 12,
        placeholder: 'manageMeasurements:typePlaceholder'
      },
      options: {
        validators: [
          Validators.required
          // (c: any) => {
          //   if (c.value && c.value.value) {
          //     getFacilitiesByCustomer(c.value.value);
          //   }
          // }
        ]
      }
    },
    equipmentType: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: productGroupOptions,
        label: 'manageMeasurements:equipmentType',
        colWidth: 12,
        placeholder: 'manageMeasurements:equipmentTypePlaceholder'
      },
      options: {
        validators: [
          Validators.required
          // (c: any) => {
          //   if (c.value && c.value.value) {
          //     getFacilitiesByCustomer(c.value.value);
          //   }
          // }
        ]
      }
    },
    standard: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: standardOptions,
        label: 'manageMeasurements:standard',
        colWidth: 12,
        placeholder: 'manageMeasurements:standardPlaceholder'
      },
      options: {
        validators: [
          Validators.required
          // (c: any) => {
          //   if (c.value && c.value.value) {
          //     getFacilitiesByCustomer(c.value.value);
          //   }
          // }
        ]
      }
    }
  };
  const fieldConfig = {
    controls: { ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

interface Iprops extends React.Props<EditMeasurementsForm> {
  selectedMeasurementPointList: IMeasurementListObject;
  measurementPointListTypeOptions: any[];
  standardOptions: Ioption[];
  productGroupOptions: Ioption[];
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementsModal: typeof toggleEditMeasurementsModal;
  toggleEditCustomerModal: typeof toggleEditCustomerModal;
  toggleEditFacilityModal: typeof toggleEditFacilityModal;
}

class EditMeasurementsForm extends React.Component<Iprops, {}> {
  public measurementsForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        this.props.measurementPointListTypeOptions,
        this.props.productGroupOptions,
        this.props.standardOptions,
        this.props.toggleEditCustomerModal,
        this.props.toggleEditFacilityModal
      ),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedMeasurementPointList) {
      return;
    }
    // if (
    //   differenceBy(
    //     prevProps.facilityOptions,
    //     this.props.facilityOptions,
    //     'value'
    //   ).length ||
    //   prevProps.facilityOptions.length !== this.props.facilityOptions.length
    // ) {
    //   const facilitySelectControl = this.measurementsForm.get(
    //     'facilities'
    //   ) as AbstractControlEdited;
    //   facilitySelectControl.meta.options = this.props.facilityOptions;
    //   facilitySelectControl.stateChanges.next();
    //   const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
    //     return find(this.props.selectedMeasurementPointList.facilities, { id: fac.value })
    //       ? true
    //       : false;
    //   });
    //   this.measurementsForm.patchValue({ facilities: facilitiesArray });
    // }
    // if (
    //   differenceBy(
    //     prevProps.customerOptions,
    //     this.props.customerOptions,
    //     'value'
    //   ).length ||
    //   prevProps.customerOptions.length !== this.props.customerOptions.length
    // ) {
    //   const customerSelectControl = this.measurementsForm.get(
    //     'customerID'
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
    //   this.measurementsForm.patchValue({ customerID: newCustomer[0] });
    // }
  }

  componentDidMount() {
    if (!this.props.selectedMeasurementPointList) {
      console.error('missing measurement point list');
      return;
    }
    // set values
    forEach(this.props.selectedMeasurementPointList, (value, key) => {
      this.measurementsForm.patchValue({ [key]: value });
    });

    const {
      type,
      productGroupID,
      standardID
    } = this.props.selectedMeasurementPointList;
    this.measurementsForm.patchValue({
      type: find(
        this.props.measurementPointListTypeOptions,
        (tOpt: any) => tOpt.value === type
      )
    });
    this.measurementsForm.patchValue({
      equipmentType: find(
        this.props.productGroupOptions,
        (tOpt: any) => tOpt.value === productGroupID
      )
    });
    this.measurementsForm.patchValue({
      standard: find(
        this.props.standardOptions,
        (tOpt: any) => tOpt.value === standardID
      )
    });
  }
  // componentWillUnmount() {}

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove?: boolean
  ) => {
    e.preventDefault();
    if (this.measurementsForm.status === 'INVALID') {
      this.measurementsForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.measurementsForm.value);
    // const facilitiesArray = map(
    //   this.measurementsForm.value.facilities,
    //   (option: { value: string; label: string }) => {
    //     return { id: option.value };
    //   }
    // );
    // const securityFunctionsArray = map(
    //   this.measurementsForm.value.securityFunctions,
    //   (option: { value: string; label: string }) => {
    //     return option.value;
    //   }
    // );
    // this.props.updateUser({
    //   id: this.props.selectedMeasurementPointList.id,
    //   ...this.measurementsForm.value,
    //   customerID: this.measurementsForm.value.customerID.value,
    //   facilities: facilitiesArray,
    //   securityFunctions: securityFunctionsArray,
    //   email: this.props.selectedMeasurementPointList.email // have to add back the email because disabling the input removes it
    // });
  };
  setForm = (form: AbstractControl) => {
    this.measurementsForm = form;
    this.measurementsForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;
    // const selectedCustomer = this.measurementsForm
    //   ? this.measurementsForm.value.customerID
    //   : undefined;

    const formClassName = `clearfix beacon-form ${this.props.colorButton}`;

    return (
      <div>
        <form onSubmit={this.handleSubmit} className={formClassName}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.fieldConfig}
          />
          <Col xs={12} className="">
            <Button bsStyle="link" className="" onClick={console.log}>
              Add Group
            </Button>
            <Button bsStyle="link" className="" onClick={console.log}>
              Add Procedure
            </Button>
            <Button bsStyle="link" className="" onClick={console.log}>
              Add Question
            </Button>
          </Col>
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleEditMeasurementsModal}
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
        {/* <EditFacilityModal
          t={this.props.t}
          colorButton={this.props.colorButton}
          selectedCustomer={selectedCustomer}
        /> */}
      </div>
    );
  }
}
export default translate('manageMeasurements')(EditMeasurementsForm);
