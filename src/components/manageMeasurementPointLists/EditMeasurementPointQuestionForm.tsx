/* 
* EditMeasurementPointQuestionForm 
* Edit measurement point questions
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
import { ImeasurementPointList } from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointQuestionModal
} from '../../actions/manageMeasurementPointListsActions';
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

const buildFieldConfig = (typeOptions: any[]) => {
  // Field config to configure form
  const fieldConfigControls = {
    type: {
      render: FormUtil.SelectWithoutValidation,
      meta: {
        options: typeOptions,
        label: 'manageMeasurementPointLists:type',
        colWidth: 12,
        placeholder: 'manageMeasurementPointLists:typePlaceholder'
      },
      options: {
        validators: [Validators.required]
      }
    }
  };
  const fieldConfig = {
    controls: { ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

interface Iprops extends React.Props<EditMeasurementPointQuestionForm> {
  selectedMeasurementPointList: ImeasurementPointList;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointQuestionModal: typeof toggleEditMeasurementPointQuestionModal;
}

class EditMeasurementPointQuestionForm extends React.Component<Iprops, {}> {
  public measurementsForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(constants.measurementPointQuestionTypeOptions),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedMeasurementPointList) {
      return;
    }
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

    const { type } = this.props.selectedMeasurementPointList;
    this.measurementsForm.patchValue({
      type: find(
        constants.measurementPointQuestionTypeOptions,
        (tOpt: any) => tOpt.value === type
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
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleEditMeasurementPointQuestionModal}
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
    );
  }
}
export default translate('manageMeasurementPointLists')(
  EditMeasurementPointQuestionForm
);
