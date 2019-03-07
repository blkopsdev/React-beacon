/* 
* EditMeasurementPointForm 
* Edit measurement point questions
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  FieldConfig,
  AbstractControl,
  Observable
} from 'react-reactive-form';
import { forEach, find, map } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import InputList from './InputList';

import { FormUtil } from '../common/FormUtil';
import {
  ImeasurementPointList,
  ImeasurementPoint,
  ImeasurementPointSelectOption
  // ImeasurementPointSelectOption
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  addQuestionToMeasurementPointList
} from '../../actions/manageMeasurementPointListsActions';
import { constants } from 'src/constants/constants';
import { initialMeasurementPoint } from 'src/reducers/initialState';
// const uuidv4 = require('uuid/v4');

interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const InputListAbstract = ({ handler, meta }: AbstractControl) => (
  <InputList meta={meta} onChange={handler().onChange} />
);

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

interface Iprops extends React.Props<EditMeasurementPointForm> {
  selectedMeasurementPointList: ImeasurementPointList;
  selectedMeasurementPoint: ImeasurementPoint;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addQuestionToMeasurementPointList: typeof addQuestionToMeasurementPointList;
}

interface Istate {
  question: ImeasurementPoint;
  fieldConfig: FieldConfig;
}
class EditMeasurementPointForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  // public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    if (
      this.props.selectedMeasurementPointList &&
      this.props.selectedMeasurementPoint.id.length
    ) {
      this.state = {
        fieldConfig: FormUtil.translateForm(
          this.getFormConfig(this.props.selectedMeasurementPoint),
          this.props.t
        ),
        question: this.props.selectedMeasurementPoint
      };
    } else {
      this.state = {
        fieldConfig: { controls: {} },
        question: initialMeasurementPoint
      };
    }
  }

  componentDidMount() {
    if (
      !this.props.selectedMeasurementPointList ||
      !this.props.selectedMeasurementPoint.id.length
    ) {
      console.error('missing measurementPoint List or MeasurementPoint');
      this.props.toggleEditMeasurementPointModal();
    }
  }
  getFormConfig = (question: ImeasurementPoint) => {
    if (question.type === constants.measurementPointTypes.PROCEDURE) {
      return buildProcedureFieldConfig(question.label);
    } else if (question.type === constants.measurementPointTypes.GROUP) {
      return groupFieldConfig;
    } else {
      let extraConfig = {};
      if (question.type === constants.measurementPointTypes.QUESTION_PASSFAIL) {
        extraConfig = passFailFieldConfig;
      } else if (
        question.type === constants.measurementPointTypes.QUESTION_NUMERIC
      ) {
        extraConfig = numericFieldConfig;
      } else if (
        question.type === constants.measurementPointTypes.QUESTION_SELECT
      ) {
        extraConfig = this.selectFieldConfig(question);
      }
      return this.buildFieldConfig(
        constants.measurementPointTypeOptions,
        question.helpText,
        extraConfig
      );
    }
  };

  selectFieldConfig = (question: ImeasurementPoint) => ({
    selectRememberBetweenDevice: {
      options: { validators: [Validators.required] },
      render: FormUtil.Select,
      meta: {
        label: 'manageMeasurementPointLists:selectRememberBetweenDevice',
        colWidth: 12,
        options: trueFalseOptions,
        isClearable: false
      }
    },
    selectRememberBetweenInspection: {
      options: { validators: [Validators.required] },
      render: FormUtil.Select,
      meta: {
        label: 'manageMeasurementPointLists:selectRememberBetweenInspection',
        colWidth: 12,
        options: trueFalseOptions,
        isClearable: false
      }
    },
    selectOptions: {
      options: {
        validators: [Validators.required]
      },
      render: InputListAbstract,
      meta: {
        label: 'manageMeasurementPointLists:selectOptions',
        buttonLabel: 'Add Option',
        colWidth: 12,
        placeholder: 'manageMeasurementPointLists:selectOptionsPlaceholder',
        colorButton: 'info',
        startOptions: map(question.selectOptions, mpo => {
          return {
            ...mpo,
            isDefault: question.selectDefaultOptionID === mpo.id,
            isDeleted:
              typeof mpo.isDeleted !== 'undefined' ? mpo.isDeleted : false
          };
        })
      }
    }
  });

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

  buildForm = (questionType: number) => {
    console.log('BUILDING FORM', questionType);

    this.setState({
      fieldConfig: FormUtil.translateForm(
        this.getFormConfig(this.state.question),
        this.props.t
      )
    });
  };

  patchValues = () => {
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
          constants.measurementPointTypeOptions,
          (tOpt: any) => tOpt.value === type
        ),
        guideText,
        allowNotes: find(
          trueFalseOptions,
          (tOpt: any) => tOpt.value === allowNotes
        )
      });
    }
    if (type === constants.measurementPointTypes.QUESTION_PASSFAIL) {
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
    if (type === constants.measurementPointTypes.QUESTION_NUMERIC) {
      const { numericAllowDecimals } = this.state.question;
      if (typeof numericAllowDecimals !== undefined) {
        console.log('patching', numericAllowDecimals);
        this.measurementsForm.patchValue({
          numericAllowDecimals: find(
            trueFalseOptions,
            (tOpt: any) => tOpt.value === numericAllowDecimals
          )
        });
      }
    }
    if (type === constants.measurementPointTypes.QUESTION_SELECT) {
      const {
        selectRememberBetweenDevice,
        selectRememberBetweenInspection,
        selectDefaultOptionID,
        selectOptions
      } = this.state.question;
      if (typeof selectRememberBetweenDevice !== undefined) {
        this.measurementsForm.patchValue({
          selectRememberBetweenDevice: find(
            trueFalseOptions,
            (tOpt: any) => tOpt.value === selectRememberBetweenDevice
          )
        });
      }
      if (typeof selectRememberBetweenInspection !== undefined) {
        this.measurementsForm.patchValue({
          selectRememberBetweenInspection: find(
            trueFalseOptions,
            (tOpt: any) => tOpt.value === selectRememberBetweenInspection
          )
        });
      }
      console.log('NEED TO PATCH THESE', selectDefaultOptionID, selectOptions);
      if (typeof selectOptions !== undefined) {
        // this.measurementsForm.se
        const control = this.measurementsForm.get(
          'selectDefaultOptionID'
        ) as AbstractControlEdited;
        console.log(control);
      }
    }
  };

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
    if (
      this.state.question.type ===
      constants.measurementPointTypes.QUESTION_PASSFAIL
    ) {
      newQ = {
        ...newQ,
        passFailDefault: this.measurementsForm.value.passFailDefault.value
      };
    }
    if (
      this.state.question.type ===
      constants.measurementPointTypes.QUESTION_NUMERIC
    ) {
      newQ = {
        ...newQ,
        numericAllowDecimals: this.measurementsForm.value.numericAllowDecimals
          .value
      };
    }
    if (
      this.state.question.type ===
      constants.measurementPointTypes.QUESTION_SELECT
    ) {
      // console.log(this.measurementsForm.value.selectOptions);
      // return;
      const selectDefaultOption = this.measurementsForm.value.selectOptions.filter(
        (mpo: ImeasurementPointSelectOption) => {
          return mpo.isDefault === true;
        }
      );

      newQ = {
        ...newQ,
        selectRememberBetweenDevice: this.measurementsForm.value
          .selectRememberBetweenDevice.value,
        selectRememberBetweenInspection: this.measurementsForm.value
          .selectRememberBetweenInspection.value,
        selectOptions: map(
          this.measurementsForm.value.selectOptions,
          (mpo: ImeasurementPointSelectOption) => {
            delete mpo.isDefault;
            return mpo;
          }
        ),
        selectDefaultOptionID: selectDefaultOption.length
          ? selectDefaultOption[0].id
          : ''
      };
    }
    console.log(newQ);
    this.props.addQuestionToMeasurementPointList(
      this.props.selectedMeasurementPointList,
      newQ
    );
    this.props.toggleEditMeasurementPointModal();
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
              onClick={this.props.toggleEditMeasurementPointModal}
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
  EditMeasurementPointForm
);
