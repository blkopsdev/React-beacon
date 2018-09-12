/* 
* Manage Inventory Form 
* Edit inventory items
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, differenceBy, filter, find, map } from 'lodash';
import { forEach, map } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil, userBaseConfigControls } from '../common/FormUtil';
import { Iproduct } from '../../models';

const buildFieldConfig = (facilityOptions: any[]) => {
  const fieldConfigControls = {
    customer: {
      options: {
        validators: Validators.required
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

// interface IstateChanges extends Observable<any> {
//   next: () => void;
// }

// interface AbstractControlEdited extends AbstractControl {
//   stateChanges: IstateChanges;
// }

interface Iprops {
  handleSubmit: any;
  handleCancel: any;
  selectedItem?: Iproduct;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  customerOptions: any[];
  facilityOptions: any[];
}

class ManageInventoryForm extends React.Component<Iprops, {}> {
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
    // commmented out updating the facilities because we are using the facilities from the logged in user object.  this should not change
    // if (
    //   differenceBy(
    //     prevProps.facilityOptions,
    //     this.props.facilityOptions,
    //     'value'
    //   ).length ||
    //   prevProps.facilityOptions.length !== this.props.facilityOptions.length
    // ) {
    //   // update the options
    //   const facilitySelectControl = this.userForm.get(
    //     'facilities'
    //   ) as AbstractControlEdited;
    //   facilitySelectControl.meta.options = this.props.facilityOptions;
    //   facilitySelectControl.stateChanges.next();
    // }
    // update the selected options if there is a selected user
    // if (typeof this.props.selectedItem !== 'undefined') {
    //   const facilitiesArray = filter(this.props.facilityOptions, (fac: any) => {
    //     if (typeof this.props.selectedItem !== 'undefined') {
    //       return find(this.props.selectedItem.facilities, { id: fac.value })
    //         ? true
    //         : false;
    //     } else {
    //       return false;
    //     }
    //   });
    // this.userForm.patchValue({ facilities: facilitiesArray });
    // }
  }

  componentDidMount() {
    // const customer: any = find(this.props.customerOptions, {
    //   value: customerID
    // }) || { name: '' };
    // if (customer && customer.label.length) {
    //   this.userForm.patchValue({ customer: customer.label });
    // }
    // const customerControl = this.userForm.get(
    //   'customer'
    // ) as AbstractControlEdited;
    // customerControl.disable();
    // if there is a customerID then get facilities

    if (!this.props.selectedItem) {
      console.log('adding a new user');
      return;
    } else {
      // set values
      forEach(this.props.selectedItem, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });
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

    if (this.props.selectedItem) {
      this.props.handleSubmit(
        {
          id: this.props.selectedItem.id,
          ...this.userForm.value,
          facilities: facilitiesArray
        },
        shouldApprove,
        this.props.selectedItem.id
      );
    } else {
      this.props.handleSubmit({
        ...this.userForm.value,
        facilities: facilitiesArray
      });
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
export default translate('user')(ManageInventoryForm);
