/* 
* Manage Install Form 
* Edit Install items
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable
} from 'react-reactive-form';
import { forEach, find } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  IinstallBase,
  Ioption,
  Iproduct,
  ItableFiltersReducer,
  Ifacility,
  Ibuilding,
  Ifloor,
  Ilocation
} from '../../models';
import {
  saveInstall,
  toggleEditInstallModal,
  updateInstall
} from '../../actions/manageInventoryActions';
import { saveAnyLocation } from '../../actions/manageLocationActions';
import constants from '../../constants/constants';
import { initialLoc } from 'src/reducers/initialState';

const uuidv4 = require('uuid/v4');

interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

const buildFieldConfig = (
  shouldRequireQuantity: boolean,
  buildings: Ioption[],
  handleCreate: (name: string) => void,
  filterFloors: (id: string) => void,
  filterLocations: (id: string) => void,
  filterRooms: (id: string) => void
) => {
  let quantityValidators = [Validators.min(1), Validators.max(1000)];
  if (shouldRequireQuantity) {
    quantityValidators = [
      Validators.min(1),
      Validators.max(1000),
      Validators.required
    ];
  }
  const fieldConfigControls = {
    productInfo: {
      render: FormUtil.TextLabel,
      meta: { label: 'productInfo', colWidth: 12 }
    },
    nickname: {
      render: FormUtil.TextInput,
      meta: { label: 'nickname', colWidth: 12, type: 'input' }
    },
    serialNumber: {
      render: FormUtil.TextInput,
      meta: { label: 'serialNumber', colWidth: 6, type: 'input' }
    },
    rfid: {
      render: FormUtil.TextInput,
      meta: { label: 'rfid', colWidth: 6, type: 'input' }
    },
    remarks: {
      render: FormUtil.TextInput,
      meta: { label: 'remarks', colWidth: 12, componentClass: 'textarea' }
    },
    quantity: {
      options: {
        validators: quantityValidators
      },
      render: FormUtil.TextInput,
      inputType: 'number',
      meta: { label: 'quantity', colWidth: 6, type: 'number', defaultValue: 1 }
    },
    locLabel: {
      render: FormUtil.TextLabel,
      meta: { label: 'locationLabel', colWidth: 12 }
    },
    buildingID: {
      render: FormUtil.CreatableSelect,
      meta: {
        options: buildings,
        label: 'building',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false,
        handleCreate
      },
      options: {
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              filterFloors(c.value.value);
            }
          }
        ]
      }
    },
    floorID: {
      render: FormUtil.CreatableSelect,
      meta: {
        label: 'floor',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false,
        handleCreate
      },
      options: {
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              filterLocations(c.value.value);
            }
          }
        ]
      }
    },
    locationID: {
      render: FormUtil.CreatableSelect,
      meta: {
        label: 'location',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false,
        handleCreate
      },
      options: {
        validators: [
          Validators.required,
          (c: any) => {
            if (c.value && c.value.value) {
              filterRooms(c.value.value);
            }
          }
        ]
      }
    },
    roomID: {
      render: FormUtil.CreatableSelect,
      meta: {
        label: 'room',
        colWidth: 12,
        placeholder: 'common:searchPlaceholder',
        isMulti: false,
        handleCreate
      },
      options: {
        validators: Validators.required
      }
    },
    position: {
      render: FormUtil.TextInput,
      meta: {
        label: 'position',
        colWidth: 12
      }
    }
  };
  return {
    controls: { ...fieldConfigControls }
  };
};

interface Iprops {
  updateInstall: typeof updateInstall;
  saveInstall: typeof saveInstall;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  selectedItem: IinstallBase;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  facilityOptions: Ioption[];
  tableFilters: ItableFiltersReducer;
  selectedProduct: Iproduct;
  facility: Ifacility;
  deleteInstall: (id: string, prodID: string) => void;
  saveAnyLocation: typeof saveAnyLocation;
}

interface Istate {
  newType: string;
  newItem: any;
}

class ManageInstallForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  public fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.fieldConfig = FormUtil.translateForm(
      buildFieldConfig(
        !!(this.props.selectedItem && this.props.selectedItem.id),
        FormUtil.convertToOptions(this.props.facility.buildings),
        this.handleCreate,
        this.filterFloors,
        this.filterLocations,
        this.filterRooms
      ),
      this.props.t
    );
    this.state = {
      newType: '',
      newItem: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
  }
  // componentDidUpdate(prevProps: Iprops) {}

  componentDidMount() {
    if (!this.props.selectedProduct.id) {
      console.error('missing product');
      toastr.error(
        'Error',
        'Missing product, please try again or contact support.',
        constants.toastrError
      );
      this.props.toggleEditInstallModal();
    }
    this.userForm.patchValue({ productInfo: this.props.selectedProduct.name });
    if (
      !this.props.selectedItem ||
      (this.props.selectedItem && !this.props.selectedItem.id)
    ) {
      console.log('adding a new install');
      this.userForm.patchValue({ quantity: 1 });
    } else {
      // set values
      forEach(this.props.selectedItem, (value, key) => {
        this.userForm.patchValue({ [key]: value });
      });
      // we don't use quantity on existing products, but we need to pass validation
      this.userForm.patchValue({ quantity: 1 });
      const quantityControl = this.userForm.get('quantity');
      quantityControl.meta = {
        ...quantityControl.meta,
        style: { display: 'none' }
      };
    }
  }

  componentDidUpdate(prevProps: Iprops) {
    if (prevProps.facility !== this.props.facility) {
      // console.log('DATA CHANGED');
      const itemID = `${this.state.newType.toLowerCase()}ID`;
      const control = this.userForm.get(itemID) as AbstractControlEdited;
      const selectedItem = {
        value: this.state.newItem.id,
        label: this.state.newItem.name
      };
      control.meta.options.push(selectedItem);
      if (this.state.newType === 'Building') {
        this.userForm.patchValue({ buildingID: selectedItem });
      } else if (this.state.newType === 'Floor') {
        this.userForm.patchValue({ floorID: selectedItem });
      } else if (this.state.newType === 'Location') {
        this.userForm.patchValue({ locationID: selectedItem });
      } else if (this.state.newType === 'Room') {
        this.userForm.patchValue({ roomID: selectedItem });
      }
    }
  }

  handleCreate = (name: string) => {
    // creating a new location
    // determine type
    let lType = 'Building';
    if (this.userForm.value.locationID) {
      lType = 'Room';
    } else if (this.userForm.value.floorID) {
      lType = 'Location';
    } else if (this.userForm.value.buildingID) {
      lType = 'Floor';
    }
    console.info('Creating new location: ', lType, name);
    // lets give it a uuid!
    let newItem: any = {
      name,
      id: uuidv4()
    };
    if (lType === 'Building') {
      newItem = {
        ...newItem,
        facilityID: this.props.facility.id,
        floors: []
      };
    } else if (lType === 'Floor') {
      newItem = {
        ...newItem,
        buildingID: this.userForm.value.buildingID.value,
        locations: []
      };
    } else if (lType === 'Location') {
      newItem = {
        ...newItem,
        buildingID: this.userForm.value.buildingID.value,
        floorID: this.userForm.value.floorID.value,
        rooms: []
      };
    } else {
      newItem = {
        ...newItem,
        buildingID: this.userForm.value.buildingID.value,
        floorID: this.userForm.value.floorID.value,
        locationID: this.userForm.value.locationID.value
      };
    }
    this.setState({ newItem, newType: lType });
    this.props.saveAnyLocation(newItem, lType);
  };

  filterFloors = (buildingID: string) => {
    if (buildingID) {
      console.log('Filtering by building id:', buildingID);
      let building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID;
      });
      if (!building) {
        building = initialLoc;
      }
      const floorControl = this.userForm.get(
        'floorID'
      ) as AbstractControlEdited;
      floorControl.meta.options = FormUtil.convertToOptions(building.floors);
      floorControl.stateChanges.next();
      if (this.props.selectedItem) {
        const selectedFloor = find(floorControl.meta.options, {
          value: this.props.selectedItem.floorID
        }) || { value: '' };
        if (!selectedFloor.value.length) {
          floorControl.markAsDirty();
          floorControl.setErrors({
            required: { required: { message: 'this is required' } }
          });
        } else {
          this.userForm.patchValue({ floorID: selectedFloor });
        }
      } else {
        this.userForm.patchValue({ floorID: null });
      }
      // Reset other selects
      const locationControl = this.userForm.get(
        'locationID'
      ) as AbstractControlEdited;
      locationControl.meta.options = [];
      this.userForm.patchValue({ locationID: null });
      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = [];
      this.userForm.patchValue({ roomID: null });
    }
  };
  filterLocations = (floorID: string) => {
    const buildingID = this.userForm.value.buildingID.value;
    if (buildingID && floorID) {
      console.info('Filtering by building & floor:', buildingID, floorID);
      let building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID;
      });
      if (!building) {
        building = initialLoc;
      }
      let floor = find(building.floors, (f: Ifloor) => {
        return f.id === floorID;
      });
      if (!floor) {
        floor = initialLoc;
      }

      const locationControl = this.userForm.get(
        'locationID'
      ) as AbstractControlEdited;
      locationControl.meta.options = FormUtil.convertToOptions(floor.locations);
      locationControl.stateChanges.next();
      if (this.props.selectedItem) {
        const selectedLoc = find(locationControl.meta.options, {
          value: this.props.selectedItem.locationID
        }) || { value: '' };
        if (!selectedLoc.value.length) {
          locationControl.markAsDirty();
          locationControl.setErrors({
            required: { required: { message: 'this is required' } }
          });
        } else {
          this.userForm.patchValue({ locationID: selectedLoc });
        }
      } else {
        this.userForm.patchValue({ locationID: null });
      }
      // Reset other selects
      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = [];
      this.userForm.patchValue({ roomID: null });
    }
  };
  filterRooms = (locationID: string) => {
    const buildingID = this.userForm.value.buildingID.value;
    const floorID = this.userForm.value.floorID.value;
    if (buildingID && floorID && locationID) {
      console.info(
        'Filtering by building & floor & location:',
        buildingID,
        floorID,
        locationID
      );
      let building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID;
      });
      if (!building) {
        building = initialLoc;
      }
      let floor = find(building.floors, (f: Ifloor) => {
        return f.id === floorID;
      });
      if (!floor) {
        floor = initialLoc;
      }
      let loc = find(floor.locations, (l: Ilocation) => {
        return l.id === locationID;
      });
      if (!loc) {
        loc = initialLoc;
      }

      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = FormUtil.convertToOptions(loc.rooms);
      roomControl.stateChanges.next();
      if (this.props.selectedItem) {
        const selectedRoom = find(roomControl.meta.options, {
          value: this.props.selectedItem.roomID
        }) || { value: '' };
        if (!selectedRoom.value.length) {
          roomControl.markAsDirty();
          roomControl.setErrors({
            required: { required: { message: 'this is required' } }
          });
        } else {
          this.userForm.patchValue({ roomID: selectedRoom });
        }
      } else {
        this.userForm.patchValue({ roomID: null });
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
    if (this.props.tableFilters.facility) {
      let newItem = {
        ...this.userForm.value,
        facilityID: this.props.tableFilters.facility.value,
        productID: this.props.selectedProduct.id,
        buildingID: this.userForm.value.buildingID.value,
        floorID: this.userForm.value.floorID.value,
        locationID: this.userForm.value.locationID.value,
        roomID: this.userForm.value.roomID.value
      };

      if (this.props.selectedItem && this.props.selectedItem.id) {
        newItem = { ...newItem, id: this.props.selectedItem.id };
        this.props.updateInstall(newItem, this.props.selectedProduct.id);
      } else {
        this.props.saveInstall(newItem, this.props.selectedProduct.id);
      }
    } else {
      console.error('missing facility, unable to save install');
      toastr.error(
        'Error',
        'Missing facility, please try again or contact support',
        constants.toastrError
      );
    }
  };
  handleDelete = () => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.deleteInstall(
          this.props.selectedItem.id,
          this.props.selectedProduct.id
        );
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('installDeleteOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('installDeleteConfirm'), toastrConfirmOptions);
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
    const deleteButtonStyle =
      this.props.selectedItem.id === undefined
        ? { marginRight: '15px', display: 'none' }
        : { marginRight: '15px' };
    return (
      <div>
        <div className={formClassName}>
          <form
            onSubmit={this.handleSubmit}
            className="clearfix beacon-form user-form"
          >
            <FormGenerator
              onMount={this.setForm}
              fieldConfig={this.fieldConfig}
            />
            <Col xs={12} className="form-buttons text-right">
              <Button
                bsStyle="default"
                type="button"
                className="pull-left"
                onClick={this.props.toggleEditInstallModal}
              >
                {t('common:cancel')}
              </Button>
              <Button
                bsStyle="warning"
                style={deleteButtonStyle}
                type="button"
                className=""
                disabled={this.props.loading}
                onClick={this.handleDelete}
              >
                {t('common:delete')}
              </Button>
              <Button
                bsStyle={this.props.colorButton}
                type="submit"
                disabled={this.props.loading}
              >
                {t('common:save')}
              </Button>
            </Col>
          </form>
        </div>
      </div>
    );
  }
}
export default translate('manageInventory')(ManageInstallForm);
