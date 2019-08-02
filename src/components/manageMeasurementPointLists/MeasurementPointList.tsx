import * as React from 'react';
import { ImeasurementPoint, ImeasurementPointListTab } from '../../models';
import { ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import { constants } from '../../constants/constants';
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, keyBy } from 'lodash';
import { updateMeasurementPointListTab } from '../../actions/manageMeasurementPointListsActions';

const DragHandle = SortableHandle(() => (
  <span>
    <FontAwesomeIcon icon={['far', 'bars']} size="lg" />
  </span>
));
/*
* List the Measurement Points
*/

const SortableItem = SortableElement(
  ({
    mp,
    disabled,
    setSelectedMeasurementPoint
  }: {
    mp: ImeasurementPoint;
    disabled: boolean;
    setSelectedMeasurementPoint: (mp: ImeasurementPoint) => void;
  }) => {
    return (
      <div className="question-list-item">
        <ListGroupItem
          onClick={() => {
            setSelectedMeasurementPoint(mp);
          }}
          key={mp.id}
          disabled={disabled}
        >
          <Row className="vertical-align">
            <Col xs={1}>
              <DragHandle />
            </Col>
            <Col xs={11}>
              <h5 className="list-label">{mp.label}</h5>
              {constants.measurementPointTypesInverse[mp.type]}
            </Col>
          </Row>
        </ListGroupItem>
      </div>
    );
  }
);

const SortableList = SortableContainer(({ children }: any) => {
  return <ListGroup className="question-list">{children}</ListGroup>;
});

/*
  * Remove deleted measurementPoints and sort them
  */
const filterAndSortMeasurementPoints = (measurementPointsByID: {
  [key: string]: ImeasurementPoint;
}) => {
  const filteredMPs = filter(
    measurementPointsByID,
    mp => mp.isDeleted === false
  );

  filteredMPs.sort((a: ImeasurementPoint, b: ImeasurementPoint) => {
    return a.order - b.order;
  });
  return filteredMPs;
};

interface Iprops {
  selectedTab: ImeasurementPointListTab;
  setSelectedMeasurementPoint: (m: ImeasurementPoint) => void;
  deleteMeasurementPoint: (m: ImeasurementPoint) => void;
  updateMeasurementPointListTab: typeof updateMeasurementPointListTab;
  customerID: string;
}
interface Istate {
  measurementPoints: ImeasurementPoint[];
}
/*
* If the user can not edit global Measurement Points and there is not a CustomerID on the MP, then they can not edit.
*/
export class MeasurementPointList extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      measurementPoints: filterAndSortMeasurementPoints(
        this.props.selectedTab.measurementPoints
      )
    };
  }

  componentDidUpdate(prevProps: Iprops) {
    if (
      JSON.stringify(prevProps.selectedTab.measurementPoints) !==
      JSON.stringify(this.props.selectedTab.measurementPoints)
    ) {
      this.setState({
        measurementPoints: filterAndSortMeasurementPoints(
          this.props.selectedTab.measurementPoints
        )
      });
    }
  }

  onSortEnd = ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const newMeasurementPoints = arrayMove(
      this.state.measurementPoints,
      oldIndex,
      newIndex
    );
    this.updateSort(newMeasurementPoints);
  };

  updateSort = (measurementPoints: ImeasurementPoint[]) => {
    const withOrderUpdated = measurementPoints.map(
      (measurementPoint, index) => ({ ...measurementPoint, order: index })
    );
    const keyedMeasurementPoints = keyBy(withOrderUpdated, 'id');
    this.props.updateMeasurementPointListTab({
      ...this.props.selectedTab,
      measurementPoints: keyedMeasurementPoints
    });
  };
  render() {
    if (this.state.measurementPoints.length === 0) {
      return null;
    }
    return (
      <SortableList onSortEnd={this.onSortEnd} useDragHandle>
        {this.state.measurementPoints.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            mp={value}
            setSelectedMeasurementPoint={this.props.setSelectedMeasurementPoint}
            disabled={this.props.customerID.length > 0}
          />
        ))}
      </SortableList>
    );
  }
}
