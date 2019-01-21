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

const trueFalseOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

const passFailFieldConfig = {
  passFailDefault: {
    options: { validators: [Validators.required] },
    render: FormUtil.Select,
    meta: {
      label: 'manageMeasurementPointLists:passFailDefault',
      colWidth: 12,
      options: constants.measurementPointPassFailOptions,
      isClearable: false
    }
  }
};

const numericFieldConfig = {
  numericMinValue: {
    options: {},
    render: FormUtil.TextInput,
    meta: {
      label: 'manageMeasurementPointLists:numericMinValue',
      colWidth: 12,
      type: 'number',
      name: 'numericMinValue'
    }
  },
  numericMaxValue: {
    options: {},
    render: FormUtil.TextInput,
    meta: {
      label: 'manageMeasurementPointLists:numericMaxValue',
      colWidth: 12,
      type: 'number',
      name: 'numericMaxValue'
    }
  },
  numericAllowDecimals: {
    options: { validators: [Validators.required] },
    render: FormUtil.Select,
    meta: {
      label: 'manageMeasurementPointLists:numericAllowDecimals',
      colWidth: 12,
      options: trueFalseOptions,
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

interface Istate {
  question: ImeasurementPointQuestion;
  fieldConfig: FieldConfig;
}
class EditMeasurementPointQuestionForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  // public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    if (
      !this.props.selectedMeasurementPointList ||
      this.props.selectedMeasurementPointQuestion == null
    ) {
      this.props.toggleEditMeasurementPointListModal();
    }
    this.state = {
      fieldConfig: FormUtil.translateForm(
        this.getFormConfig(this.props.selectedMeasurementPointQuestion),
        this.props.t
      ),
      question: this.props.selectedMeasurementPointQuestion
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
    this.getFormConfig = this.getFormConfig.bind(this);
  }

  getFormConfig(question: ImeasurementPointQuestion) {
    if (question.type === constants.measurementPointQuestionTypes.PROCEDURE) {
      return buildProcedureFieldConfig(question.label);
    } else if (
      question.type === constants.measurementPointQuestionTypes.GROUP
    ) {
      return groupFieldConfig;
    } else {
      let extraConfig = {};
      if (
        question.type ===
        constants.measurementPointQuestionTypes.QUESTION_PASSFAIL
      ) {
        extraConfig = passFailFieldConfig;
      } else if (
        question.type ===
        constants.measurementPointQuestionTypes.QUESTION_NUMERIC
      ) {
        extraConfig = numericFieldConfig;
      } else if (
        question.type ===
        constants.measurementPointQuestionTypes.QUESTION_SELECT
      ) {
        // TODO ADD SELECT FORM
        extraConfig = {};
      }
      return this.buildFieldConfig(
        constants.measurementPointQuestionTypeOptions,
        question.helpText,
        extraConfig
      );
    }
  }

  // componentDidUpdate(prevProps: Iprops) {
  //   if (!this.props.selectedMeasurementPointList) {
  //     return;
  //   }
  //   if (!this.props.selectedMeasurementPointQuestion) {
  //     return;
  //   }
  // }

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
                c.value.value !== this.state.question.type
              ) {
                this.setState(
                  {
                    question: { ...this.state.question, type: c.value.value }
                  },
                  () => {
                    this.buildForm(c.value.value);
                  }
                );
              }
            }
          ]
        }
      },
      label: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim,
            (c: any) => {
              if (c.value && c.value.value) {
                this.setState({
                  question: { ...this.state.question, label: c.value.value }
                });
              }
            }
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'manageMeasurementPointLists:questionText',
          colWidth: 12,
          type: 'text'
        }
      },
      guideText: {
        options: {
          validators: [
            (c: any) => {
              if (c.value && c.value.value) {
                this.setState({
                  question: { ...this.state.question, guideText: c.value.value }
                });
              }
            }
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'manageMeasurementPointLists:guideText',
          colWidth: 12,
          type: 'text'
        }
      },
      allowNotes: {
        options: {
          validators: [
            (c: any) => {
              if (c.value && c.value.value) {
                this.setState({
                  question: {
                    ...this.state.question,
                    allowNotes: c.value.value
                  }
                });
              }
            }
          ]
        },
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'manageMeasurementPointLists:allowNotes',
          colWidth: 12,
          options: trueFalseOptions,
          isClearable: false
        }
      },
      helpText: {
        options: {
          validators: [
            (c: any) => {
              if (c.value && c.value.value) {
                this.setState({
                  question: { ...this.state.question, helpText: c.value.value }
                });
              }
            }
          ]
        },
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
    // if (!this.props.selectedMeasurementPointList) {
    //   console.error('missing measurement point list');
    //   return;
    // }
    // if (!this.props.selectedMeasurementPointQuestion) {
    //   console.error('missing measurement point question');
    //   return;
    // }

    console.log('BUILDING FORM', questionType);

    this.setState({
      fieldConfig: FormUtil.translateForm(
        this.getFormConfig(this.state.question),
        this.props.t
      )
    });
  }

  patchValues() {
    // set values
    forEach(this.state.question, (value, key) => {
      this.measurementsForm.patchValue({ [key]: value });
    });

    const { type, label } = this.state.question;
    this.measurementsForm.patchValue({
      label
    });
    if (type < 5) {
      const { guideText, allowNotes } = this.state.question;
      this.measurementsForm.patchValue({
        type: find(
          constants.measurementPointQuestionTypeOptions,
          (tOpt: any) => tOpt.value === type
        ),
        guideText,
        allowNotes: find(
          trueFalseOptions,
          (tOpt: any) => tOpt.value === allowNotes
        )
      });
    }
    if (type === 1) {
      const { passFailDefault } = this.state.question;
      if (passFailDefault) {
        this.measurementsForm.patchValue({
          passFailDefault: find(
            constants.measurementPointPassFailOptions,
            (tOpt: any) => tOpt.value === passFailDefault
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
      ...this.state.question,
      ...this.measurementsForm.value
    };
    if (this.state.question.type < 5) {
      newQ = {
        ...newQ,
        allowNotes: this.measurementsForm.value.allowNotes.value,
        type: this.measurementsForm.value.type.value
      };
    }
    if (this.state.question.type === 1) {
      newQ = {
        ...newQ,
        passFailDefault: this.measurementsForm.value.passFailDefault.value
      };
    }
    if (this.state.question.type === 3) {
      newQ = {
        ...newQ,
        numericAllowDecimals: this.measurementsForm.value.numericAllowDecimals
          .value
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
            fieldConfig={this.state.fieldConfig}
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
