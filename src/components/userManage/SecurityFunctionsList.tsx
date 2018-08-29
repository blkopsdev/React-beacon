/* 
* list the security functions
*/
import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { map } from 'lodash';
import constants from '../../constants/constants';

const SecurityFunctionsList = (props: any) => {
  return (
    <ListGroup className="security-functions-list">
      {map(constants.securityFunctions, func => (
        <ListGroupItem header={props.t(func.name)} key={func.id}>
          {props.t(func.description)}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default SecurityFunctionsList;
