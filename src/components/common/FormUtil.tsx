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
import { mapValues, map } from 'lodash';
import { TranslationFunction } from 'react-i18next';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import Toggle from 'react-toggle';
import { Ioption } from '../../models';
import * as Datetime from 'react-datetime';
import * as moment from 'moment';
import RichTextEditor from './RichTextEditor';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// add the bootstrap form-control class to the react-select select component
const ControlComponent = (props: any) => (
  <div>
    <components.Control {...props} className="form-control" />
  </div>
);

// const OptionComponent = (props: any) => (
//   <div>
//     <components.Option {...props} className="select-option" />
//     <Button
//       onClick={() => {
//         console.log(props);
//       }}
//     >
//       Delete
//     </Button>
//   </div>
// );

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
  validators: {
    requiredWithTrim: (m: any) => {
      if (m && m.value && m.value.trim().length > 0) {
        return null;
      } else {
        return { empty: { message: 'not long enough' } };
      }
    },
    isValidMoment: (m: any) => {
      if (m && m.value && moment.isMoment(m.value)) {
        return null;
      } else {
        return { isValidMoment: { message: 'not a valid date' } };
      }
    }
  },
  convertToOptions: (items: any): Ioption[] => {
    return map(items, (item: any) => {
      return {
        value: item.id,
        // TODO: verify this will not explode
        label: item.name || item.code || item.first + ' ' + item.last
      };
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

  Datetime: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => (
    <FormGroup
      validationState={FormUtil.getValidationState(pristine, errors, submitted)}
      bsSize="sm"
      className="datetime-select"
    >
      <Col xs={meta.colWidth}>
        <ControlLabel>{meta.label}</ControlLabel>
        <Datetime
          defaultValue={meta.defaultValue}
          timeFormat={meta.showTime}
          isValidDate={meta.isValidDate}
          {...handler()}
          // TODO figure out how to handle disabled
        />
        <FormControl.Feedback />
      </Col>
    </FormGroup>
  ),
  DatetimeWithoutValidation: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => (
    <FormGroup bsSize="sm" className="datetime-select">
      <Col xs={meta.colWidth}>
        <ControlLabel>{meta.label}</ControlLabel>
        <Datetime
          defaultValue={meta.defaultValue}
          timeFormat={meta.showTime}
          isValidDate={meta.isValidDate}
          {...handler()}
        />
      </Col>
    </FormGroup>
  ),
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
        style={meta.style}
      >
        <ControlLabel>{meta.label}</ControlLabel>
        <FormControl
          placeholder={meta.placeholder}
          componentClass={meta.componentClass}
          type={meta.type || 'text'}
          rows={meta.rows}
          autoFocus={meta.autoFocus}
          name={meta.name || ''}
          {...handler()}
          disabled={
            meta.disabled !== undefined ? meta.disabled : handler().disabled
          }
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
            name={meta.name || ''}
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
          name={meta.name || ''}
          {...handler()}
          disabled={
            meta.disabled !== undefined ? meta.disabled : handler().disabled
          }
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
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            name={meta.name || ''}
            {...handler()}
            isDisabled={
              meta.disabled !== undefined ? meta.disabled : handler().disabled
            }
          />
        </FormGroup>
      </Col>
    );
  },
  CreatableSelect: ({
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
          <CreatableSelect
            options={meta.options}
            className={`${selectClassName} ${selectValidationClass}`}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            onCreateOption={meta.handleCreate}
            name={meta.name || ''}
            {...handler()}
            isDisabled={
              meta.disabled !== undefined ? meta.disabled : handler().disabled
            }
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
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti ? `is-multi` : ``;
    return (
      <Col xs={meta.colWidth} className={meta.className || ''}>
        <FormGroup bsSize="sm">
          <ControlLabel>{meta.label}</ControlLabel>
          <Select
            options={meta.options}
            className={selectClassName}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            isClearable={
              typeof meta.isClearable !== 'undefined' ? meta.isClearable : true
            }
            name={meta.name || ''}
            {...handler()}
            isDisabled={
              meta.disabled !== undefined ? meta.disabled : handler().disabled
            }
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
              components={{ Control: ControlComponent }}
              placeholder={meta.placeholder}
              isMulti={meta.isMulti}
              classNamePrefix="react-select"
              isClearable={meta.isClearable}
              name={meta.name || ''}
              {...handler()}
              isDisabled={
                meta.disabled !== undefined ? meta.disabled : handler().disabled
              }
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
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            name={meta.name || ''}
            {...handler()}
            isDisabled={
              meta.disabled !== undefined ? meta.disabled : handler().disabled
            }
          />
        </FormGroup>
      </Col>
    );
  },
  Button: ({
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
    return (
      <Col xs={meta.colWidth}>
        <Button bsStyle="link" className="" onClick={meta.buttonAction}>
          {meta.buttonName}
        </Button>
      </Col>
    );
  },
  RichTextEditor: ({
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
        style={meta.style}
      >
        <ControlLabel>{meta.label}</ControlLabel>
        <RichTextEditor
          onChange={handler().onChange}
          initialContent={meta.initialContent}
          readOnly={meta.readOnly}
        />
        <FormControl.Feedback />
      </FormGroup>
    </Col>
  ),
  translateForm: (config: FieldConfig, t: TranslationFunction) => {
    const newControls = mapValues(config.controls, field => {
      if (field.meta && field.meta.label) {
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
        // we need this to translate the options for the security functions
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
  },
  TextLabel: ({ handler, meta }: any) => {
    return (
      <Col xs={meta.colWidth}>
        <FormGroup bsSize="sm">
          <ControlLabel>{meta.label}</ControlLabel>
          <h5 className="queue-form-label">{handler().value}</h5>
        </FormGroup>
      </Col>
    );
  }
};
// reusable user form elements
export const userBaseConfigControls = {
  first: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: { label: 'user:first', colWidth: 6, type: 'text', name: 'first' }
  },
  last: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: { label: 'user:last', colWidth: 6, type: 'text', name: 'last' }
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
    meta: { label: 'user:email', colWidth: 12, type: 'text', name: 'email' }
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
      placeholder: '***-***-****',
      name: 'phone'
    }
  },
  position: {
    options: {
      validators: [Validators.required, FormUtil.validators.requiredWithTrim]
    },
    render: FormUtil.TextInput,
    meta: {
      label: 'user:position',
      colWidth: 6,
      type: 'text',
      name: 'position'
    }
  }
};
