import * as React from 'react';
import { ImeasurementPoint } from 'src/models';
import { ListGroup, Button, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSortAmountUp,
  faSortAmountDown
} from '@fortawesome/pro-regular-svg-icons';
import { map } from 'lodash';
import { constants } from 'src/constants/constants';
/*
* List the Measurement Points
*/

interface Iprops {
  measurementPointList: ImeasurementPoint[];
  setSelectedMeasurementPoint: (m: ImeasurementPoint) => void;
  swapMeasurementPointOrder: (q1Index: number, q2Index: number) => void;
  deleteMeasurementPoint: (m: ImeasurementPoint) => void;
  canEditGlobal: boolean;
}

/*
* If the user can not edit global Measurement Points and there is not a CustomerID on the MP, then they can not edit.
*/
export const MeasurementPointList = (props: Iprops) => {
  const mps = props.measurementPointList;
  return (
    <ListGroup className="question-list">
      {map(mps, (mp, index) => {
        return (
          <div className="question-list-item-container" key={mp.id}>
            <span className="sort-controls">
              <Button
                type="button"
                disabled={!props.canEditGlobal && !mp.customerID}
                onClick={() => {
                  props.setSelectedMeasurementPoint(mp);
                }}
              >
                <FontAwesomeIcon icon={['far', 'edit']}>Edit</FontAwesomeIcon>
              </Button>
              <Button
                disabled={
                  mp.order === 0 || (!props.canEditGlobal && !mp.customerID)
                }
                onClick={() => {
                  // console.log('swap up', mp.label, mps[index - 1].label);
                  props.swapMeasurementPointOrder(index, index - 1);
                }}
              >
                <FontAwesomeIcon icon={faSortAmountUp} fixedWidth size="2x" />
              </Button>
              <Button
                type="button"
                disabled={!props.canEditGlobal && !mp.customerID}
                onClick={() => {
                  props.deleteMeasurementPoint(mp);
                }}
              >
                <FontAwesomeIcon icon={['far', 'times']}>
                  Delete
                </FontAwesomeIcon>
              </Button>
              <Button
                type="button"
                disabled={
                  mp.order === mps.length - 1 ||
                  (!props.canEditGlobal && !mp.customerID)
                }
                onClick={() => {
                  // console.log('swap up', mp.label, mps[index + 1].label);
                  props.swapMeasurementPointOrder(index + 1, index);
                }}
              >
                <FontAwesomeIcon icon={faSortAmountDown} fixedWidth size="2x" />
              </Button>
            </span>
            <ListGroupItem
              className="question-list-item"
              onClick={() => {
                props.setSelectedMeasurementPoint(mp);
              }}
            >
              <h5 className="list-label">{mp.label}</h5>
              {constants.measurementPointTypesInverse[mp.type]}
            </ListGroupItem>
          </div>
        );
      })}
    </ListGroup>
  );
};
