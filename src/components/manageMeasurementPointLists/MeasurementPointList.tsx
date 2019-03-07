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
  swapQuestionOrder: (q1Index: number, q2Index: number) => void;
  deleteMeasurementPoint: (m: ImeasurementPoint) => void;
}

export const MeasurementPointList = (props: Iprops) => {
  const mps = props.measurementPointList;
  return (
    <ListGroup className="question-list">
      {map(mps, (mp, index) => {
        return (
          <div className="question-list-item-container" key={mp.id}>
            <span className="sort-controls">
              <Button
                onClick={() => {
                  props.setSelectedMeasurementPoint(mp);
                }}
              >
                <FontAwesomeIcon icon={['far', 'edit']}>Edit</FontAwesomeIcon>
              </Button>
              <Button
                disabled={mp.order === 0}
                onClick={() => {
                  // console.log('swap up', mp.label, mps[index - 1].label);
                  props.swapQuestionOrder(index, index - 1);
                }}
              >
                <FontAwesomeIcon icon={faSortAmountUp} fixedWidth size="2x" />
              </Button>
              <Button
                onClick={() => {
                  props.deleteMeasurementPoint(mp);
                }}
              >
                <FontAwesomeIcon icon={['far', 'times']}>
                  Delete
                </FontAwesomeIcon>
              </Button>
              <Button
                disabled={mp.order === mps.length - 1}
                onClick={() => {
                  // console.log('swap up', mp.label, mps[index + 1].label);
                  props.swapQuestionOrder(index + 1, index);
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
              {mp.type === 6 && (
                <p dangerouslySetInnerHTML={{ __html: mp.label }} />
              )}
              {mp.type !== 6 && <h5>{mp.label}</h5>}
              {mp.type < 5 && constants.measurementPointTypesInverse[mp.type]}
            </ListGroupItem>
          </div>
        );
      })}
    </ListGroup>
  );
};
