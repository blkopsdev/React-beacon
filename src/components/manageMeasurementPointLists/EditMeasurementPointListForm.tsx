/* 
* EditMeasurementPointListForm 
* Edit measurement point lists
*/

import { Col, Button, Row } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps
} from 'react-reactive-form';
import { filter, keyBy } from 'lodash';
import { toastr } from 'react-redux-toastr';
import { translate, TranslationFunction, I18n } from 'react-i18next';
import * as React from 'react';

import { FormUtil } from '../common/FormUtil';
import {
  ImeasurementPointList,
  ImeasurementPoint,
  Iuser,
  ImeasurementPointListTab,
  IproductInfo,
  Ioption
} from '../../models';
import {
  toggleEditMeasurementPointModal,
  addGlobalMeasurementPointList,
  setSelectedTabID,
  updateMeasurementPoint,
  saveMeasurementPointToMeasurementPointList,
  toggleEditMeasurementPointTabModal,
  setSelectedMeasurementPointList,
  toggleEditMeasurementPointListTestProceduresModal,
  updateMeasurementPointListTab
} from '../../actions/manageMeasurementPointListsActions';
import { constants } from 'src/constants/constants';
import {
  initialMeasurementPoint,
  initialMeasurementPointTab,
  initialMeasurementPointList
} from 'src/reducers/initialState';
import { MeasurementPointList } from './MeasurementPointList';
const uuidv4 = require('uuid/v4');

interface Iprops extends React.Props<EditMeasurementPointListForm> {
  user: Iuser;
  selectedMeasurementPointList: ImeasurementPointList;
  productInfo: IproductInfo;
  loading: boolean;
  colorButton: string;
  t: TranslationFunction;
  i18n: I18n;
  toggleModal: () => void;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addGlobalMeasurementPointList: typeof addGlobalMeasurementPointList;
  updateGlobalMeasurementPointList: (
    mpl: ImeasurementPointList,
    persistToAPI: boolean,
    isCustomer: boolean
  ) => Promise<void>;
  selectedTabID: string;
  selectedTab: ImeasurementPointListTab;
  setSelectedTabID: typeof setSelectedTabID;
  updateMeasurementPoint: typeof updateMeasurementPoint;
  saveMeasurementPointToMeasurementPointList: typeof saveMeasurementPointToMeasurementPointList;
  toggleEditMeasurementPointTabModal: typeof toggleEditMeasurementPointTabModal;
  setSelectedMeasurementPointList: typeof setSelectedMeasurementPointList;
  toggleEditMeasurementPointListTestProceduresModal: typeof toggleEditMeasurementPointListTestProceduresModal;
  customerID: string;
  updateMeasurementPointListTab: typeof updateMeasurementPointListTab;
}

interface Istate {
  measurementPoints: ImeasurementPoint[];
  fieldConfig: FieldConfig;
}

class EditMeasurementPointListForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  private subscription: any;
  // private persistTimeout: any; // all inputs are selects so we don't care about a debounce
  constructor(props: Iprops) {
    super(props);
    this.state = {
      measurementPoints: this.parseMeasurementPoints(),
      fieldConfig: FormUtil.translateForm(this.buildFieldConfig(), this.props.t)
    };
  }
  componentWillMount() {
    const { measurementPointTabs } = this.props.selectedMeasurementPointList;
    if (measurementPointTabs.length) {
      this.props.setSelectedTabID(measurementPointTabs[0].id);
      this.setState({ measurementPoints: this.parseMeasurementPoints() });
    }
  }

  componentDidUpdate(prevProps: Iprops) {
    if (!this.props.selectedMeasurementPointList) {
      console.error('missing selected measurement point');
      return;
    }
    if (
      JSON.stringify(prevProps.selectedTab) !==
      JSON.stringify(this.props.selectedTab)
    ) {
      console.log('selectedTab updated!!!!');
      this.setState({
        measurementPoints: this.parseMeasurementPoints(),
        fieldConfig: FormUtil.translateForm(
          this.buildFieldConfig(),
          this.props.t
        )
      });
    }

    if (
      JSON.stringify(this.props.selectedMeasurementPointList) !==
      JSON.stringify(prevProps.selectedMeasurementPointList)
    ) {
      console.log('selectedMeasurementPointList updated!!!!');
      this.setState({ measurementPoints: this.parseMeasurementPoints() });
    }
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  buildFieldConfig = () => {
    const {
      selectedMeasurementPointList,
      selectedTabID,
      productInfo
    } = this.props;

    const {
      measurementPointTabs,
      type,
      mainCategoryID,
      standardID
    } = selectedMeasurementPointList;

    const {
      mainCategories,
      standards,
      mainCategoryOptions,
      standardOptions
    } = productInfo;

    const tabOptions = FormUtil.convertToOptions(
      measurementPointTabs.filter(tab => tab.isDeleted !== true)
    );
    const disabled = this.props.customerID.length;

    let selectedType = null;
    let selectedMainCategory = null;
    let selectedStandard = null;
    let selectedTab = null;
    if (type !== 0) {
      selectedType = {
        label:
          constants.measurementPointListTypeLookup[
            selectedMeasurementPointList.type
          ],
        value: selectedMeasurementPointList.type
      };
    }
    if (mainCategoryID.length) {
      selectedMainCategory = FormUtil.convertToSingleOption(
        mainCategories[mainCategoryID]
      );
    }
    if (standardID.length) {
      selectedStandard = FormUtil.convertToSingleOption(standards[standardID]);
    }

    const foundSelectedTab = tabOptions.find(
      tab => tab.value === selectedTabID
    );
    if (selectedTabID.length && foundSelectedTab) {
      selectedTab = foundSelectedTab;
    } else {
      // select the first one if none are selected
      selectedTab = tabOptions[0];
    }

    // Field config to configure form
    const fieldConfigControls = {
      mainCategoryID: {
        render: FormUtil.Select,
        meta: {
          options: mainCategoryOptions,
          label: 'manageMeasurementPointLists:equipmentType',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:equipmentTypePlaceholder'
        },
        options: { validators: [Validators.required] },
        formState: { value: selectedMainCategory, disabled }
      },
      type: {
        render: FormUtil.Select,
        meta: {
          options: constants.measurementPointListTypeOptions,
          label: 'manageMeasurementPointLists:type',
          colWidth: 6,
          placeholder: 'manageMeasurementPointLists:typePlaceholder'
        },
        options: { validators: [Validators.required] },
        formState: { value: selectedType, disabled }
      },
      standardID: {
        render: FormUtil.Select,
        meta: {
          options: standardOptions,
          label: 'manageMeasurementPointLists:standard',
          colWidth: 6,
          placeholder: 'manageMeasurementPointLists:standardPlaceholder'
        },
        options: { validators: [Validators.required] },
        formState: { value: selectedStandard, disabled }
      },
      selectedTab: {
        render: this.props.customerID.length
          ? FormUtil.Select
          : FormUtil.CreatableSelectWithButton,
        meta: {
          options: tabOptions,
          label: 'manageMeasurementPointLists:selectTabLabel',
          subLabel: this.props.t(' - Type to Create a Tab'),
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:selectTabPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateTab,
          buttonName: this.props.t('edit'),
          buttonAction: this.props.toggleEditMeasurementPointTabModal
        },
        options: { validators: [Validators.required] },
        formState: { value: selectedTab, disabled: false }
      }
    } as { [key: string]: GroupProps };
    const fieldConfig = {
      controls: { ...fieldConfigControls }
    };
    return fieldConfig as FieldConfig;
  };

  /*
  Handle creating a new tab
  */
  handleCreateTab = (name: string) => {
    const newTab: ImeasurementPointListTab = {
      ...initialMeasurementPointTab,
      id: uuidv4(),
      name,
      order:
        this.props.selectedMeasurementPointList.measurementPointTabs.length + 1
    };

    this.props
      .updateGlobalMeasurementPointList(
        {
          ...this.props.selectedMeasurementPointList,
          measurementPointTabs: [
            ...this.props.selectedMeasurementPointList.measurementPointTabs,
            newTab
          ]
        },
        false,
        false
      )
      .then(() => {
        this.props.setSelectedTabID(newTab.id);
      })
      .catch((error: any) => console.error(error));
  };
  /*
  * Remove deleted measurementPoints and sort them
  */
  parseMeasurementPoints = () => {
    const filteredMPs = filter(
      this.props.selectedTab.measurementPoints,
      mp => mp.isDeleted === false
    );

    filteredMPs.sort((a: ImeasurementPoint, b: ImeasurementPoint) => {
      return a.order - b.order;
    });
    return filteredMPs;
  };

  subscribeToValueChanges = () => {
    const controls = ['selectedTab', 'type', 'mainCategoryID', 'standardID'];
    controls.forEach((key: string) => {
      this.subscription = this.measurementsForm
        .get(key)
        .valueChanges.subscribe((value: Ioption | null) => {
          this.handleValueChange(key, value);
        });
    });
  };

  handleValueChange = (key: string, value: null | Ioption) => {
    // clearTimeout(this.persistTimeout);
    // this.persistTimeout = setTimeout(() => {
    switch (key) {
      case 'selectedTab':
        if (value && value.value) {
          this.props.setSelectedTabID(value.value);
        }
        break;
      default:
        if (value && value.value) {
          this.props
            .updateGlobalMeasurementPointList(
              {
                ...this.props.selectedMeasurementPointList,
                [key]: value.value
              },
              false,
              false
            )
            .catch((error: any) => console.error(error));
        }
        break;
    }
    // }, 200);
  };

  setForm = (form: AbstractControl) => {
    this.measurementsForm = form;
    this.measurementsForm.meta = {
      loading: this.props.loading
    };
    this.subscribeToValueChanges();
  };

  /*
  set a single measurement point
  */
  setSelectedMeasurementPoint = (measurementPoint: ImeasurementPoint) => {
    this.props.updateMeasurementPoint(
      measurementPoint,
      this.props.selectedTabID
    );
    this.props.toggleEditMeasurementPointModal();
  };

  deleteMeasurementPoint = (measurementPoint: ImeasurementPoint) => {
    const toastrConfirmOptions = {
      onOk: () => {
        this.props.saveMeasurementPointToMeasurementPointList(
          this.props.selectedMeasurementPointList.id,
          this.props.selectedTabID,
          { ...measurementPoint, isDeleted: true }
        );
        console.log('deleted', measurementPoint);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteMeasurementPointOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirmMP'), toastrConfirmOptions);
  };

  createNewMeasurementPoint = (type: number): ImeasurementPoint => {
    return {
      ...initialMeasurementPoint,
      id: uuidv4(),
      type,
      order: this.state.measurementPoints.length,
      customerID: this.props.customerID
    };
  };

  swapMeasurementPointOrder = (q1Index: number, q2Index: number) => {
    const mps = this.state.measurementPoints;
    console.log('Swapping ', mps[q1Index].label, mps[q2Index].label);
    const tempOrder = mps[q1Index].order;
    mps[q1Index] = { ...mps[q1Index], order: mps[q2Index].order };
    mps[q2Index] = { ...mps[q2Index], order: tempOrder };
    mps.sort((a: ImeasurementPoint, b: ImeasurementPoint) => {
      return a.order - b.order;
    });
    this.props.updateMeasurementPointListTab({
      ...this.props.selectedTab,
      measurementPoints: keyBy(mps, 'id')
    });
    // set state here just to make it faster (might not be any faster in production)
    this.setState({
      measurementPoints: mps
    });
  };

  validInitialTab = () => {
    if (this.props.selectedTab.id.length) {
      return true;
    } else {
      toastr.warning(
        'Warning',
        'Must add a tab first.',
        constants.toastrWarning
      );
      return false;
    }
  };

  /*
* We will allways have a selectedMeasurmentPointList because either a temporary one was created, or we are editing one that we received from the API.
* we are only updating the mainCategory, standard, and type on this form.
*/
  handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.measurementsForm.status === 'INVALID') {
      this.measurementsForm.markAsSubmitted();
      toastr.error('Please check invalid inputs', '', constants.toastrError);
      return;
    }
    const { type, mainCategoryID, standardID } = this.measurementsForm.value;
    const mpl = {
      ...this.props.selectedMeasurementPointList,
      mainCategoryID: mainCategoryID ? mainCategoryID.value : '',
      standardID: standardID ? standardID.value : '',
      type: type ? type.value : ''
    };
    if (mpl.temporary !== true) {
      this.props
        .updateGlobalMeasurementPointList(
          mpl,
          true,
          this.props.customerID.length > 0
        )
        .catch((error: any) => console.error(error));
    } else {
      this.props.addGlobalMeasurementPointList({ ...mpl, temporary: false });
    }
  };

  handleAddQuestion = () => {
    if (!this.validInitialTab()) {
      return;
    }
    this.setSelectedMeasurementPoint(
      this.createNewMeasurementPoint(
        constants.measurementPointTypes.MEASUREMENT_POINT_PASSFAIL
      )
    );
  };
  handleAddGroup = () => {
    if (!this.validInitialTab()) {
      return;
    }
    this.setSelectedMeasurementPoint(
      this.createNewMeasurementPoint(constants.measurementPointTypes.GROUP)
    );
  };
  handleCancel = () => {
    this.props.toggleModal();
    this.props.setSelectedTabID('');
    this.props.setSelectedMeasurementPointList(initialMeasurementPointList);
  };

  canEditGlobal = () => {
    return constants.hasSecurityFunction(
      this.props.user,
      constants.securityFunctions.ManageAllMeasurementPoints.id
    );
  };
  render() {
    const { t } = this.props;
    const formClassName = `clearfix beacon-form ${this.props.colorButton}`;

    // const isAdmin = constants.hasSecurityFunction(
    //   this.props.user,
    //   constants.securityFunctions.ManageAllMeasurementPoints.id
    // );
    // const adminMps = this.state.measurementPoints.filter(
    //   (mps: ImeasurementPointQuestion) => {
    //     return !mps.customerID && !mps.isDeleted;
    //   }
    // );
    // const customerMps = this.state.measurementPoints.filter(
    //   (mps: ImeasurementPointQuestion) => {
    //     return (
    //       typeof mps.customerID !== 'undefined' &&
    //       mps.customerID === this.props.user.id &&
    //       mps.isDeleted === false
    //     );
    //   }
    // );

    return (
      <div>
        <form onSubmit={this.handleSubmit} className={formClassName}>
          <FormGenerator
            onMount={this.setForm}
            fieldConfig={this.state.fieldConfig}
          />
          <Row>
            <Col xs={12}>
              <Button
                bsStyle="link"
                type="button"
                className=""
                onClick={
                  this.props.toggleEditMeasurementPointListTestProceduresModal
                }
              >
                {t('editProcedureButton')}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="">
              <Button
                bsStyle="link"
                type="button"
                className=""
                onClick={this.handleAddGroup}
              >
                Add Group
              </Button>

              <Button
                bsStyle="link"
                type="button"
                className=""
                onClick={this.handleAddQuestion}
              >
                Add Question
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="">
              <MeasurementPointList
                measurementPointList={this.state.measurementPoints}
                setSelectedMeasurementPoint={this.setSelectedMeasurementPoint}
                swapMeasurementPointOrder={this.swapMeasurementPointOrder}
                deleteMeasurementPoint={this.deleteMeasurementPoint}
                canEditGlobal={this.canEditGlobal()}
              />
            </Col>
          </Row>

          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.handleCancel}
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
    );
  }
}
export default translate('manageMeasurementPointLists')(
  EditMeasurementPointListForm
);
