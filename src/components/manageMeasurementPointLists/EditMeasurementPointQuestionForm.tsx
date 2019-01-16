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
import { ImeasurementPointList, ImeasurementPointQuestion } from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointQuestionModal,
  addQuestionToMeasurementPointList
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

const groupFieldConfig = {
  controls: {
    label: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'name', colWidth: 12, type: 'text', name: 'label' }
    }
  }
};

const procedureFieldConfig = {
  controls: {
    label: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: {
        label: 'procedure text',
        colWidth: 12,
        type: 'text',
        name: 'label'
      }
    }
  }
};

interface Iprops extends React.Props<EditMeasurementPointQuestionForm> {
  selectedMeasurementPointList: ImeasurementPointList;
  selectedMeasurementPointQuestion: ImeasurementPointQuestion;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointQuestionModal: typeof toggleEditMeasurementPointQuestionModal;
  addQuestionToMeasurementPointList: typeof addQuestionToMeasurementPointList;
}

class EditMeasurementPointQuestionForm extends React.Component<Iprops, {}> {
  public measurementsForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      this.getFormConfig(),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }

  getFormConfig() {
    if (
      this.props.selectedMeasurementPointQuestion &&
      this.props.selectedMeasurementPointQuestion.type ===
        constants.measurementPointQuestionTypes.PROCEDURE
    ) {
      return procedureFieldConfig;
    } else if (
      this.props.selectedMeasurementPointQuestion &&
      this.props.selectedMeasurementPointQuestion.type ===
        constants.measurementPointQuestionTypes.GROUP
    ) {
      return groupFieldConfig;
    } else {
      return buildFieldConfig(constants.measurementPointQuestionTypeOptions);
    }
  }

  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedMeasurementPointList) {
      return;
    }
    if (!this.props.selectedMeasurementPointQuestion) {
      return;
    }
  }

  componentDidMount() {
    if (!this.props.selectedMeasurementPointList) {
      console.error('missing measurement point list');
      return;
    }
    if (!this.props.selectedMeasurementPointQuestion) {
      console.error('missing measurement point question');
      return;
    }
    // set values
    forEach(this.props.selectedMeasurementPointList, (value, key) => {
      this.measurementsForm.patchValue({ [key]: value });
    });

    const { type, label } = this.props.selectedMeasurementPointQuestion;
    if (type < 5) {
      this.measurementsForm.patchValue({
        type: find(
          constants.measurementPointQuestionTypeOptions,
          (tOpt: any) => tOpt.value === type
        )
      });
    }
    this.measurementsForm.patchValue({
      label
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

    const newQ = {
      ...this.props.selectedMeasurementPointQuestion,
      ...this.measurementsForm.value
    };
    console.log(newQ);
    this.props.addQuestionToMeasurementPointList(
      this.props.selectedMeasurementPointList,
      newQ
    );
    this.props.toggleEditMeasurementPointQuestionModal();
  };

  setForm = (form: AbstractControl) => {
    this.measurementsForm = form;
    this.measurementsForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

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
