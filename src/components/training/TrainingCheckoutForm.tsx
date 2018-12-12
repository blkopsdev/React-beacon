/* 
* Edit Training Checkout Form
*/

import {
  Col,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Badge
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Validators
} from 'react-reactive-form';
import { mapValues, forEach } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  Ioption,
  IshoppingCartProduct,
  IproductInfo,
  IshoppingCart,
  ItableFiltersReducer
} from '../../models';
import {
  toggleShoppingCartModal,
  updateQuantityCart,
  deleteFromCart
} from '../../actions/shoppingCartActions';
import constants from '../../constants/constants';
import { requestQuote } from 'src/actions/manageInventoryActions';

/*
* Input row with a button to delete the cart item
*/
const NumberInputWithButton = ({
  handler,
  touched,
  hasError,
  meta,
  pristine,
  errors,
  submitted
}: AbstractControl) => (
  <FormGroup
    bsSize="sm"
    validationState={FormUtil.getValidationState(pristine, errors, submitted)}
  >
    <Col xs={8}>
      <ControlLabel>{meta.label}</ControlLabel>
    </Col>
    <Col
      xs={4}
      style={{ textAlign: 'center', paddingRight: '0', paddingLeft: '0' }}
    >
      <FormControl
        style={{ width: '50%', display: 'inline' }}
        placeholder={meta.placeholder}
        type="number"
        {...handler()}
      />
      <Button
        bsStyle="link"
        style={{ fontSize: '1.6em' }}
        onClick={() => meta.buttonAction(meta.id)}
      >
        <FontAwesomeIcon icon={['far', 'times']} />
      </Button>
    </Col>
  </FormGroup>
);

/*
* Card product with a button to delete it
*/
const CartProduct = ({
  handler,
  touched,
  hasError,
  meta,
  pristine,
  errors,
  submitted
}: AbstractControl) => (
  <FormGroup
    bsSize="sm"
    validationState={FormUtil.getValidationState(pristine, errors, submitted)}
  >
    <Col xs={8}>
      <ControlLabel>{meta.label}</ControlLabel>
    </Col>
    <Col
      xs={4}
      style={{ textAlign: 'center', paddingRight: '0', paddingLeft: '0' }}
    >
      <Badge>${`${meta.cost / 100}`}</Badge>
      <Button
        bsStyle="link"
        style={{ fontSize: '1.6em' }}
        onClick={() => meta.buttonAction(meta.id)}
      >
        <FontAwesomeIcon icon={['far', 'times']} />
      </Button>
    </Col>
  </FormGroup>
);

const buildFieldConfig = (
  products: { [key: string]: IshoppingCartProduct },
  deleteFromCartCB: typeof deleteFromCart,
  cartName: string,
  showCost: boolean = false
) => {
  const productControls = mapValues(products, prod => {
    return {
      render: showCost ? CartProduct : NumberInputWithButton,
      options: {
        validators: [
          Validators.min(1),
          Validators.max(1000),
          Validators.required
        ]
      },
      meta: {
        label: prod.name,
        defaultValue: prod.quantity,
        buttonAction: (id: string) => deleteFromCartCB(id, cartName),
        id: prod.id,
        cost: prod.cost
      }
    };
  });
  const fieldConfigControls = {
    message: {
      render: FormUtil.TextInput,
      options: {
        validators: [Validators.required, FormUtil.validators.requiredWithTrim]
      },
      meta: {
        label: 'message',
        colWidth: 12,
        componentClass: 'textarea',
        rows: 8
      }
    }
  };
  return {
    controls: { ...productControls, ...fieldConfigControls }
  };
};

interface Iprops {
  checkout: typeof requestQuote;
  toggleShoppingCartModal: typeof toggleShoppingCartModal;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  productInfo: IproductInfo;
  facilityOptions: Ioption[];
  cart: IshoppingCart;
  tableFilters: ItableFiltersReducer;
  updateQuantityCart: typeof updateQuantityCart;
  deleteFromCart: typeof deleteFromCart;
  cartName: string;
  showCost?: boolean;
}
interface Istate {
  fieldConfig: FieldConfig;
}

class EditQuoteForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
    this.state = {
      fieldConfig: { controls: {} }
    };
  }
  // TODO keep the message somewhere, patch the value
  componentDidMount() {
    this.setFormConfig();
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  componentDidUpdate(prevProps: Iprops) {
    if (prevProps.cart.addedIDs.length !== this.props.cart.addedIDs.length) {
      console.log('products changed');
      this.setFormConfig();
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

    this.props.checkout({
      message: this.userForm.value.message,
      facilityID: this.props.tableFilters.facility
        ? this.props.tableFilters.facility.value
        : this.props.facilityOptions[0].value
    });
  };
  setFormConfig = () => {
    this.setState(
      {
        fieldConfig: FormUtil.translateForm(
          buildFieldConfig(
            this.props.cart.productsByID,
            this.props.deleteFromCart,
            this.props.cartName,
            this.props.showCost
          ),
          this.props.t
        )
      },
      () => {
        forEach(this.state.fieldConfig.controls, (input: any, key) => {
          if (this.userForm && input.meta && input.meta.defaultValue) {
            this.userForm.patchValue({ [key]: input.meta.defaultValue });
          }
          if (
            this.userForm &&
            this.props.cart.addedIDs.length &&
            key !== 'message'
          ) {
            this.subscription = this.userForm
              .get(key)
              .valueChanges.subscribe((value: any) => {
                this.props.updateQuantityCart(
                  parseInt(value, 10),
                  key,
                  this.props.cartName
                );
              });
          }
        });
      }
    );
  };
  setForm = (form: AbstractControl) => {
    console.log('setting form');
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
  };

  calculateSubtotal = () => {
    let subtotal = 0;
    forEach(this.props.cart.productsByID, product => {
      subtotal += product.cost;
    });
    return subtotal;
  };

  render() {
    const { t } = this.props;

    const formClassName = `user-form manage-form ${this.props.colorButton}`;
    if (this.props.cart.addedIDs.length === 0) {
      return (
        <div>
          <h4 style={{ padding: '15px' }}>
            {this.props.t('emptyQuoteMessage')}
          </h4>
          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={() =>
                this.props.toggleShoppingCartModal(this.props.cartName)
              }
            >
              {t('common:cancel')}
            </Button>
          </Col>
        </div>
      );
    }
    return (
      <div>
        <div className={formClassName}>
          <form
            action="https://demo.unitedtranzactions.com/obp/onlineBillPay.asp"
            method="post"
            target="MyMedGas"
            name="obpauto"
            className="clearfix beacon-form user-form"
          >
            <input hidden={true} name="User" id="1" value="beacon" />

            <input hidden={true} name="Owner" id="Owner" value="0400008000" />
            <input
              hidden={true}
              name="CustomerNo"
              id="CustomerNo"
              value="0400008005"
            />

            <input
              hidden={true}
              name="merchantno"
              id="merchantno"
              value="0400008000"
            />

            <input
              hidden={true}
              name="password"
              id="password"
              value="P@ym3nts"
            />

            <input
              hidden={true}
              name="Amount"
              id="Amount"
              value={this.calculateSubtotal() / 100}
            />

            <input
              hidden={true}
              name="transactiondate"
              id="transactiondate"
              value="11-05-2018"
            />
            <input
              hidden={true}
              name="redirect"
              id="redirect"
              value="https://beacon-mmg-api-phase2-dev.azurewebsites.net/training/acceptutapayment"
            />

            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.state.fieldConfig}
            />
            <Col xs={12} className="cart-totals">
              Subtotal: ${this.calculateSubtotal() / 100}
            </Col>

            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={() =>
                  this.props.toggleShoppingCartModal(this.props.cartName)
                }
              >
                {t('common:cancel')}
              </Button>
              <Button
                bsStyle={this.props.colorButton}
                type="submit"
                disabled={this.props.loading}
              >
                {t('checkout')}
              </Button>
            </Col>
          </form>
        </div>
      </div>
    );
  }
}
export default translate('training')(EditQuoteForm);
