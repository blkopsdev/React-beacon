/* 
* EditMeasurementPointForm 
* Edit measurement point
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  FieldConfig,
  AbstractControl,
  Observable,
  GroupProps
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
  addMeasurementPointToMeasurementPointList
} from '../../actions/manageMeasurementPointListsActions';
import { constants } from 'src/constants/constants';
// const uuidv4 = require('uuid/v4');

interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}
interface IformSate {
  value: any;
  disabled: boolean;
}

const InputListAbstract = ({ handler, meta }: AbstractControl) => (
  <InputList meta={meta} onChange={handler().onChange} />
);

const trueFalseOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

const trueFalseOption = (value: boolean | null) => {
  if (value === true) {
    return { label: 'Yes', value: true };
  } else if (value === false) {
    return { label: 'No', value: false };
  } else {
    return null;
  }
};

const passFailFieldConfig = (formState: IformSate) => {
  return {
    passFailDefault: {
      options: { validators: [Validators.required] },
      render: FormUtil.Select,
      meta: {
        label: 'manageMeasurementPointLists:passFailDefault',
        colWidth: 12,
        options: constants.measurementPointPassFailOptions,
        isClearable: false
      },
      formState
    } as GroupProps
  };
};

const numericFieldConfig = (
  selectedNumericMinValue: number | null,
  selectedNumericMaxValue: number | null,
  selectedNumericAllowDecimals: boolean | null,
  disabled: boolean
) => {
  return {
    numericMinValue: {
      options: {},
      render: FormUtil.TextInput,
      meta: {
        label: 'manageMeasurementPointLists:numericMinValue',
        colWidth: 12,
        type: 'number',
        name: 'numericMinValue'
      },
      formState: { value: selectedNumericMinValue, disabled }
    },
    numericMaxValue: {
      options: {},
      render: FormUtil.TextInput,
      meta: {
        label: 'manageMeasurementPointLists:numericMaxValue',
        colWidth: 12,
        type: 'number',
        name: 'numericMaxValue'
      },
      formState: { value: selectedNumericMaxValue, disabled }
    },
    numericAllowDecimals: {
      options: { validators: [Validators.required] },
      render: FormUtil.Select,
      meta: {
        label: 'manageMeasurementPointLists:numericAllowDecimals',
        colWidth: 12,
        options: trueFalseOptions,
        isClearable: false
      },
      formState: { value: selectedNumericAllowDecimals, disabled }
    }
  } as { [key: string]: GroupProps };
};

const groupFieldConfig = (formState: IformSate) => {
  return {
    controls: {
      label: {
        options: {
          validators: [
            Validators.required,
            FormUtil.validators.requiredWithTrim
          ]
        },
        render: FormUtil.TextInput,
        meta: {
          label: 'manageMeasurementPointLists:groupLabel',
          colWidth: 12,
          type: 'text',
          name: 'label'
        },
        formState
      }
    } as { [key: string]: GroupProps }
  };
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
  addMeasurementPointToMeasurementPointList: typeof addMeasurementPointToMeasurementPointList;
}

interface Istate {
  measurementPoint: ImeasurementPoint;
  fieldConfig: FieldConfig;
}
class EditMeasurementPointForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  // public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: FormUtil.translateForm(
        this.getFormConfig(this.props.selectedMeasurementPoint),
        this.props.t
      ),
      measurementPoint: this.props.selectedMeasurementPoint
    };
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

  /*
  * update which form controls based on the type of measurement point
  */
  getFormConfig = (measurementPoint: ImeasurementPoint) => {
    const {
      type,
      label,
      passFailDefault,
      numericMinValue = null,
      numericMaxValue = null,
      numericAllowDecimals = null
    } = measurementPoint;

    let selectedPassFailDefault = null;
    if (passFailDefault) {
      selectedPassFailDefault =
        find(
          constants.measurementPointPassFailOptions,
          (tOpt: any) => tOpt.value === passFailDefault
        ) || null;
    }
    const mpTypes = constants.measurementPointTypes;
    const disabled = false;

    if (type === mpTypes.PROCEDURE) {
      return buildProcedureFieldConfig(label); // TODO remove procedure
    } else if (type === mpTypes.GROUP) {
      return groupFieldConfig({ value: label, disabled });
    } else {
      let extraConfig = {};
      if (type === mpTypes.MEASUREMENT_POINT_PASSFAIL) {
        extraConfig = passFailFieldConfig({
          value: selectedPassFailDefault,
          disabled
        });
      } else if (type === mpTypes.MEASUREMENT_POINT_NUMERIC) {
        extraConfig = numericFieldConfig(
          numericMinValue,
          numericMaxValue,
          numericAllowDecimals,
          disabled
        );
      } else if (type === mpTypes.MEASUREMENT_POINT_SELECT) {
        extraConfig = this.selectFieldConfig(measurementPoint, disabled);
      }
      return this.buildFieldConfig(measurementPoint, extraConfig, disabled);
    }
  };

  selectFieldConfig = (
    measurementPoint: ImeasurementPoint,
    disabled: boolean
  ) => {
    const {
      selectRememberBetweenDevice = null,
      selectRememberBetweenInspection = null,
      selectOptions = [],
      selectDefaultOptionID = ''
    } = measurementPoint;

    return {
      selectRememberBetweenDevice: {
        options: { validators: [Validators.required] },
        render: FormUtil.Select,
        meta: {
          label: 'manageMeasurementPointLists:selectRememberBetweenDevice',
          colWidth: 12,
          options: trueFalseOptions,
          isClearable: false
        },
        formState: {
          value: trueFalseOption(selectRememberBetweenDevice),
          disabled
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
        },
        formState: {
          value: trueFalseOption(selectRememberBetweenInspection),
          disabled
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
          startOptions: map(selectOptions, mpo => {
            return {
              ...mpo,
              isDefault: selectDefaultOptionID === mpo.id,
              isDeleted:
                typeof mpo.isDeleted !== 'undefined' ? mpo.isDeleted : false
            };
          })
        },
        formState: { value: null, disabled }
      }
    } as { [key: string]: GroupProps };
  };

  buildFieldConfig = (
    measurementPoint: ImeasurementPoint,
    otherConfig: { [key: string]: GroupProps },
    disabled: boolean
  ) => {
    const {
      helpText = '',
      type,
      guideText = null,
      allowNotes = null,
      label
    } = measurementPoint;
    const selectedType = type
      ? { label: constants.measurementPointTypeEnum[type], value: type }
      : null;
    // Field config to configure form
    const fieldConfigControls = {
      type: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          options: constants.measurementPointListTypeOptions,
          label: 'manageMeasurementPointLists:type',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:typePlaceholder',
          isClearable: false
        },
        options: {
          validators: [Validators.required]
        },
        formState: { value: selectedType, disabled }
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
          label: 'manageMeasurementPointLists:measurementPointText',
          colWidth: 12,
          type: 'text'
        },
        formState: { value: label, disabled }
      },
      guideText: {
        render: FormUtil.TextInput,
        meta: {
          label: 'manageMeasurementPointLists:guideText',
          colWidth: 12,
          type: 'text'
        },
        formState: { value: guideText, disabled }
      },
      allowNotes: {
        render: FormUtil.SelectWithoutValidation,
        meta: {
          label: 'manageMeasurementPointLists:allowNotes',
          colWidth: 12,
          options: trueFalseOptions,
          isClearable: false
        },
        formState: { value: trueFalseOption(allowNotes), disabled }
      },
      helpText: {
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'manageMeasurementPointLists:helpText',
          colWidth: 12,
          type: 'text',
          initialContent: helpText
        }
      }
    } as { [key: string]: GroupProps };
    const fieldConfig = {
      controls: { ...fieldConfigControls, ...otherConfig }
    };
    return fieldConfig as FieldConfig;
  };

  buildForm = (measurementPointType: number) => {
    console.log('BUILDING FORM', measurementPointType);

    this.setState({
      fieldConfig: FormUtil.translateForm(
        this.getFormConfig(this.state.measurementPoint),
        this.props.t
      )
    });
  };

  patchValues = () => {
    // set values
    forEach(this.state.measurementPoint, (value, key) => {
      this.measurementsForm.patchValue({ [key]: value });
    });

    const { type, label } = this.state.measurementPoint;
    this.measurementsForm.patchValue({
      label
    });
    if (type < 5) {
      const { guideText, allowNotes } = this.state.measurementPoint;
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
    if (type === constants.measurementPointTypes.MEASUREMENT_POINT_PASSFAIL) {
      const { passFailDefault } = this.state.measurementPoint;
      if (passFailDefault) {
        this.measurementsForm.patchValue({
          passFailDefault: find(
            constants.measurementPointPassFailOptions,
            (tOpt: any) => tOpt.value === passFailDefault
          )
        });
      }
    }
    if (type === constants.measurementPointTypes.MEASUREMENT_POINT_NUMERIC) {
      const { numericAllowDecimals } = this.state.measurementPoint;
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
    if (type === constants.measurementPointTypes.MEASUREMENT_POINT_SELECT) {
      const {
        selectRememberBetweenDevice,
        selectRememberBetweenInspection,
        selectDefaultOptionID,
        selectOptions
      } = this.state.measurementPoint;
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
    const {
      allowNotes,
      type,
      passFailDefault,
      numericAllowDecimals,
      selectOptions,
      selectRememberBetweenDevice,
      selectRememberBetweenInspection
    } = this.measurementsForm.value;
    let newQ = {
      ...this.state.measurementPoint,
      ...this.measurementsForm.value
    };
    if (this.state.measurementPoint.type < 5) {
      newQ = {
        ...newQ,
        allowNotes: allowNotes ? allowNotes.value : false,
        type: type ? type.value : ''
      };
    }
    if (
      this.state.measurementPoint.type ===
      constants.measurementPointTypes.MEASUREMENT_POINT_PASSFAIL
    ) {
      newQ = {
        ...newQ,
        passFailDefault: passFailDefault ? passFailDefault.value : ''
      };
    }
    if (
      this.state.measurementPoint.type ===
      constants.measurementPointTypes.MEASUREMENT_POINT_NUMERIC
    ) {
      newQ = {
        ...newQ,
        numericAllowDecimals: numericAllowDecimals
          ? numericAllowDecimals.value
          : ''
      };
    }
    if (
      this.state.measurementPoint.type ===
      constants.measurementPointTypes.MEASUREMENT_POINT_SELECT
    ) {
      // console.log(this.measurementsForm.value.selectOptions);
      // return;
      const selectDefaultOption = selectOptions.filter(
        (mpo: ImeasurementPointSelectOption) => {
          return mpo.isDefault === true;
        }
      );

      newQ = {
        ...newQ,
        selectRememberBetweenDevice: selectRememberBetweenDevice
          ? selectRememberBetweenDevice.value
          : '',
        selectRememberBetweenInspection: selectRememberBetweenInspection
          ? selectRememberBetweenInspection.value
          : '',
        selectOptions: map(
          selectOptions,
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
    const tabID = ''; // TODO fix this
    console.log(newQ);
    this.props.addMeasurementPointToMeasurementPointList(
      this.props.selectedMeasurementPointList.id,
      tabID,
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
    // this.patchValues();
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
