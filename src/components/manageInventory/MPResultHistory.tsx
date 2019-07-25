/* 
* Measurement Point Result History
*/

import * as React from 'react';
import { ImeasurementPointResult } from 'src/models';
import { ListGroup, ListGroupItem, Row, Col, Button } from 'react-bootstrap';
import * as moment from 'moment';
import { constants } from 'src/constants/constants';
import { orderBy } from 'lodash';
import { TranslationFunction } from 'i18next';

interface Iprops {
  MPListResults: ImeasurementPointResult[];
  installBaseID: string;
  t: TranslationFunction;
  locationString: string;
  colorButton: any;
  toggleModal: () => void;
  toggleMPResultNotes: () => void;
  toggleMPResultAddModal: () => void;
  setHistoricalResultID: (id: string) => void;
}
export const MPResultHistory = (props: Iprops) => {
  const { t } = props;
  let filteredInstallBaseResults: ImeasurementPointResult[] = [];
  if (props.MPListResults) {
    filteredInstallBaseResults = props.MPListResults.filter(
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
        <h5 style={{ paddingLeft: '15px', paddingBottom: '15px' }}>
          {props.locationString}
        </h5>
        <ListGroup>
          {filteredInstallBaseResults.map(result => {
            return (
              <ListGroupItem
                key={result.id}
                onClick={() => {
                  props.setHistoricalResultID(result.id);
                  // props.updateMeasurementPointResult(result, true);
                  props.toggleMPResultNotes();
                }}
              >
                <Row>
                  <Col md={4}>
                    {moment
                      .utc(result.createDate)
                      .local()
                      .format('MM/DD/YYYY hh:mm a')}
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
        <Col xs={12} className="form-buttons text-right">
          {/* <Button
            bsStyle="link"
            type="button"
            onClick={props.toggleMPResultAddModal}
          >
            {t('addResult')}
          </Button> */}
          <Button
            bsStyle={props.colorButton}
            type="button"
            onClick={props.toggleModal}
          >
            {t('common:done')}
          </Button>
        </Col>
      </div>
    );
  } else {
    return (
      <div className="result-history">
        <Col md={12}>
          <h4>{t('No inspections for this device.')}</h4>
        </Col>
        <Col xs={12} className="form-buttons text-right">
          {/* commented out for PHase II deployment
          <Button
            bsStyle="link"
            type="button"
            onClick={props.toggleMPResultAddModal}
          >
            {t('addResult')}
          </Button> */}
          <Button
            bsStyle={props.colorButton}
            type="button"
            onClick={props.toggleModal}
          >
            {t('common:done')}
          </Button>
        </Col>
      </div>
    );
  }
};
