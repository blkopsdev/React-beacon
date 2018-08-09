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
import { Col, Button } from 'react-bootstrap';
import { forEach } from 'lodash';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { FormUtil, userBaseConfigControls } from '../common/FormUtil';

// Field config to configure form
const fieldConfigControls = {
  tempCompany: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'Company Name', colWidth: 12, type: 'text' }
  },
  tempAddress: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'Address', colWidth: 8, type: 'text' }
  },
  tempAddress2: {
    render: FormUtil.TextInput,
    meta: { label: 'Address 2', colWidth: 4, type: 'text' }
  },
  tempCity: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'City', colWidth: 5, type: 'text' }
  },
  tempState: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
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
    render: FormUtil.TextInput,
    meta: { label: 'Zip', colWidth: 4, type: 'tel' }
  }
};
const fieldConfig = {
  controls: { ...userBaseConfigControls, ...fieldConfigControls }
};

const testUser = {
  first: 'Little',
  last: 'Pixel',
  email: 'a@test.com',
  position: 'president',
  tempAddress: '12 street',
  tempAddress2: '2 street',
  tempCity: 'mycity',
  tempZip: '77080',
  tempState: 'TX',
  tempCompany: 'BigPixel',
  phone: '888-333-1121'
};
interface Iprops extends React.Props<UserForm> {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
}
interface Istate {
  loading: boolean;
}
export default class UserForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      loading: false
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
    this.setState({ loading: true });
    this.props
      .handleSubmit(this.userForm.value)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      handleCancel: this.props.handleCancel,
      cancelText: 'Cancel',
      submitText: 'Sign Up',
      loading: this.props.loading
    };
  };
  render() {
    return (
      <div className="loginForm">
        <form onSubmit={this.handleSubmit} className="user-form">
          <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
          <Col xs={12} className="user-form-buttons">
            <Button
              bsStyle="link"
              type="button"
              onClick={this.props.handleCancel}
              style={{ color: 'white' }}
              disabled={this.props.loading}
              className="left-side"
            >
              Cancel
            </Button>
            {this.state.loading && (
              <div className="spinner">
                <div className="double-bounce1" />
                <div className="double-bounce2" />
              </div>
            )}
            <Button
              bsStyle="primary"
              type="submit"
              disabled={this.props.loading}
              className="pull-right"
            >
              Sign Up
            </Button>
          </Col>
        </form>
      </div>
    );
  }
}
