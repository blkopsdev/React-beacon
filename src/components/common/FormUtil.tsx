import * as React from 'react';

import {
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';
import { Validators } from 'react-reactive-form';

export const FormUtil = {
  getValidationState: (
    pristine: boolean,
    error: boolean,
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
  }: any) => (
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
          type={meta.type}
          placeholder={meta.placeholder}
          {...handler()}
        />
        <FormControl.Feedback />
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
  }: any) => (
    <Col xs={meta.colWidth}>
      <FormGroup bsSize="sm">
        <ControlLabel>{meta.label}</ControlLabel>
        <FormControl
          type={meta.type}
          placeholder={meta.placeholder}
          {...handler()}
        />
      </FormGroup>
    </Col>
  ),
  TextInputWithButton: ({
    handler,
    touched,
    hasError,
    meta,
    pristine,
    errors,
    submitted
  }: any) => (
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
          className="pull-right"
          onClick={meta.buttonAction}
        >
          {meta.buttonName}
        </Button>
        <FormControl
          type={meta.type}
          placeholder={meta.placeholder}
          {...handler()}
        />
        <FormControl.Feedback />
      </FormGroup>
    </Col>
  )
};
// reusable user form elements
export const userBaseConfigControls = {
  first: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'First Name', colWidth: 6, type: 'text' }
  },
  last: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'Last Name', colWidth: 6, type: 'text' }
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
    meta: { label: 'Email', colWidth: 6, type: 'text' }
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
      label: 'Phone Number',
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
    meta: { label: 'Position', colWidth: 12, type: 'text' }
  }
};
