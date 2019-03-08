/* 
* EditMeasurementPointListForm 
* Edit measurement point lists
*/

import { Col, Button } from 'react-bootstrap';
import {
  Validators,
  FormGenerator,
  AbstractControl,
  FieldConfig,
  GroupProps
  // Observable
} from 'react-reactive-form';
import { keys, filter } from 'lodash';
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
  toggleEditMeasurementPointListModal,
  toggleEditMeasurementPointModal,
  addGlobalMeasurementPointList,
  setSelectedTabID
} from '../../actions/manageMeasurementPointListsActions';
import EditMeasurementPointModal from './EditMeasurementPointModal';
import { constants } from 'src/constants/constants';
import { initialMeasurementPoint } from 'src/reducers/initialState';
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
  toggleEditMeasurementPointListModal: typeof toggleEditMeasurementPointListModal;
  toggleEditMeasurementPointModal: typeof toggleEditMeasurementPointModal;
  addGlobalMeasurementPointList: typeof addGlobalMeasurementPointList;
  updateGlobalMeasurementPointList: (
    m: ImeasurementPointList,
    l: boolean
  ) => Promise<void>;
  selectedTabID: string;
  selectedTab: ImeasurementPointListTab;
  setSelectedTabID: typeof setSelectedTabID;
}

interface Istate {
  selectedMeasurementPoint: ImeasurementPoint;
  measurementPoints: ImeasurementPoint[];
  fieldConfig: FieldConfig;
}

class EditMeasurementPointListForm extends React.Component<Iprops, Istate> {
  public measurementsForm: AbstractControl;
  private subscription: any;
  constructor(props: Iprops) {
    super(props);
    this.state = {
      selectedMeasurementPoint: initialMeasurementPoint,
      measurementPoints: this.parseMeasurementPoints(),
      fieldConfig: FormUtil.translateForm(this.buildFieldConfig(), this.props.t)
    };
  }
  componentWillMount() {
    const { measurementPointTabs } = this.props.selectedMeasurementPointList;
    this.props.setSelectedTabID(measurementPointTabs[0].id);
    this.setState({ measurementPoints: this.parseMeasurementPoints() });
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

    const tabOptions = FormUtil.convertToOptions(measurementPointTabs);
    const disabled = !this.canEditGlobal();

    let selectedType = null;
    let selectedMainCategory = null;
    let selectedStandard = null;
    let selectedTab = null;
    if (type !== 0) {
      selectedType = {
        label:
          constants.measurementPointTypeEnum[selectedMeasurementPointList.type],
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

    const foundSelectedTab = FormUtil.convertToSingleOption(
      measurementPointTabs.find(tab => tab.id === selectedTabID)
    );
    if (selectedTabID.length && foundSelectedTab) {
      selectedTab = foundSelectedTab;
    } else {
      // select the first one if none are selected
      selectedTab = FormUtil.convertToSingleOption(measurementPointTabs[0]);
    }

    // Field config to configure form
    const fieldConfigControls = {
      type: {
        render: FormUtil.Select,
        meta: {
          options: constants.measurementPointListTypeOptions,
          label: 'manageMeasurementPointLists:type',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:typePlaceholder'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: selectedType,
          disabled
        }
      },
      mainCategoryID: {
        render: FormUtil.Select,
        meta: {
          options: mainCategoryOptions,
          label: 'manageMeasurementPointLists:equipmentType',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:equipmentTypePlaceholder'
        },
        options: {
          validators: [Validators.required]
        },
        formState: {
          value: selectedMainCategory,
          disabled
        }
      },
      standardID: {
        render: FormUtil.Select,
        meta: {
          options: standardOptions,
          label: 'manageMeasurementPointLists:standard',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:standardPlaceholder'
        },
        options: {
          validators: [Validators.required]
        },
        formState: { value: selectedStandard, disabled }
      },
      selectedTab: {
        render: FormUtil.CreatableSelect,
        meta: {
          options: tabOptions,
          label: 'manageMeasurementPointLists:selectTabLabel',
          colWidth: 12,
          placeholder: 'manageMeasurementPointLists:selectTabPlaceholder',
          isMulti: false,
          handleCreate: this.handleCreateTab
        },
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
      id: uuidv4(),
      name,
      order:
        this.props.selectedMeasurementPointList.measurementPointTabs.length + 1,
      measurementPoints: {}
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
        false
      )
      .then(() => {
        this.props.setSelectedTabID(newTab.id);
      });
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
    this.props.updateGlobalMeasurementPointList(mpl, true);
  };

  subscribeToValueChanges = () => {
    this.subscription = this.measurementsForm
      .get('selectedTab')
      .valueChanges.subscribe((value: Ioption | null) => {
        // this.setState({measurementPoints: this.parseMeasurementPoints()})
        if (value && value.value) {
          this.props.setSelectedTabID(value.value);
        }
      });
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
    this.setState({ selectedMeasurementPoint: measurementPoint });
    this.props.toggleEditMeasurementPointModal();
  };

  deleteMeasurementPoint = (measurementPoint: ImeasurementPoint) => {
    const toastrConfirmOptions = {
      onOk: () => {
        // this.props.deleteGlobalMeasurementPoint(
        //   this.props.selectedMeasurementPointList.id,
        //   measurementPoint.id
        // );
        console.log('deleted', measurementPoint);
      },
      onCancel: () => console.log('CANCEL: clicked'),
      okText: this.props.t('deleteMeasurementPointOk'),
      cancelText: this.props.t('common:cancel')
    };
    toastr.confirm(this.props.t('deleteConfirmMP'), toastrConfirmOptions);
  };

  newMeasurementPoint = (type: number): ImeasurementPoint => {
    return {
      ...initialMeasurementPoint,
      id: uuidv4(),
      type,
      order: keys(this.props.selectedTab.measurementPoints).length
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
    this.setState({
      measurementPoints: mps
    });
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
          <Col xs={12} className="" style={{ marginLeft: '-15px' }}>
            <Button
              bsStyle="link"
              type="button"
              className=""
              onClick={() => {
                this.setSelectedMeasurementPoint(
                  this.newMeasurementPoint(
                    constants.measurementPointTypes.GROUP
                  )
                );
              }}
            >
              Add Group
            </Button>
            <Button
              bsStyle="link"
              type="button"
              className=""
              onClick={() => {
                this.setSelectedMeasurementPoint(
                  this.newMeasurementPoint(
                    constants.measurementPointTypes.PROCEDURE
                  )
                );
              }}
            >
              Add Procedure
            </Button>
            <Button
              bsStyle="link"
              type="button"
              className=""
              onClick={() => {
                this.setSelectedMeasurementPoint(
                  this.newMeasurementPoint(
                    constants.measurementPointTypes.MEASUREMENT_POINT_PASSFAIL
                  )
                );
              }}
            >
              Add Question
            </Button>
          </Col>
          <Col xs={12} className="">
            <MeasurementPointList
              measurementPointList={this.state.measurementPoints}
              setSelectedMeasurementPoint={this.setSelectedMeasurementPoint}
              swapMeasurementPointOrder={this.swapMeasurementPointOrder}
              deleteMeasurementPoint={this.deleteMeasurementPoint}
              canEditGlobal={this.canEditGlobal()}
            />
          </Col>

          <Col xs={12} className="form-buttons text-right">
            <Button
              bsStyle="default"
              type="button"
              className="pull-left"
              onClick={this.props.toggleEditMeasurementPointListModal}
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
        <EditMeasurementPointModal
          selectedMeasurementPoint={this.state.selectedMeasurementPoint}
          colorButton={this.props.colorButton}
          t={this.props.t}
        />
      </div>
    );
  }
}
export default translate('manageMeasurementPointLists')(
  EditMeasurementPointListForm
);
