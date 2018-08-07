/* 
* UserQueueForm 
* Edit and approve new users
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
import { IqueueUser } from '../../models';

// Field config to configure form
const fieldConfigControls = {
  tempCompany: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'Company Name', colWidth: 12, type: 'text' }
  },
  customerID: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'Customer', colWidth: 12, type: 'text' }
  },
  facilityID: {
    options: {
      validators: Validators.required
    },
    render: FormUtil.TextInput,
    meta: { label: 'Facility', colWidth: 12, type: 'text' }
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
  },
  $field_0: {
    isStatic: false,
    render: ({
      meta: { handleCancel, cancelText, submitText, loading }
    }: any) => (
      <Col xs={12} className="user-form-buttons">
        <Button bsStyle="link" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button bsStyle="primary" type="submit" disabled={loading} className="">
          Save
        </Button>
        <Button
          bsStyle="primary"
          type="button"
          disabled={loading}
          className="pull-right"
        >
          Save & Approve
        </Button>
      </Col>
    )
  }
};

interface Iprops extends React.Props<UserQueueForm> {
  handleSubmit: any;
  handleCancel: any;
  user: IqueueUser;
}
interface Istate {
  queueForm: any;
}
export default class UserQueueForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      queueForm: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  componentDidMount() {
    // set values
    forEach(this.props.user.user, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    // TODO: CHANGE TO REAL CUSTOMER STUFF
    // hardcode CustomerID for now
    this.userForm.patchValue({
      customerID: 'AAA5D95C-129F-4837-988C-0BF4AE1F3B67'
    });
    this.userForm.patchValue({
      facilityID: 'BBB5D95C-129F-4837-988C-0BF4AE1F3B67'
    });
    // console.log(this.userForm.value);
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    this.props.handleSubmit({
      id: this.props.user.user.id,
      ...this.userForm.value
    });
  };
  setForm = (form: AbstractControl) => {
    if (this.state.queueForm.status) {
      this.userForm = this.state.queueForm;
    } else {
      this.userForm = form;
      this.setState({ queueForm: form });
    }
    this.userForm.meta = {
      handleCancel: this.props.handleCancel,
      loading: false
    };
  };
  render() {
    const fieldConfig = {
      controls: { ...userBaseConfigControls, ...fieldConfigControls }
    };
    return (
      <div className="user-form">
        <form onSubmit={this.handleSubmit} className="user-form">
          <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
        </form>
      </div>
    );
  }
}
