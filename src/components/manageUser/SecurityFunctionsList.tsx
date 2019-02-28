/* 
* list the security functions
*/
import * as React from 'react';
import { ListGroup, ListGroupItem, Col, Button } from 'react-bootstrap';
import { map } from 'lodash';
import { constants } from 'src/constants/constants';

const SecurityFunctionsList = (props: any) => {
  return (
    <div>
      <ListGroup className="security-functions-list">
        {map(constants.securityFunctions, func => (
          <ListGroupItem header={props.t(func.name)} key={func.id}>
            {props.t(func.description)}
          </ListGroupItem>
        ))}
      </ListGroup>
      <Col xs={12} className="form-buttons text-right">
        <Button
          bsStyle="default"
          type="button"
          className="pull-left"
          onClick={props.toggleSecurityFunctionsModal}
        >
          {props.t('common:cancel')}
        </Button>
      </Col>
    </div>
  );
};

export default SecurityFunctionsList;
