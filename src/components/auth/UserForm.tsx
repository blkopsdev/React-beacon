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

const getValidationState = (pristine: boolean, error: boolean) => {
  if (!pristine && error) {
    return 'error';
  } else if (!pristine && !error) {
    return 'success';
  } else {
    return null;
  }
};
// Input component
const TextInput = ({ handler, touched, hasError, meta, pristine }: any) => (
  <Col xs={meta.colWidth}>
    <FormGroup
      validationState={getValidationState(pristine, hasError('required'))}
      bsSize="sm"
    >
      <ControlLabel>{meta.label}</ControlLabel>
      <FormControl type={meta.type} {...handler()} />
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
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Email', colWidth: 6, type: 'text' }
    },
    phone: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Phone Number', colWidth: 6, type: 'tel' }
    },
    tempCompany: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Company Name', colWidth: 12, type: 'text' }
    },
    tempAddress1: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Address', colWidth: 8, type: 'text' }
    },
    tempAddress2: {
      render: TextInput,
      meta: { label: 'Address2', colWidth: 4, type: 'text' }
    },
    tempCity: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'City', colWidth: 6, type: 'text' }
    },
    tempState: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'State', colWidth: 2, type: 'text' }
    },
    tempZip: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Zip', colWidth: 4, type: 'tel' }
    },
    position: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'State', colWidth: 12, type: 'text' }
    },
    $field_0: {
      isStatic: false,
      render: ({
        invalid,
        meta: { handleCancel, cancelText, submitText }
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
            disabled={invalid}
            className="pull-right"
          >
            {submitText}
          </Button>
        </Col>
      )
    }
  }
};
interface Iprops extends React.Props<{}> {
  handleSubmit: any;
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

  handleCancel = () => {
    console.log('cancel');
  };
  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form values', this.userForm.value);
    // this.props.handleSubmit(this.userForm.value);
  };
  setForm = (form: any) => {
    this.userForm = form;
    this.userForm.meta = {
      handleCancel: this.handleCancel,
      cancelText: 'Cancel',
      submitText: 'Sign Up'
    };
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="user-form">
        <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
      </form>
    );
  }
}
