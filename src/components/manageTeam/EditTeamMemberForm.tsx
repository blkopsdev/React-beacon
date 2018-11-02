/* 
* EditTeamMemberForm 
* Edit team members
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { forEach, differenceBy, filter, find, map } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { Ioption, Iuser } from '../../models';
import {
  deleteTeamUser,
  saveTeamUser,
  toggleEditTeamUserModal,
  updateTeamUser
} from '../../actions/manageTeamActions';
import { getFacilitiesByCustomer } from '../../actions/commonActions';
import constants from '../../constants/constants';

const buildFieldConfig = (facilityOptions: any[]) => {
  const fieldConfigControls = {
    customer: {
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      render: FormUtil.TextInput,
      meta: { label: 'company', colWidth: 12, type: 'text' }
    },
    facilities: {
      render: FormUtil.Select,
      meta: {
        options: facilityOptions,
        label: 'common:facility',
        colWidth: 12,
        placeholder: 'userQueue:facilitySearchPlaceholder',
        isMulti: true
      },
      options: {
        validators: Validators.required
      }
    }
  };
  return {
    controls: { ...userBaseConfigControls, ...fieldConfigControls }
  };
};

interface IstateChanges extends Observable<any> {
  next: () => void;
}

interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

interface Iprops {
  updateTeamUser: typeof updateTeamUser;
  saveTeamUser: typeof saveTeamUser;
  toggleEditTeamUserModal: typeof toggleEditTeamUserModal;
  selectedUser?: Iuser;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: any[];
  getFacilitiesByCustomer: typeof getFacilitiesByCustomer;
  facilityOptions: any[];
  user: Iuser;
  deleteTeamUser: typeof deleteTeamUser;
}

class EditTeamMemberForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.facilityOptions),
      this.props.t
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
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
      // update the options
      const facilitySelectControl = this.userForm.get(
        'facilities'
      ) as AbstractControlEdited;
      facilitySelectControl.meta.options = this.props.facilityOptions;
      facilitySelectControl.stateChanges.next();
    }

    // update the selected options if there is a selected user
    if (typeof this.props.selectedUser !== 'undefined') {
      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        if (typeof this.props.selectedUser !== 'undefined') {
          return find(this.props.selectedUser.facilities, { id: fac.value })
            ? true
            : false;
        } else {
          return false;
        }
      });
      this.userForm.patchValue({ facilities: facilitiesArray });
    }
  }

  componentDidMount() {
    // get the customer name
    const { customerID } = this.props.user;
    const customer = (find(
      this.props.customerOptions,
      (cust: Ioption) => cust.value === customerID
    ) as Ioption) || { name: '' };
    if (customer && customer.label && customer.label.length) {
      this.userForm.patchValue({ customer: customer.label });
    }
    const customerControl = this.userForm.get(
      'customer'
    ) as AbstractControlEdited;
    customerControl.disable();
    // if there is a customerID then get facilities
    if (customerID.length) {
      this.props.getFacilitiesByCustomer(customerID);
    }

    if (!this.props.selectedUser) {
      console.log('adding a new user');
      return;
    } else {
      const { facilities } = this.props.selectedUser;

      const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
        return find(facilities, { id: fac.value }) ? true : false;
      });
      this.userForm.patchValue({ facilities: facilitiesArray });
      // set values
      forEach(this.props.selectedUser, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });

      const emailControl = this.userForm.get('email') as AbstractControlEdited;
      emailControl.disable();
    }
  }

  handleSubmit = (
    e: React.MouseEvent<HTMLFormElement>,
    shouldApprove?: boolean
  ) => {
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

    if (this.props.selectedUser) {
      this.props.updateTeamUser({
        id: this.props.selectedUser.id,
        ...this.userForm.value,
        facilities: facilitiesArray,
        customerID: this.props.user.customerID,
        email: this.props.selectedUser.email // have to add back the email because disabling the input removes it
      });
    } else {
      this.props.saveTeamUser({
        ...this.userForm.value,
        facilities: facilitiesArray
      });
    }
  };
  handleDelete = () => {
    if (this.props.selectedUser) {
      this.props.deleteTeamUser(this.props.selectedUser.id);
    } else {
      console.error('unable to delete, missing user');
      toastr.error(
        'Error',
        'Unable to delete, missing user',
        constants.toastrError
      );
    }
  };
  setForm = (form: AbstractControl) => {
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  render() {
    const { t } = this.props;

    const formClassName = `user-form manage-form ${this.props.colorButton}`;

    return (
      <div>
        <div className={formClassName}>
          <form onSubmit={this.handleSubmit} className="user-form">
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={this.props.toggleEditTeamUserModal}
              >
                {t('common:cancel')}
              </Button>
              {!!this.props.selectedUser && (
                <Button
                  bsStyle="warning"
                  style={{ marginRight: '15px' }}
                  type="button"
                  className=""
                  disabled={this.props.loading}
                  onClick={this.handleDelete}
                >
                  {t('common:delete')}
                </Button>
              )}

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
export default translate('user')(EditTeamMemberForm);
