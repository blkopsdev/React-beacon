/* 
* Manage Install Form 
* Edit Install items
*/

import { Col, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  Observable,
  GroupProps
} from 'react-reactive-form';
import { find } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  IinstallBase,
  Iproduct,
  ItableFiltersReducer,
  Ifacility,
  Ibuilding,
  Ifloor,
  Ilocation,
  Iuser,
  Ioption
} from '../../models';
import {
  saveInstall,
  toggleEditInstallModal,
  updateInstall
} from '../../actions/manageInventoryActions';
import { saveAnyLocation } from '../../actions/manageLocationActions';
import constants from '../../constants/constants';
const uuidv4 = require('uuid/v4');

interface IstateChanges extends Observable<any> {
  next: () => void;
}
interface AbstractControlEdited extends AbstractControl {
  stateChanges: IstateChanges;
}

interface Iprops {
  updateInstall: typeof updateInstall;
  saveInstall: typeof saveInstall;
  toggleEditInstallModal: typeof toggleEditInstallModal;
  selectedItem: IinstallBase;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  tableFilters: ItableFiltersReducer;
  selectedProduct: Iproduct;
  facility: Ifacility;
  deleteInstall: (id: string, prodID: string) => void;
  saveAnyLocation: typeof saveAnyLocation;
  user: Iuser;
}

interface Istate {
  newType: string;
  newItem: any;
}

class ManageInstallForm extends React.Component<Iprops, Istate> {
  public userForm: AbstractControl;
  private subscription: any;
  private fieldConfig: FieldConfig;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      newType: '',
      newItem: {}
    };
    this.fieldConfig = FormUtil.translateForm(
      this.buildFieldConfig(),
      this.props.t
    );
  }
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
  }

  componentDidUpdate(prevProps: Iprops) {
    if (prevProps.facility !== this.props.facility) {
      if (this.state.newType.length) {
        const control = this.userForm.get(
          this.state.newType
        ) as AbstractControlEdited;
        const newOption = {
          value: this.state.newItem.id,
          label: this.state.newItem.name
        };
        control.meta.options = [...control.meta.options, newOption];
        control.stateChanges.next();
        this.userForm.patchValue({ [this.state.newType]: newOption });
        this.setState({ newType: '' });
      }
    }
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  buildFieldConfig = () => {
    const disabled = this.canEditInstalls() === false;
    const shouldRequireQuantity =
      disabled === false &&
      this.props.selectedItem &&
      this.props.selectedItem.id
        ? false
        : true;

    const buildings = FormUtil.convertToOptions(this.props.facility.buildings);
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
        meta: { label: 'productInfo', colWidth: 12, name: 'product-info' }
      },
      nickname: {
        render: FormUtil.TextInput,
        meta: {
          label: 'nickname',
          colWidth: 12,
          type: 'input',
          name: 'nickname',
          disabled,
          required: false
        }
      },
      serialNumber: {
        render: FormUtil.TextInput,
        meta: {
          label: 'serialNumber',
          colWidth: 6,
          type: 'input',
          name: 'serial-number',
          disabled,
          required: false
        }
      },
      rfid: {
        render: FormUtil.TextInput,
        meta: {
          label: 'rfid',
          colWidth: 6,
          type: 'input',
          name: 'rfid',
          disabled,
          required: false
        }
      },
      remarks: {
        render: FormUtil.TextInput,
        meta: {
          label: 'remarks',
          colWidth: 12,
          componentClass: 'textarea',
          name: 'remarks',
          disabled,
          required: false
        }
      },
      quantity: {
        options: {
          validators: quantityValidators
        },
        render: FormUtil.TextInput,
        inputType: 'number',
        meta: {
          label: 'quantity',
          colWidth: 6,
          type: 'number',
          defaultValue: 1,
          name: 'quantity',
          disabled
        }
      },
      locLabel: {
        render: FormUtil.TextLabel,
        meta: { label: 'locationLabel', colWidth: 12, name: 'location-label' }
      },
      buildingID: {
        render: FormUtil.CreatableSelect,
        meta: {
          options: buildings,
          label: 'building',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateBuilding,
          name: 'building',
          disabled
        },
        options: {
          validators: [
            Validators.required,
            (c: any) => {
              if (c.value && c.value.value) {
                this.filterFloors(c.value.value);
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
          handleCreate: this.handleCreateFloor,
          name: 'floor',
          disabled
        },
        options: {
          validators: [
            Validators.required,
            (c: any) => {
              if (c.value && c.value.value) {
                this.filterLocations(c.value.value);
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
          handleCreate: this.handleCreateLocation,
          name: 'location',
          disabled
        },
        options: {
          validators: [
            Validators.required,
            (c: any) => {
              if (c.value && c.value.value) {
                this.filterRooms(c.value.value);
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
          handleCreate: this.handleCreateRoom,
          name: 'room',
          disabled,
          required: false
        }
      },
      position: {
        render: FormUtil.TextInput,
        meta: {
          label: 'position',
          colWidth: 12,
          name: 'position',
          disabled,
          required: false
        }
      }
    };
    return {
      controls: { ...fieldConfigControls }
    };
  };

  handleCreateBuilding = (name: string) => {
    const newBuilding = {
      id: uuidv4(),
      name,
      facilityID: this.props.facility.id,
      floors: []
    };
    this.setState({ newItem: newBuilding, newType: 'Building' });
    this.props.saveAnyLocation(newBuilding, 'Building', this.props.facility.id);
  };

  handleCreateFloor = (name: string) => {
    const { buildingID } = this.userForm.value;
    if (!buildingID) {
      toastr.error(
        'Please select a building first.',
        '',
        constants.toastrError
      );
      return;
    }
    const newFloor = {
      id: uuidv4(),
      name,
      buildingID: buildingID.value,
      locations: []
    };
    this.setState({ newItem: newFloor, newType: 'Floor' });
    this.props.saveAnyLocation(newFloor, 'Floor', this.props.facility.id);
  };
  handleCreateLocation = (name: string) => {
    const { buildingID, floorID } = this.userForm.value;
    if (!buildingID || !floorID) {
      toastr.error(
        'Please select a building and a floor first.',
        '',
        constants.toastrError
      );
      return;
    }
    const newLocation = {
      id: uuidv4(),
      name,
      buildingID: buildingID.value,
      floorID: floorID.value,
      rooms: []
    };
    this.setState({ newItem: newLocation, newType: 'Location' });
    this.props.saveAnyLocation(newLocation, 'Location', this.props.facility.id);
  };
  handleCreateRoom = (name: string) => {
    const { buildingID, floorID, locationID } = this.userForm.value;
    if (!buildingID || !floorID || !locationID) {
      toastr.error(
        'Please select a building, floor, and location first.',
        '',
        constants.toastrError
      );
      return;
    }
    const newRoom = {
      id: uuidv4(),
      name,
      buildingID: buildingID.value,
      floorID: floorID.value,
      locationID: locationID.value
    };
    this.setState({ newItem: newRoom, newType: 'Room' });
    this.props.saveAnyLocation(newRoom, 'Room', this.props.facility.id);
  };

  filterFloors = (buildingID: string) => {
    if (buildingID) {
      console.log('Filtering by building id:', buildingID);
      const building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID;
      });
      let newFloorOptions: any[] = [];

      if (building) {
        newFloorOptions = FormUtil.convertToOptions(building.floors);
      }
      const floorControl = this.userForm.get(
        'floorID'
      ) as AbstractControlEdited;
      floorControl.meta.options = newFloorOptions;
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
          this.userForm.patchValue({ floorID: null });
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
      locationControl.stateChanges.next();
      this.userForm.patchValue({ locationID: null });
      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = [];
      this.userForm.patchValue({ roomID: null });
      roomControl.stateChanges.next();
    }
  };
  filterLocations = (floorID: string) => {
    const { buildingID } = this.userForm.value;
    // const buildingID = this.userForm.value.buildingID.value;
    if (buildingID && floorID) {
      console.info('Filtering by building & floor:', buildingID, floorID);
      const building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID.value;
      });
      let newLocationOptions: any[] = [];

      if (building) {
        const floor = find(building.floors, (f: Ifloor) => {
          return f.id === floorID;
        });
        if (floor) {
          newLocationOptions = FormUtil.convertToOptions(floor.locations);
        }
      }

      const locationControl = this.userForm.get(
        'locationID'
      ) as AbstractControlEdited;
      locationControl.meta.options = newLocationOptions;
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
          this.userForm.patchValue({ locationID: null });
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
    const { buildingID, floorID } = this.userForm.value;
    if (buildingID && floorID && locationID) {
      console.info(
        'Filtering by building & floor & location:',
        buildingID,
        floorID,
        locationID
      );
      const building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID.value;
      });
      let newRoomOptions: any[] = [];

      if (building) {
        const floor = find(building.floors, (f: Ifloor) => {
          return f.id === floorID.value;
        });
        if (floor) {
          const loc = find(floor.locations, (l: Ilocation) => {
            return l.id === locationID;
          });
          if (loc) {
            newRoomOptions = FormUtil.convertToOptions(loc.rooms);
          }
        }
      }

      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = newRoomOptions;
      roomControl.stateChanges.next();
      if (this.props.selectedItem) {
        const selectedRoom = find(roomControl.meta.options, {
          value: this.props.selectedItem.roomID
        }) || { value: '' };
        if (selectedRoom.value.length) {
          this.userForm.patchValue({ roomID: selectedRoom });
        }
      } else {
        this.userForm.patchValue({ roomID: null });
      }
    }
  };

  subscribeToValueChanges = () => {
    this.subscription = this.userForm
      .get('buildingID')
      .valueChanges.subscribe((value: Ioption | null) => {
        if (value !== null) {
          this.filterFloors(value.value);
        }
      });
    this.subscription = this.userForm
      .get('floorID')
      .valueChanges.subscribe((value: Ioption | null) => {
        if (value !== null) {
          this.filterLocations(value.value);
        }
      });
    this.subscription = this.userForm
      .get('locationID')
      .valueChanges.subscribe((value: Ioption | null) => {
        if (value !== null) {
          this.filterRooms(value.value);
        }
      });
  };
  buildFieldConfig = () => {
    const disabled = this.canEditInstalls() === false;
    const {
      nickname,
      serialNumber,
      rfid,
      remarks,
      quantity,
      buildingID,
      floorID,
      locationID,
      roomID,
      id,
      position
    } = this.props.selectedItem;
    const shouldRequireQuantity =
      disabled === false && this.props.selectedItem && id ? false : true;
    let selectedBuilding = null;
    let selectedFloor = null;
    let selectedLocation = null;
    let selectedRoom = null;

    if (buildingID) {
      selectedBuilding = find(this.props.facility.buildings, {
        id: buildingID
      }) as Ibuilding;
      if (selectedBuilding) {
        selectedFloor = find(selectedBuilding.floors, {
          id: floorID
        });
        if (selectedFloor) {
          selectedLocation = find(selectedFloor.locations, {
            id: locationID
          });
          if (selectedLocation) {
            selectedRoom = find(selectedLocation.rooms, { id: roomID });
          }
        }
      }
    }
    let quantityValidators = [Validators.min(1), Validators.max(1000)];
    if (shouldRequireQuantity) {
      quantityValidators = [
        Validators.min(1),
        Validators.max(1000),
        Validators.required
      ];
    }

    const fieldConfigControls = {
      $field_0: {
        render: () => (
          <Col xs={12} key="productInfo">
            <FormGroup bsSize="sm">
              <ControlLabel>{this.props.t('productInfo')}</ControlLabel>
              <h5 className="queue-form-label">
                {this.props.selectedProduct.name}
              </h5>
            </FormGroup>
          </Col>
        )
      },
      nickname: {
        render: FormUtil.TextInput,
        meta: {
          label: 'nickname',
          colWidth: 12,
          type: 'input',
          name: 'nickname',
          required: false
        },
        formState: { value: nickname, disabled }
      },
      serialNumber: {
        render: FormUtil.TextInput,
        meta: {
          label: 'serialNumber',
          colWidth: 6,
          type: 'input',
          name: 'serial-number',
          required: false
        },
        formState: { value: serialNumber, disabled }
      },
      rfid: {
        render: FormUtil.TextInput,
        meta: {
          label: 'rfid',
          colWidth: 6,
          type: 'input',
          name: 'rfid',
          required: false
        },
        formState: { value: rfid, disabled }
      },
      remarks: {
        render: FormUtil.TextInput,
        meta: {
          label: 'remarks',
          colWidth: 12,
          componentClass: 'textarea',
          name: 'remarks',
          required: false
        },
        formState: { value: remarks, disabled }
      },
      quantity: {
        options: {
          validators: quantityValidators
        },
        render: FormUtil.TextInput,
        inputType: 'number',
        meta: {
          label: 'quantity',
          colWidth: 6,
          type: 'number',
          defaultValue: 1,
          name: 'quantity'
        },
        formState: { value: quantity || 1, disabled }
      },
      locLabel: {
        render: FormUtil.TextLabel,
        meta: { label: 'locationLabel', colWidth: 12, name: 'location-label' }
      },
      buildingID: {
        render: FormUtil.CreatableSelect,
        meta: {
          options: FormUtil.convertToOptions(this.props.facility.buildings),
          label: 'building',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateBuilding,
          name: 'building'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedBuilding),
          disabled
        }
      },
      floorID: {
        render: FormUtil.CreatableSelect,
        meta: {
          options: selectedBuilding
            ? FormUtil.convertToOptions(selectedBuilding.floors)
            : [],
          label: 'floor',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateFloor,
          name: 'floor'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedFloor),
          disabled
        }
      },
      locationID: {
        render: FormUtil.CreatableSelect,
        meta: {
          options: selectedFloor
            ? FormUtil.convertToOptions(selectedFloor.locations)
            : [],
          label: 'location',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateLocation,
          name: 'location'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedLocation),
          disabled
        }
      },
      roomID: {
        render: FormUtil.CreatableSelect,
        meta: {
          options: selectedLocation
            ? FormUtil.convertToOptions(selectedLocation.rooms)
            : [],
          label: 'room',
          colWidth: 12,
          placeholder: 'common:searchPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateRoom,
          name: 'room',
          required: false
        },
        formState: {
          value: FormUtil.convertToSingleOption(selectedRoom),
          disabled
        }
      },
      position: {
        render: FormUtil.TextInput,
        meta: {
          label: 'position',
          colWidth: 12,
          name: 'position',
          required: false
        },
        formState: { value: position, disabled }
      }
    } as { [key: string]: GroupProps };
    return {
      controls: { ...fieldConfigControls }
    };
  };

  handleCreateBuilding = (name: string) => {
    const newBuilding = {
      id: uuidv4(),
      name,
      facilityID: this.props.facility.id,
      floors: []
    };
    this.setState({ newItem: newBuilding, newType: 'buildingID' });
    this.props.saveAnyLocation(newBuilding, 'Building', this.props.facility.id);
  };

  handleCreateFloor = (name: string) => {
    const { buildingID } = this.userForm.value;
    if (!buildingID) {
      toastr.error(
        'Please select a building first.',
        '',
        constants.toastrError
      );
      return;
    }
    const newFloor = {
      id: uuidv4(),
      name,
      buildingID: buildingID.value,
      locations: []
    };
    this.setState({ newItem: newFloor, newType: 'floorID' });
    this.props.saveAnyLocation(newFloor, 'Floor', this.props.facility.id);
  };
  handleCreateLocation = (name: string) => {
    const { buildingID, floorID } = this.userForm.value;
    if (!buildingID || !floorID) {
      toastr.error(
        'Please select a building and a floor first.',
        '',
        constants.toastrError
      );
      return;
    }
    const newLocation = {
      id: uuidv4(),
      name,
      buildingID: buildingID.value,
      floorID: floorID.value,
      rooms: []
    };
    this.setState({ newItem: newLocation, newType: 'locationID' });
    this.props.saveAnyLocation(newLocation, 'Location', this.props.facility.id);
  };
  handleCreateRoom = (name: string) => {
    const { buildingID, floorID, locationID } = this.userForm.value;
    if (!buildingID || !floorID || !locationID) {
      toastr.error(
        'Please select a building, floor, and location first.',
        '',
        constants.toastrError
      );
      return;
    }
    const newRoom = {
      id: uuidv4(),
      name,
      buildingID: buildingID.value,
      floorID: floorID.value,
      locationID: locationID.value
    };
    this.setState({ newItem: newRoom, newType: 'roomID' });
    this.props.saveAnyLocation(newRoom, 'Room', this.props.facility.id);
  };

  filterFloors = (buildingID: string) => {
    if (buildingID) {
      console.log('Filtering by building id:', buildingID);
      const building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID;
      });
      let newFloorOptions: any[] = [];

      if (building) {
        newFloorOptions = FormUtil.convertToOptions(building.floors);
      }
      const floorControl = this.userForm.get(
        'floorID'
      ) as AbstractControlEdited;
      floorControl.meta.options = newFloorOptions;
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
          this.userForm.patchValue({ floorID: null });
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
      locationControl.stateChanges.next();
      this.userForm.patchValue({ locationID: null });
      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = [];
      this.userForm.patchValue({ roomID: null });
      roomControl.stateChanges.next();
    }
  };
  filterLocations = (floorID: string) => {
    const { buildingID } = this.userForm.value;
    // const buildingID = this.userForm.value.buildingID.value;
    if (buildingID && floorID) {
      console.info('Filtering by building & floor:', buildingID, floorID);
      const building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID.value;
      });
      let newLocationOptions: any[] = [];

      if (building) {
        const floor = find(building.floors, (f: Ifloor) => {
          return f.id === floorID;
        });
        if (floor) {
          newLocationOptions = FormUtil.convertToOptions(floor.locations);
        }
      }

      const locationControl = this.userForm.get(
        'locationID'
      ) as AbstractControlEdited;
      locationControl.meta.options = newLocationOptions;
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
          this.userForm.patchValue({ locationID: null });
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
    const { buildingID, floorID } = this.userForm.value;
    if (buildingID && floorID && locationID) {
      console.info(
        'Filtering by building & floor & location:',
        buildingID,
        floorID,
        locationID
      );
      const building = find(this.props.facility.buildings, (b: Ibuilding) => {
        return b.id === buildingID.value;
      });
      let newRoomOptions: any[] = [];

      if (building) {
        const floor = find(building.floors, (f: Ifloor) => {
          return f.id === floorID.value;
        });
        if (floor) {
          const loc = find(floor.locations, (l: Ilocation) => {
            return l.id === locationID;
          });
          if (loc) {
            newRoomOptions = FormUtil.convertToOptions(loc.rooms);
          }
        }
      }

      const roomControl = this.userForm.get('roomID') as AbstractControlEdited;
      roomControl.meta.options = newRoomOptions;
      roomControl.stateChanges.next();
      if (this.props.selectedItem) {
        const selectedRoom = find(roomControl.meta.options, {
          value: this.props.selectedItem.roomID
        }) || { value: '' };
        if (selectedRoom.value.length) {
          this.userForm.patchValue({ roomID: selectedRoom });
        } else {
          this.userForm.patchValue({ roomID: null });
        }
      } else {
        this.userForm.patchValue({ roomID: null });
      }
    }
  };

  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    console.log('install form valuess: ', this.userForm);
    e.preventDefault();
    if (this.userForm.status === 'INVALID') {
      this.userForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    console.log(this.userForm.value);
    if (this.props.tableFilters.facility) {
      const { buildingID, floorID, locationID, roomID } = this.userForm.value;
      let newItem = {
        ...this.userForm.value,
        facilityID: this.props.tableFilters.facility.value,
        productID: this.props.selectedProduct.id,
        buildingID: buildingID.value,
        floorID: floorID.value,
        locationID: locationID.value,
        roomID: roomID ? roomID.value : '' // since this is not required, it might be null
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
    if (!form) {
      console.error('missing form for setForm');
      return;
    }
    this.userForm = form;
    this.userForm.meta = {
      loading: this.props.loading
    };
    this.subscribeToValueChanges();
  };
  canEditInstalls = () => {
    return constants.hasSecurityFunction(
      this.props.user,
      constants.securityFunctions.ManageInventory.id
    );
  };
  canEditInstalls = () => {
    return constants.hasSecurityFunction(
      this.props.user,
      constants.securityFunctions.ManageInventory.id
    );
  };

  render() {
    const { t } = this.props;

    const deleteButtonStyle =
      this.props.selectedItem.id === undefined
        ? { marginRight: '15px', display: 'none' }
        : { marginRight: '15px' };
    return (
      <div className={this.props.colorButton}>
        <form onSubmit={this.handleSubmit} className="clearfix beacon-form">
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
            {this.canEditInstalls() && (
              <div>
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
              </div>
            )}
          </Col>
        </form>
      </div>
    );
  }
}
export default translate('manageInventory')(ManageInstallForm);
