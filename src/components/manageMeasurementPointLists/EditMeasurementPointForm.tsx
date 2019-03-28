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
  GroupProps
} from 'react-reactive-form';
import { find, map } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';
import InputList from './InputList';

import { FormUtil } from '../common/FormUtil';
import {
  ImeasurementPointList,
  ImeasurementPoint,
  ImeasurementPointSelectOption,
  ImeasurementPointListTab,
  Ioption
  // ImeasurementPointSelectOption
} from '../../models';
import {
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  saveMeasurementPointToMeasurementPointList,
  updateMeasurementPoint
} from '../../actions/manageMeasurementPointListsActions';
import { constants } from 'src/constants/constants';
// const uuidv4 = require('uuid/v4');

interface IformSate {
  value: any;
  disabled: boolean;
}

const InputListAbstract = (props: AbstractControl) => <InputList {...props} />;

const trueFalseOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];

const getTrueFalseOption = (value: boolean | null) => {
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
            FormUtil.validators.requiredWithTrim,
            Validators.maxLength(150)
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

interface Iprops extends React.Props<EditMeasurementPointForm> {
  selectedMeasurementPointList: ImeasurementPointList;
  selectedMeasurementPoint: ImeasurementPoint;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  saveMeasurementPointToMeasurementPointList: typeof saveMeasurementPointToMeasurementPointList;
  selectedTab: ImeasurementPointListTab;
  updateMeasurementPoint: typeof updateMeasurementPoint;
  customerID: string;
}

interface Istate {
  fieldConfig: FieldConfig;
}
class EditMeasurementPointForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  private subscription: any;
  private persistTimeout: any;

  constructor(props: Iprops) {
    super(props);
    this.state = {
      fieldConfig: FormUtil.translateForm(
        this.getFormConfig(this.props.selectedMeasurementPoint),
        this.props.t
      )
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
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /*
  * Subscribe to only some of the changes
  * "type" so that we can update the fieldConfig according to the type of measurement point
  * do not persist values that depend on the type of measurement point
  */

  subscribeToValueChanges = () => {
    let controls = ['type', 'label', 'guideText', 'allowNotes', 'helpText'];
    if (
      this.props.selectedMeasurementPoint.type ===
      constants.measurementPointTypes.GROUP
    ) {
      controls = [];
    }
    controls.forEach((key: string) => {
      this.subscription = this.measurementsForm
        .get(key)
        .valueChanges.subscribe((value: Ioption | null) => {
          this.handleValueChange(key, value);
        });
    });
  };

  handleValueChange = (key: string, value: null | Ioption) => {
    switch (key) {
      case 'type':
        if (value && value.value) {
          this.setState({
            fieldConfig: FormUtil.translateForm(
              this.getFormConfig({
                ...this.props.selectedMeasurementPoint,
                type: parseInt(value.value, 10)
              }),
              this.props.t
            )
          });
        }
      default:
        clearTimeout(this.persistTimeout);
        this.persistTimeout = setTimeout(() => {
          const newValue =
            value !== null && typeof value === 'object' ? value.value : value;
          this.props.updateMeasurementPoint(
            { ...this.props.selectedMeasurementPoint, [key]: newValue },
            this.props.selectedTab.id
          );
        }, 200);
        break;
    }
  };
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
      numericAllowDecimals = null,
      customerID
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
    const disabled =
      this.props.customerID.length > 0 &&
      (customerID === null ||
        (customerID !== null && customerID !== this.props.customerID));

    if (type === mpTypes.GROUP) {
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
      selectOptions,
      selectDefaultOptionID = ''
    } = measurementPoint;
    let selectOptionsDefault = null;
    if (selectOptions) {
      selectOptionsDefault = map(selectOptions, mpo => {
        return {
          ...mpo,
          isDefault: selectDefaultOptionID === mpo.id,
          isDeleted:
            typeof mpo.isDeleted !== 'undefined' ? mpo.isDeleted : false
        };
      });
    }

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
          value: getTrueFalseOption(selectRememberBetweenDevice),
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
          value: getTrueFalseOption(selectRememberBetweenInspection),
          disabled
        }
      },
      selectOptions: {
        options: {
          validators: [
            ({ value }: AbstractControl) => {
              console.log('value', value);
              if (
                value &&
                value.filter(
                  (v: ImeasurementPointSelectOption) => v.isDeleted !== true
                ).length
              ) {
                return null;
              } else {
                return {
                  noValidSelectOptions: {
                    message: 'Please add at least one select option.'
                  }
                };
              }
            }
          ]
        },
        render: InputListAbstract,
        meta: {
          label: 'manageMeasurementPointLists:selectOptions',
          buttonLabel: 'Add Option',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:selectOptionsPlaceholder',
          colorButton: 'info',
          selectOptions: selectOptionsDefault
        },
        formState: { value: selectOptionsDefault, disabled }
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
      allowNotes = true,
      label
    } = measurementPoint;
    const selectedType = type
      ? { label: constants.measurementPointTypeEnum[type], value: type }
      : null;
    // Field config to configure form
    const fieldConfigControls = {
      type: {
        render: FormUtil.Select,
        meta: {
          options: constants.measurementPointTypeOptions,
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
            FormUtil.validators.requiredWithTrim,
            Validators.maxLength(150)
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
        formState: { value: getTrueFalseOption(allowNotes), disabled }
      },
      helpText: {
        render: FormUtil.RichTextEditor,
        meta: {
          label: 'manageMeasurementPointLists:helpText',
          colWidth: 12,
          type: 'text',
          initialContent: helpText ? helpText : ''
        },
        formState: { value: helpText, disabled }
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
        this.getFormConfig(this.props.selectedMeasurementPoint),
        this.props.t
      )
    });
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.measurementsForm.status === 'INVALID') {
      console.log(this.measurementsForm);
      this.measurementsForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    const {
      allowNotes,
      type,
      label,
      passFailDefault,
      numericAllowDecimals,
      selectOptions,
      selectRememberBetweenDevice,
      selectRememberBetweenInspection,
      guideText,
      helpText,
      numericMinValue,
      numericMaxValue
    } = this.measurementsForm.value;

    let selectDefaultOptionID = '';
    if (selectOptions && selectOptions.length) {
      const defaultOption = selectOptions.find(
        (mpo: ImeasurementPointSelectOption) => {
          return mpo.isDefault === true;
        }
      );
      if (defaultOption) {
        selectDefaultOptionID = defaultOption.id;
      }
    }

    const newQ: ImeasurementPoint = {
      ...this.props.selectedMeasurementPoint, // id, order, isDeleted, customerID
      selectRememberBetweenDevice: selectRememberBetweenDevice
        ? selectRememberBetweenDevice.value
        : '',
      selectRememberBetweenInspection: selectRememberBetweenInspection
        ? selectRememberBetweenInspection.value
        : '',
      selectOptions: selectOptions && selectOptions.length ? selectOptions : [],
      numericAllowDecimals: numericAllowDecimals
        ? numericAllowDecimals.value
        : false,
      passFailDefault: passFailDefault ? passFailDefault.value : '',
      allowNotes: allowNotes ? allowNotes.value : false,
      type: type ? type.value : this.props.selectedMeasurementPoint.type,
      selectDefaultOptionID,
      label,
      guideText,
      helpText,
      numericMinValue,
      numericMaxValue
    };

    console.log('saving new MP', newQ);
    this.props.saveMeasurementPointToMeasurementPointList(
      this.props.selectedMeasurementPointList.id,
      this.props.selectedTab.id,
      newQ
    );
    this.props.toggleEditMeasurementPointModal();
  };

  setForm = (form: AbstractControl) => {
    this.measurementsForm = form;
    this.measurementsForm.meta = {
      loading: this.props.loading
    };
    this.subscribeToValueChanges();
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
