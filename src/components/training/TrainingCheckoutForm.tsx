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
  ItableFiltersReducer,
  Iuser
} from '../../models';
import {
  toggleShoppingCartModal,
  updateQuantityCart,
  deleteFromCart
} from '../../actions/shoppingCartActions';
import constants from '../../constants/constants';
import { requestQuote } from 'src/actions/manageInventoryActions';
import Select, { components } from 'react-select';
import NumberFormat from 'react-number-format';

// add the bootstrap form-control class to the react-select select component
const ControlComponent = (props: any) => (
  <div>
    <components.Control {...props} className="form-control" />
  </div>
);

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
        name={meta.id}
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
      <Badge>
        <NumberFormat
          value={meta.cost / 100}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
        />
      </Badge>
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
        cost: prod.cost,
        name: prod.id
      }
    };
  });
  const fieldConfigControls = {
    memo: {
      render: FormUtil.TextInput,
      meta: {
        label: 'memo',
        colWidth: 12,
        componentClass: 'textarea',
        rows: 6,
        name: 'memo',
        required: false
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
  user: Iuser;
}
interface Istate {
  fieldConfig: FieldConfig;
}

class EditQuoteForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
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
      if (product.cost) {
        // TODO why is memo in the array of productsByID???
        subtotal += product.cost;
      }
    });
    return subtotal;
  };

  render() {
    const { t } = this.props;

    const formClassName = `clearfix beacon-form checkout-form ${
      this.props.colorButton
    }`;
    if (this.props.cart.addedIDs.length === 0) {
      return (
        <div>
          <h4 style={{ padding: '15px' }}>{this.props.t('emptyMessage')}</h4>
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
      <form
        action={process.env.REACT_APP_UTA}
        method="post"
        target="MyMedGas"
        name="obpauto"
        className={formClassName}
      >
        <input
          hidden={true}
          name="User"
          id="1"
          value={process.env.REACT_APP_UTA_USER}
        />
        <input
          hidden={true}
          name="Email"
          id="Email"
          value={this.props.user.email}
        />
        <input
          hidden={true}
          name="CustomerNo"
          id="CustomerNo"
          value={`${this.props.user.first} ${this.props.user.last}`}
        />
        <input
          hidden={true}
          name="CustomerName"
          id="CustomerName"
          value={this.props.user.customer.name}
        />

        <input
          hidden={true}
          name="merchantno"
          id="merchantno"
          value={process.env.REACT_APP_UTA_MERCH}
        />
        <input
          hidden={true}
          name="OWNER"
          id="OWNER"
          value={process.env.REACT_APP_UTA_OWNER}
        />

        <input
          hidden={true}
          name="password"
          id="password"
          value={process.env.REACT_APP_UTA_PASS}
        />

        <input
          hidden={true}
          name="AMOUNT"
          id="AMOUNT"
          value={this.calculateSubtotal() / 100}
        />
        <input hidden={true} name="INVOICE1" id="INVOICE1" value="0001" />
        <input
          hidden={true}
          name="AMOUNT1"
          id="AMOUNT1"
          value={this.calculateSubtotal() / 100}
        />
        <input hidden={true} name="QTY" id="QTY" value="1" />

        <input
          hidden={true}
          name="redirect"
          id="redirect"
          value={`${
            process.env.REACT_APP_SERVER_DOMAIN
          }/training/acceptutapayment`}
        />

        <FormGenerator
          onMount={this.setForm}
          fieldConfig={this.state.fieldConfig}
        />
        <Col xs={12}>
          <FormGroup bsSize="sm">
            <ControlLabel>Payment Method</ControlLabel>
            <Select
              options={[
                { label: 'Credit Card', value: 2 },
                { label: 'ACH', value: 1 }
              ]}
              classNamePrefix="react-select"
              defaultValue={{ label: 'Credit Card', value: 2 }}
              name="paymenttype"
              className="payment-select"
              components={{ Control: ControlComponent }}
            />
          </FormGroup>
        </Col>
        <Col xs={12} className="cart-totals">
          Subtotal:{' '}
          <NumberFormat
            value={this.calculateSubtotal() / 100}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />
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
    );
  }
}
export default translate('training')(EditQuoteForm);
