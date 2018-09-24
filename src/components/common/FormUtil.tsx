import * as React from 'react';

import {
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';
import {
  Validators,
  FieldConfig,
  AbstractControl,
  ValidationErrors
} from 'react-reactive-form';
import { mapValues, find, map } from 'lodash';
import { TranslationFunction } from 'react-i18next';
import Select, { components } from 'react-select';
import Toggle from 'react-toggle';
import { Ioption } from '../../models';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// add the bootstrap form-control class to the react-select select component
const ControlComponent = (props: any) => (
  <div>
    <components.Control {...props} className="form-control" />
  </div>
);

// const CustomFeedback = ({type}: any) => {
//   if (type === 'valid'){
//     return <FontAwesomeIcon icon={['far', 'check']} />
//   } else if (type === 'invalid'){
//     return <FontAwesomeIcon icon={['far', 'times']}  />
//   } else {
//     return null;
//   }
// }

// <FormControl.Feedback>
//           <CustomFeedback />
//          </FormControl.Feedback>

// TODO add a type that accepts an array or an object:  Array<{ id: string; name: string }>
export const FormUtil = {
  convertToOptions: (items: any): Ioption[] => {
    return map(items, (item: any) => {
      return { value: item.id, label: item.name || item.code };
    });
  },

  getValidationState: (
    pristine: boolean,
    error: ValidationErrors,
    submitted: boolean
  ) => {
    if (!pristine && error) {
      return 'error';
    } else if (!pristine && !error) {
      return 'success';
    } else if (pristine && error && submitted) {
      return 'error';
    } else {
      return null;
    }
  },

  TextInput: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => (
    <Col xs={meta.colWidth}>
      <FormGroup
        validationState={FormUtil.getValidationState(
          pristine,
          errors,
          submitted
        )}
        bsSize="sm"
      >
        <ControlLabel>{meta.label}</ControlLabel>
        <FormControl
          placeholder={meta.placeholder}
          componentClass={meta.componentClass}
          type={meta.type || 'text'}
          {...handler()}
        />
        <FormControl.Feedback />
      </FormGroup>
    </Col>
  ),
  Toggle: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted,
    value
  }: AbstractControl) => (
    <Col xs={meta.colWidth}>
      <FormGroup
        validationState={FormUtil.getValidationState(
          pristine,
          errors,
          submitted
        )}
        bsSize="sm"
      >
        <label className="control-label">
          <Toggle
            icons={false}
            checked={value}
            {...handler()}
            className="beacon-toggle"
          />
          <span className="react-toggle-label">{meta.label}</span>
        </label>
      </FormGroup>
    </Col>
  ),
  TextInputWithoutValidation: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => (
    <Col xs={meta.colWidth}>
      <FormGroup bsSize="sm">
        <ControlLabel>{meta.label}</ControlLabel>
        <FormControl
          placeholder={meta.placeholder}
          componentClass={meta.componentClass}
          {...handler()}
        />
      </FormGroup>
    </Col>
  ),
  Select: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted,
    patchValue,
    setErrors,
    value
  }: AbstractControl) => {
    const defaultValue = find(meta.options, { value: meta.value });
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti ? 'is-multi' : '';
    const selectValidationClass = value && !pristine ? 'has-success' : '';
    return (
      <Col xs={meta.colWidth}>
        <FormGroup
          validationState={FormUtil.getValidationState(
            pristine,
            errors,
            submitted
          )}
          bsSize="sm"
        >
          <ControlLabel>{meta.label}</ControlLabel>
          <Select
            options={meta.options}
            className={`${selectClassName} ${selectValidationClass}`}
            defaultValue={defaultValue}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  SelectWithoutValidation: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted,
    patchValue,
    setErrors,
    value
  }: AbstractControl) => {
    const defaultValue = find(meta.options, { value: meta.value });
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti ? `is-multi` : ``;
    return (
      <Col xs={meta.colWidth} className={meta.className || ''}>
        <FormGroup bsSize="sm">
          <ControlLabel>{meta.label}</ControlLabel>
          <Select
            options={meta.options}
            className={selectClassName}
            defaultValue={defaultValue}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            isClearable={true}
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  SelectWithoutValidationLeftLabel: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted,
    patchValue,
    setErrors,
    value
  }: AbstractControl) => {
    // TODO get rid of this because default values do not work for some unknwon reason.  we patch the values instead
    const defaultValue = find(meta.options, { value: meta.value });
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti ? `is-multi` : ``;
    return (
      <Col xs={meta.colWidth} className={meta.className || ''}>
        <FormGroup bsSize="sm">
          <Col xs={2}>
            <ControlLabel>{meta.label}</ControlLabel>
          </Col>
          <Col xs={10}>
            <Select
              options={meta.options}
              className={selectClassName}
              defaultValue={defaultValue}
              components={{ Control: ControlComponent }}
              placeholder={meta.placeholder}
              isMulti={meta.isMulti}
              classNamePrefix="react-select"
              isClearable={meta.isClearable}
              {...handler()}
            />
          </Col>
        </FormGroup>
      </Col>
    );
  },
  SelectWithButton: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted,
    patchValue,
    setErrors,
    value
  }: AbstractControl) => {
    const defaultValue = find(meta.options, { value: meta.value });
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti ? 'is-multi' : '';
    const selectValidationClass = value && !pristine ? 'has-success' : '';
    return (
      <Col xs={meta.colWidth}>
        <FormGroup
          validationState={FormUtil.getValidationState(
            pristine,
            errors,
            submitted
          )}
          bsSize="sm"
        >
          <ControlLabel>{meta.label}</ControlLabel>
          <Button
            bsStyle="link"
            className="pull-right right-side"
            onClick={meta.buttonAction}
          >
            {meta.buttonName}
          </Button>
          <Select
            options={meta.options}
            className={`${selectClassName} ${selectValidationClass}`}
            defaultValue={defaultValue}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  translateForm: (config: FieldConfig, t: TranslationFunction) => {
    const newControls = mapValues(config.controls, field => {
      if (field.meta.label) {
        let newMeta = {
          ...field.meta,
          label: t(field.meta.label)
        };
        if (field.meta.buttonName) {
          newMeta = {
            ...newMeta,
            buttonName: t(field.meta.buttonName)
          };
        }
        if (field.meta.placeholder) {
          newMeta = {
            ...newMeta,
            placeholder: t(field.meta.placeholder)
          };
        }
        // select options
        if (field.meta.options && field.meta.options.length) {
          const newOptions = map(field.meta.options, option => ({
            value: option.value,
            label: t(option.label)
          }));
          newMeta = { ...newMeta, options: newOptions };
        }
        return { ...field, meta: newMeta };
      }
      return field;
    });
    return { controls: newControls };
  }
};
// reusable user form elements
export const userBaseConfigControls = {
  first: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'user:first', colWidth: 6, type: 'text' }
  },
  last: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'user:last', colWidth: 6, type: 'text' }
  },
  email: {
    options: {
      validators: [
        Validators.required,
        Validators.pattern(
          /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        )
      ]
    },
    render: FormUtil.TextInput,
    meta: { label: 'user:email', colWidth: 12, type: 'text' }
  },

  phone: {
    options: {
      validators: [
        Validators.required,
        Validators.pattern(
          /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/
        )
      ]
    },
    render: FormUtil.TextInput,
    meta: {
      label: 'user:phone',
      colWidth: 6,
      type: 'tel',
      placeholder: '***-***-****'
    }
  },
  position: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'user:position', colWidth: 6, type: 'text' }
  }
};
