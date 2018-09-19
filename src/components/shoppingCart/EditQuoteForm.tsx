/* 
* Edit Quote Form
*/

import * as React from 'react';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { Col, Button } from 'react-bootstrap';
// import { forEach, differenceBy, filter, find, map } from 'lodash';
import { forEach, find, filter } from 'lodash';

import constants from '../../constants/constants';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';

import { FormUtil } from '../common/FormUtil';
import { Iproduct, Ioption, IproductInfo, Isubcategory } from '../../models';
interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const buildFieldConfig = (
  productInfo: IproductInfo,
  filterSubcategories: (id: string) => void
) => {
  const fieldConfigControls = {
    name: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'name', colWidth: 12, type: 'input' }
    },
    sku: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      meta: { label: 'sku', colWidth: 12, type: 'input' }
    },
    description: {
      options: {
        validators: Validators.required
      },
      render: FormUtil.TextInput,
      inputType: 'textarea',
      meta: { label: 'description', colWidth: 12, type: 'textarea' }
    },
    productGroupID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.productGroupOptions,
        label: 'common:productGroup',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    brandID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.brandOptions,
        label: 'common:brand',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    manufacturerID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.manufacturerOptions,
        label: 'common:manufacturer',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    mainCategoryID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.mainCategoryOptions,
        label: 'common:mainCategory',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              filterSubcategories(c.value.value);
            }
          }
        ]
      }
    },
    subcategoryID: {
      render: FormUtil.Select,
      meta: {
        // options: productInfo.subcategoryOptions,
        label: 'common:subcategory',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    gasTypeID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.gasTypeOptions,
        label: 'common:gasType',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    powerID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.powerOptions,
        label: 'common:power',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    systemSizeID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.systemSizeOptions,
        label: 'common:systemSize',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    },
    standardID: {
      render: FormUtil.Select,
      meta: {
        options: productInfo.standardOptions,
        label: 'common:standard',
        colWidth: 6,
        placeholder: 'common:searchPlaceholder',
        isMulti: false
      },
      options: {
        validators: Validators.required
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
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
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
}

class EditQuoteForm extends React.Component<Iprops, {}> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(this.props.productInfo, this.filterSubcategories),
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
        if (typeof value === 'string' && key.split('ID').length === 1) {
          // it is a string and did Not find 'ID'
          this.userForm.patchValue({ [key]: value });
        } else if (value !== null) {
          this.userForm.patchValue({
            [key]: find(
              this.props.productInfo[`${key.split('ID')[0]}Options`],
              { value }
            )
          });
          // special set for mainCategory
          if (key === 'subcategory') {
            const { mainCategoryID } = value || ('' as any);
            this.userForm.patchValue({
              mainCategoryID: find(
                this.props.productInfo[`mainCategoryOptions`],
                { value: mainCategoryID }
              )
            });
          }
        }
      });
      //   const {productGroupID, brandID, manufacturerID, subcategoryID, gasTypeID, powerID, systemSizeID, standardID} = this.userForm.value

      //   this.userForm.patchValue({
      //   customerID: find(this.props.selectedItem, { value: productGroupID })
      // });
    }
  }
  filterSubcategories = (mainCategoryID: string) => {
    if (mainCategoryID) {
      const filteredSubcategories = filter(
        this.props.productInfo.subcategories,
        (sub: Isubcategory) => {
          return sub.mainCategoryID === mainCategoryID;
        }
      );
      const subcategoryControl = this.userForm.get(
        'subcategoryID'
      ) as AbstractControlEdited;
      subcategoryControl.meta.options = FormUtil.convertToOptions(
        filteredSubcategories
      );
      subcategoryControl.stateChanges.next();
      // try to set the value to the one selected by the user
      if (this.props.selectedItem) {
        const newSubcategory =
          find(subcategoryControl.meta.options, {
            value: this.props.selectedItem.subcategoryID
          }) || {};
        this.userForm.patchValue({ subcategoryID: newSubcategory });
      } else {
        // subcategoryControl.reset();
        // subcategoryControl.markAsPristine();
        // subcategoryControl.stateChanges.next();
        this.userForm.patchValue({ subcategoryID: null });
      }
    }
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);

    this.props.handleSubmit(this.userForm.value);
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
export default translate('user')(EditQuoteForm);
