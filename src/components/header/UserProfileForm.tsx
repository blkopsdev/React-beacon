/* 
* UserProfile form
* Edit your profile
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  Observable
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { Iuser } from '../../models';
import { forEach } from 'lodash';

import { userBaseConfigControls } from '../common/FormUtil';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const fieldConfig = {
  controls: { ...userBaseConfigControls }
};

interface Iprops extends React.Props<UserProfileForm> {
  handleSubmit: any;
  handleCancel: any;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customer: any;
  facilities: any;
  user: Iuser;
  facilityOptions: any[];
}

class UserProfileForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  constructor(props: Iprops) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {

  // }

  componentDidMount() {
    // set values
    forEach(this.props.user, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    const emailControl = this.userForm.get('email') as AbstractControlEdited;
    emailControl.disable();
    emailControl.stateChanges.next();
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    this.props.handleSubmit({
      ...this.props.user,
      ...this.userForm.value
    });
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `user-form profile-form ${this.props.colorButton}`;

    return (
      <div>
        <div className={formClassName}>
          <form onSubmit={this.handleSubmit} className="user-form">
            <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="link"
                type="button"
                className="pull-left left-side"
                onClick={this.props.handleCancel}
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
      </div>
    );
  }
}
export default translate('user')(UserProfileForm);
