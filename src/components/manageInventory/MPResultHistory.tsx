/* 
* Measurement Point Result History
*/

import * as React from 'react';
import { ImeasurementPointResult } from 'src/models';
import { ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import * as moment from 'moment';
import { constants } from 'src/constants/constants';
import { orderBy } from 'lodash';
import { TranslationFunction } from 'i18next';
import { updateMeasurementPointResult } from 'src/actions/measurementPointResultsActions';

interface Iprops {
  MPlistResults: ImeasurementPointResult[];
  installBaseID: string;
  t: TranslationFunction;
  updateMeasurementPointResult: typeof updateMeasurementPointResult;
}
export const MPResultHistory = (props: Iprops) => {
  let filteredInstallBaseResults: ImeasurementPointResult[] = [];
  if (props.MPlistResults) {
    filteredInstallBaseResults = props.MPlistResults.filter(
      result =>
        result.temporary !== true &&
        result.installBaseID === props.installBaseID
    );
  }
  if (filteredInstallBaseResults.length) {
    filteredInstallBaseResults = orderBy(
      filteredInstallBaseResults,
      res => moment.utc(res.updateDate).unix(),
      'desc'
    );
    return (
      <div className="result-history">
        <h4>History</h4>
        <ListGroup>
          {filteredInstallBaseResults.map(result => {
            return (
              <ListGroupItem
                key={result.id}
                onClick={() => props.updateMeasurementPointResult(result, true)}
              >
                <Row>
                  <Col md={4}>
                    {moment.utc(result.createDate).format('MM/DD/YYYY hh:mm a')}
                  </Col>
                  <Col md={4} className="notes-column truncate">
                    {result.notes}
                  </Col>
                  <Col
                    md={4}
                    className={`status ${
                      constants.measurementPointResultStatusTypes[result.status]
                    }`}
                  >
                    {props.t(
                      'manageMeasurementPointLists:' +
                        constants.measurementPointResultStatusTypes[
                          result.status
                        ]
                    )}
                  </Col>
                </Row>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  } else {
    return (
      <div className="result-history">
        <h4>History</h4>
        <p>No Inspections for this Device.</p>
      </div>
    );
  }
};
