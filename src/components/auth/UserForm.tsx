/* 
* UserForm 
* User signs up directly to the platform
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl
} from 'react-reactive-form';
import {
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';
import { forEach } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';

const getValidationState = (
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
};
// Input component
const TextInput = ({
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
      validationState={getValidationState(pristine, errors, submitted)}
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
);

// Field config to configure form
const fieldConfig = {
  controls: {
    first: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'First Name', colWidth: 6, type: 'text' }
    },
    last: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
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
      render: TextInput,
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
      render: TextInput,
      meta: {
        label: 'Phone Number',
        colWidth: 6,
        type: 'tel',
        placeholder: '***-***-****'
      }
    },
    tempCompany: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Company Name', colWidth: 12, type: 'text' }
    },
    tempAddress: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Address', colWidth: 8, type: 'text' }
    },
    tempAddress2: {
      render: TextInput,
      meta: { label: 'Address 2', colWidth: 4, type: 'text' }
    },
    tempCity: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'City', colWidth: 5, type: 'text' }
    },
    tempState: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'State', colWidth: 3, type: 'text' }
    },
    tempZip: {
      options: {
        validators: [
          Validators.required,
          Validators.pattern(
            /(^[0-9]{5}(-[0-9]{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}[0-9]{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstv‌​xy]{1} *[0-9]{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvxy]{1}[0-9]{1}$)/
          )
        ]
      },
      render: TextInput,
      meta: { label: 'Zip', colWidth: 4, type: 'tel' }
    },
    position: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Position', colWidth: 12, type: 'text' }
    },
    $field_0: {
      isStatic: false,
      render: ({
        meta: { handleCancel, cancelText, submitText, loading }
      }: any) => (
        <Col xs={12} className="user-form-buttons">
          <Button
            bsStyle="link"
            type="button"
            onClick={handleCancel}
            style={{ color: 'white' }}
          >
            {cancelText}
          </Button>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={loading}
            className="pull-right"
          >
            {submitText}
          </Button>
        </Col>
      )
    }
  }
};

const testUser = {
  first: 'jim',
  last: 'bean',
  email: 'a@test.com',
  position: 'president',
  tempAddress: '12 street',
  tempAddress2: '2 street',
  tempCity: 'mycity',
  tempZip: '77080',
  tempState: 'TX',
  tempCompany: 'BP',
  phone: '888-333-1121'
};
interface Iprops extends React.Props<{}> {
  handleSubmit: any;
  handleCancel: any;
}
interface Istate {
  signupForm: any;
}
export default class UserForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      signupForm: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      forEach(testUser, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log('Form values', this.userForm);
    this.props.handleSubmit(this.userForm.value);
  };
  setForm = (form: any) => {
    this.userForm = form;
    this.userForm.meta = {
      handleCancel: this.props.handleCancel,
      cancelText: 'Cancel',
      submitText: 'Sign Up',
      loading: false
    };
  };
  render() {
    return (
      <div className="loginForm">
        <form onSubmit={this.handleSubmit} className="user-form">
          <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
        </form>
      </div>
    );
  }
}
