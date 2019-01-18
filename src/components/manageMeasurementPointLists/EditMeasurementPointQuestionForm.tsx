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

const trueFalseOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

const passFailFieldConfig = {
  passfaildefault: {
    options: {},
    render: FormUtil.SelectWithoutValidation,
    meta: {
      label: 'manageMeasurementPointLists:passfaildefault',
      colWidth: 12,
      options: constants.measurementPointPassFailOptions,
      isClearable: false
    }
  }
};

const groupFieldConfig = {
  controls: {
    label: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: {
        label: 'manageMeasurementPointLists:groupLabel',
        colWidth: 12,
        type: 'text',
        name: 'label'
      }
    }
  }
};

const buildProcedureFieldConfig = (initialContent: any) => {
  return {
    controls: {
      label: {
        options: {},
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'manageMeasurementPointLists:procedureLabel',
          colWidth: 12,
          initialContent
        }
      }
    }
  };
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
      this.getFormConfig(this.props.selectedMeasurementPointQuestion.type),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }

  getFormConfig(questionType: number) {
    if (
      this.props.selectedMeasurementPointQuestion &&
      questionType === constants.measurementPointQuestionTypes.PROCEDURE
    ) {
      return buildProcedureFieldConfig(
        this.props.selectedMeasurementPointQuestion.label
      );
    } else if (
      this.props.selectedMeasurementPointQuestion &&
      questionType === constants.measurementPointQuestionTypes.GROUP
    ) {
      return groupFieldConfig;
    } else {
      let extraConfig = {};
      if (
        questionType ===
        constants.measurementPointQuestionTypes.QUESTION_PASSFAIL
      ) {
        extraConfig = passFailFieldConfig;
      }
      return this.buildFieldConfig(
        constants.measurementPointQuestionTypeOptions,
        this.props.selectedMeasurementPointQuestion
          ? this.props.selectedMeasurementPointQuestion.helptext
          : '',
        extraConfig
      );
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

  // componentDidMount() {}
  // componentWillUnmount() {}

  buildFieldConfig = (
    typeOptions: any[],
    initialContent: any,
    otherConfig: any
  ) => {
    // Field config to configure form
    const fieldConfigControls = {
      type: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          options: typeOptions,
          label: 'manageMeasurementPointLists:type',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:typePlaceholder',
          isClearable: false
        },
        options: {
          validators: [
            Validators.required,
            (c: any) => {
              if (
                c.value &&
                c.value.value &&
                c.value.value !==
                  this.props.selectedMeasurementPointQuestion.type
              ) {
                this.buildForm(c.value.value);
              }
            }
          ]
        }
      },
      label: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'manageMeasurementPointLists:questionText',
          colWidth: 12,
          type: 'text'
        }
      },
      guidetext: {
        options: {},
        render: FormUtil.TextInput,
        meta: {
          label: 'manageMeasurementPointLists:guideText',
          colWidth: 12,
          type: 'text'
        }
      },
      allownotes: {
        options: {},
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'manageMeasurementPointLists:allowNotes',
          colWidth: 12,
          options: trueFalseOptions,
          isClearable: false
        }
      },
      helptext: {
        options: {},
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'manageMeasurementPointLists:helpText',
          colWidth: 12,
          type: 'text',
          initialContent
        }
      }
    };
    const fieldConfig = {
      controls: { ...fieldConfigControls, ...otherConfig }
    };
    return fieldConfig as FieldConfig;
  };

  buildForm(questionType: number) {
    if (!this.props.selectedMeasurementPointList) {
      console.error('missing measurement point list');
      return;
    }
    if (!this.props.selectedMeasurementPointQuestion) {
      console.error('missing measurement point question');
      return;
    }

    console.log('BUILDING FORM', questionType);

    this.fieldConfig = FormUtil.translateForm(
      this.getFormConfig(questionType),
      this.props.t
    );

    this.forceUpdate();
  }

  patchValues() {
    // set values
    forEach(this.props.selectedMeasurementPointList, (value, key) => {
      this.measurementsForm.patchValue({ [key]: value });
    });

    const { type, label } = this.props.selectedMeasurementPointQuestion;
    this.measurementsForm.patchValue({
      label
    });
    if (type < 5) {
      const {
        guidetext,
        allownotes
      } = this.props.selectedMeasurementPointQuestion;
      this.measurementsForm.patchValue({
        type: find(
          constants.measurementPointQuestionTypeOptions,
          (tOpt: any) => tOpt.value === type
        ),
        guidetext,
        allownotes: find(
          trueFalseOptions,
          (tOpt: any) => tOpt.value === allownotes
        )
      });
    }
    if (type === 1) {
      const { passfaildefault } = this.props.selectedMeasurementPointQuestion;
      if (passfaildefault) {
        this.measurementsForm.patchValue({
          passfaildefault: find(
            constants.measurementPointPassFailOptions,
            (tOpt: any) => tOpt.value === passfaildefault
          )
        });
      }
    }
  }

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

    let newQ = {
      ...this.props.selectedMeasurementPointQuestion,
      ...this.measurementsForm.value
    };
    if (this.props.selectedMeasurementPointQuestion.type < 5) {
      newQ = {
        ...newQ,
        allownotes: this.measurementsForm.value.allownotes.value,
        type: this.measurementsForm.value.type.value
      };
    }
    if (this.props.selectedMeasurementPointQuestion.type === 1) {
      newQ = {
        ...newQ,
        passfaildefault: this.measurementsForm.value.passfaildefault.value
      };
    }
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
    console.log('PATCHING VALUES');
    this.patchValues();
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
