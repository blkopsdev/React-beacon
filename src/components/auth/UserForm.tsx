/* 
* UserForm 
* User signs up directly to the platform
*/

import * as React from 'react';
import { Validators, FormGenerator, FormBuilder } from 'react-reactive-form';
// Input component
const TextInput = ({ handler, touched, hasError, meta }: any) => (
  <div>
    <input placeholder={`Enter ${meta.label}`} {...handler()} />
    <span>
      {touched && hasError('required') && `${meta.label} is required`}
    </span>
  </div>
);
// Checkbox component
const CheckBox = ({ handler }: any) => (
  <div>
    <input {...handler('checkbox')} />
  </div>
);
// Field config to configure form
const fieldConfig = {
  controls: {
    first: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'First Name', colWidth: 3 }
    },
    last: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Last Name' }
    },
    email: {
      render: CheckBox
    },
    $field_0: {
      isStatic: false,
      render: ({ invalid, meta: { handleReset } }: any) => (
        <div>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" disabled={invalid}>
            Submit
          </button>
        </div>
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
  userForm = FormBuilder.group({
    username: ['', Validators.required]
  });
  constructor(props: Iprops) {
    super(props);
    this.state = {
      signupForm: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleReset = () => {
    this.userForm.reset();
  };
  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form values', this.userForm.value);
    // this.props.handleSubmit(this.userForm.value);
  };
  setForm = (form: any) => {
    this.userForm = form;
    this.userForm.meta = {
      handleReset: this.handleReset
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
