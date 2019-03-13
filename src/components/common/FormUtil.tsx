import * as React from 'react';

import {
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Row
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

// add the bootstrap form-control class to the react-select select component
const ControlComponent = (props: any) => (
  <div>
    <components.Control {...props} className="form-control" />
  </div>
);

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
      const lastOption =
        item.first && item.last ? item.first + ' ' + item.last : 'unknown';
      return {
        value: item.id,
        label: item.name || item.code || item.label || lastOption
      };
    });
  },
  convertToSingleOption: (item: any): Ioption | null => {
    if (item && item.id && item.id.length) {
      const lastOption =
        item.first && item.last ? item.first + ' ' + item.last : 'unknown';
      return {
        value: item.id,
        label: item.name || item.code || item.label || lastOption
      };
    } else {
      return null;
    }
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
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => {
    const requiredLabel = meta.required === false ? ' - optional' : '';
    return (
      <FormGroup
        validationState={FormUtil.getValidationState(
          pristine,
          errors,
          submitted
        )}
        bsSize="sm"
        className="datetime-select"
      >
        <Col xs={meta.colWidth}>
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
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
    );
  },
  DatetimeWithoutValidation: ({ handler, meta }: AbstractControl) => (
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
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => {
    const requiredLabel = meta.required === false ? ' - optional' : '';
    return (
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
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
          <FormControl
            placeholder={meta.placeholder}
            componentClass={meta.componentClass}
            type={meta.type || 'text'}
            rows={meta.rows}
            autoFocus={meta.autoFocus}
            name={meta.name || ''}
            {...handler()}
          />
          <FormControl.Feedback />
        </FormGroup>
      </Col>
    );
  },
  Toggle: ({
    handler,
    touched,
    meta,
    pristine,
    errors,
    submitted,
    value
  }: AbstractControl) => {
    const requiredLabel = meta.required === false ? ' - optional' : '';
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
          <label className="control-label">
            <Toggle
              icons={false}
              checked={value}
              {...handler()}
              className="beacon-toggle"
              name={meta.name || ''}
            />
            <span className="react-toggle-label">
              {meta.label}
              <i className="required-label">{requiredLabel}</i>
            </span>
          </label>
        </FormGroup>
      </Col>
    );
  },
  TextInputWithoutValidation: ({ handler, meta }: AbstractControl) => (
    <Col xs={meta.colWidth}>
      <FormGroup bsSize="sm">
        <ControlLabel>{meta.label}</ControlLabel>
        <FormControl
          placeholder={meta.placeholder}
          componentClass={meta.componentClass}
          name={meta.name || ''}
          {...handler()}
        />
      </FormGroup>
    </Col>
  ),
  Select: ({
    handler,
    touched,
    meta,
    pristine,
    errors,
    submitted,
    value
  }: AbstractControl) => {
    const selectClassName = meta.isMulti
      ? 'is-multi beacon-select'
      : 'beacon-select';
    const selectValidationClass = value && !pristine ? 'has-success' : '';
    // console.log('validator', errors);
    const requiredLabel = meta.required === false ? ' - optional' : '';
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
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
          <Select
            options={meta.options}
            className={`${selectClassName} ${selectValidationClass}`}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            name={meta.name || ''}
            isClearable={
              typeof meta.isClearable !== 'undefined' ? meta.isClearable : false
            }
            isDisabled={handler().disabled}
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  CreatableSelect: ({
    handler,
    touched,
    meta,
    pristine,
    errors,
    submitted,
    value
  }: AbstractControl) => {
    const selectClassName = meta.isMulti
      ? 'is-multi beacon-select'
      : 'beacon-select';
    const selectValidationClass = value && !pristine ? 'has-success' : '';
    const requiredLabel = meta.required === false ? ' - optional' : '';
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
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
          <CreatableSelect
            options={meta.options}
            className={`${selectClassName} ${selectValidationClass}`}
            components={{ Control: ControlComponent }}
            placeholder={meta.placeholder}
            isMulti={meta.isMulti}
            classNamePrefix="react-select"
            onCreateOption={meta.handleCreate}
            isClearable={
              typeof meta.isClearable !== 'undefined' ? meta.isClearable : false
            }
            name={meta.name || ''}
            isDisabled={handler().disabled}
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  CreatableSelectWithButton: ({
    handler,
    touched,
    meta,
    pristine,
    errors,
    submitted,
    value
  }: AbstractControl) => {
    const selectClassName = meta.isMulti
      ? 'is-multi beacon-select'
      : 'beacon-select';
    const selectValidationClass = value && !pristine ? 'has-success' : '';
    const requiredLabel = meta.required === false ? ' - optional' : '';
    return (
      <Col xs={meta.colWidth}>
        <Row>
          <Col xs={9}>
            <FormGroup
              validationState={FormUtil.getValidationState(
                pristine,
                errors,
                submitted
              )}
              bsSize="sm"
            >
              <ControlLabel>
                {meta.label}
                <i className="required-label">{requiredLabel}</i>
              </ControlLabel>
              <CreatableSelect
                options={meta.options}
                className={`${selectClassName} ${selectValidationClass}`}
                components={{ Control: ControlComponent }}
                placeholder={meta.placeholder}
                isMulti={meta.isMulti}
                classNamePrefix="react-select"
                onCreateOption={meta.handleCreate}
                isClearable={
                  typeof meta.isClearable !== 'undefined'
                    ? meta.isClearable
                    : false
                }
                name={meta.name || ''}
                isDisabled={handler().disabled}
                {...handler()}
              />
            </FormGroup>
            <small>Create a new tab by typing.</small>
          </Col>
          <Col xs={3} style={{ paddingTop: '20px' }}>
            <Button className="pull-right" onClick={meta.buttonAction}>
              {meta.buttonName}
            </Button>
          </Col>
        </Row>
      </Col>
    );
  },
  SelectWithoutValidation: ({ handler, meta }: AbstractControl) => {
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti
      ? 'is-multi beacon-select'
      : 'beacon-select';
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
              typeof meta.isClearable !== 'undefined' ? meta.isClearable : false
            }
            name={meta.name || ''}
            isDisabled={handler().disabled}
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  SelectWithoutValidationLeftLabel: ({ handler, meta }: AbstractControl) => {
    // TODO get rid of this because default values do not work for some unknwon reason.  we patch the values instead
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti
      ? 'is-multi beacon-select'
      : 'beacon-select';
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
              isClearable={
                typeof meta.isClearable !== 'undefined'
                  ? meta.isClearable
                  : false
              }
              name={meta.name || ''}
              isDisabled={handler().disabled}
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
    meta,
    pristine,
    errors,
    submitted,
    value
  }: AbstractControl) => {
    // console.log('rendering select', meta.options, value, defaultValue)
    const selectClassName = meta.isMulti
      ? 'is-multi beacon-select'
      : 'beacon-select';
    const selectValidationClass = value && !pristine ? 'has-success' : '';
    const requiredLabel = meta.required === false ? ' - optional' : '';
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
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
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
            isDisabled={handler().disabled}
            {...handler()}
          />
        </FormGroup>
      </Col>
    );
  },
  Button: ({ handler, meta }: AbstractControl) => {
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
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => {
    const requiredLabel = meta.required === false ? ' - optional' : '';
    return (
      <Col xs={meta.colWidth}>
        <FormGroup bsSize="sm" style={meta.style}>
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
          <RichTextEditor
            onChange={handler().onChange}
            initialContent={meta.initialContent}
            readOnly={handler().disabled}
          />
          <FormControl.Feedback />
        </FormGroup>
      </Col>
    );
  },
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
  },
  PassFail: ({
    handler,
    touched,
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => {
    const requiredLabel = meta.required === false ? ' - optional' : '';
    return (
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
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
          <ToggleButtonGroup name="pass-fail" {...handler()} type="radio">
            <ToggleButton value={1}>Pass</ToggleButton>
            <ToggleButton value={2}>Fail</ToggleButton>
            <ToggleButton value={3}>N/A</ToggleButton>
          </ToggleButtonGroup>
          <FormControl.Feedback />
        </FormGroup>
      </Col>
    );
  },
  NumericInput: ({
    handler,
    touched,
    meta,
    pristine,
    errors,
    submitted
  }: AbstractControl) => {
    const requiredLabel = meta.required === false ? ' - optional' : '';
    return (
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
          <ControlLabel>
            {meta.label}
            <i className="required-label">{requiredLabel}</i>
          </ControlLabel>
          <FormControl
            placeholder={meta.placeholder}
            componentClass={meta.componentClass}
            type="number"
            rows={meta.rows}
            autoFocus={meta.autoFocus}
            name={meta.name || ''}
            {...handler()}
          />
          <FormControl.Feedback />
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
