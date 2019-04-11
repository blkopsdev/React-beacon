/* 
* UserProfile form
* Edit your profile
*/

import * as React from 'react';
import {
  FormGenerator,
  AbstractControl,
  Observable,
  Validators,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
import { constants } from 'src/constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import { Iuser, Icustomer, Ioption } from '../../models';
import { forEach, find, differenceBy, filter, map } from 'lodash';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { deleteUserAccount, updateUserProfile } from 'src/actions/userActions';

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const buildFieldConfig = (facilityOptions: any[]) => {
  // Field config to configure form
  const fieldConfigControls = {
    customerName: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'company', colWidth: 12, type: 'text', name: 'customer' }
    },
    facilities: {
      render: FormUtil.Select,
      meta: {
        options: facilityOptions,
        label: 'common:facility',
        colWidth: 12,
        placeholder: 'userQueue:facilitySearchPlaceholder',
        isMulti: true,
        name: 'facilities'
      },
      options: {
        validators: Validators.required
      }
    }
  };
  const fieldConfig = {
    controls: { ...userBaseConfigControls, ...fieldConfigControls }
  };
  return fieldConfig as FieldConfig;
};

interface Iprops {
  updateUserProfile: typeof updateUserProfile;
  toggleModal: () => void;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customers: Icustomer[];
  user: Iuser;
  facilityOptions: Ioption[];
  getFacilitiesByCustomer: (value: string) => void;
  deleteUserAccount: typeof deleteUserAccount;
}

class UserProfileForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  private fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.facilityOptions),
      this.props.t
    );
  }

  componentWillMount() {
    this.props.getFacilitiesByCustomer(this.props.user.customerID);
  }

  componentDidMount() {
    // set values
    forEach(this.props.user, (value, key) => {
      this.userForm.patchValue({ [key]: value });
    });
    const { facilities, customer } = this.props.user;

    const emailControl = this.userForm.get('email') as AbstractControlEdited;
    emailControl.disable();

    if (customer && customer.name.length) {
      this.userForm.patchValue({ customerName: customer.name });
    }
    const customerControl = this.userForm.get(
      'customerName'
    ) as AbstractControlEdited;
    customerControl.disable();

    const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
      return find(facilities, { id: fac.value }) ? true : false;
    });
    this.userForm.patchValue({ facilities: facilitiesArray });
  }
  componentDidUpdate(prevProps: Iprops) {
    if (
      differenceBy(
        prevProps.facilityOptions,
        this.props.facilityOptions,
        'value'
      ).length ||
      prevProps.facilityOptions.length !== this.props.facilityOptions.length
    ) {
      const facilitySelectControl = this.userForm.get(
        'facilities'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        return find(this.props.user.facilities, {
          id: fac.value
        })
          ? true
          : false;
      });
      this.userForm.patchValue({ facilities: facilitiesArray });
    }
  }

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    const facilitiesArray = map(
      this.userForm.value.facilities,
      (option: { value: string; label: string }) => {
        return { id: option.value };
      }
    );
    this.props.updateUserProfile({
      ...this.props.user,
      ...this.userForm.value,
      facilities: facilitiesArray,
      email: this.props.user.email // have to add back the email because disabling the input removes it
    });
  };
  handleDelete = () => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.deleteUserAccount();
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('delete account'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(
      this.props.t('userAccountDeleteConfirm'),
      toastrConfirmOptions
    );
  };

  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix beacon-form ${this.props.colorButton}`;

    return (
      <form onSubmit={this.handleSubmit} className={formClassName}>
        <FormGenerator onMount={this.setForm} fieldConfig={this.fieldConfig} />
        <Col xs={12} className="form-buttons text-right">
          <Button
            bsStyle="default"
            type="button"
            className="pull-left"
            onClick={this.props.toggleModal}
          >
            {t('common:cancel')}
          </Button>
          <Button
            bsStyle="danger"
            style={{ marginRight: '15px' }}
            type="button"
            className=""
            disabled={this.props.loading}
            onClick={this.handleDelete}
          >
            {t('user:delete account')}
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
    );
  }
}
export default translate('user')(UserProfileForm);
