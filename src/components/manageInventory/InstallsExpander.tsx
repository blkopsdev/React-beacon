import * as React from 'react';
import ReactTable, {
  RowRenderProps,
  RowInfo,
  Column,
  FinalState
} from 'react-table';
// const FontAwesome = require("react-fontawesome");
// import * as moment from 'moment';
import { Button } from 'react-bootstrap';
// import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TranslationFunction } from 'react-i18next';
import { addToCart } from '../../actions/shoppingCartActions';
import { IinstallBase, Ifacility } from 'src/models';
import { find } from 'lodash';
import { TableUtil } from '../common/TableUtil';

interface ExpanderProps extends RowInfo {
  addToCart: typeof addToCart;
  addInstallation: () => void;
  contactAboutInstall: (install: any) => void;
  t: TranslationFunction;
  getExpanderTrProps: (
    state: FinalState,
    rowInfo: RowInfo
  ) => object | undefined;
  showAddInstallation: boolean;
  showRequestQuote: boolean;
  facility: Ifacility;
}

/*
* The Installations Expander
*/
export const InstallationsExpander = (props: ExpanderProps) => {
  // console.log(props.original, `${props.original.class.id}/${props.original.userID}`);
  // console.log(props);

  const ExpanderButtonBar = (eProps: RowRenderProps) => {
    return (
      <span
        className="expander-button-bar text-right"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      >
        {props.showRequestQuote && (
          <Button
            bsStyle="link"
            onClick={() => props.addToCart(props.original, 'INVENTORY')}
          >
            {props.t('addToQuote')}
          </Button>
        )}

        {props.showAddInstallation && (
          <Button bsStyle="link" onClick={props.addInstallation}>
            {props.t('addInstallation')}
          </Button>
        )}
      </span>
    );
  };

  /*
  * take the install and find the names for the location id's.  building, floor, locations, rooms, position
  */
  const buildLocation = (inst: object) => {
    const install = inst as IinstallBase;
    let locationString = '';
    const building = find(props.facility.buildings, { id: install.buildingID });

    if (building) {
      locationString += building.name;
      const floor = find(building.floors, { id: install.floorID });
      if (floor) {
        locationString += `: ${floor.name}`;
        const location = find(floor.locations, { id: install.locationID });
        if (location) {
          locationString += `: ${location.name}`;
          const room = find(location.rooms, { id: install.locationID });
          if (room) {
            locationString += `: ${room.name}`;
          }
        }
      }
    }
    if (install.position) {
      locationString += `: ${install.position}`;
    }
    return locationString;
  };
  /*
* TODO add the location column
  {
    Header: "Location",
    accessor: 'location',
    minWidth: 100
  },
*/

  const expanderColumns = TableUtil.translateHeaders(
    [
      {
        Footer: ExpanderButtonBar,
        minWidth: 20,
        id: 'indent-column-button-bar'
      },
      {
        Header: 'serialNumber',
        accessor: 'serialNumber',
        minWidth: 100
      },
      {
        Header: 'RFID',
        accessor: 'rfid',
        minWidth: 100
      },
      {
        Header: 'Location',
        id: 'location',
        accessor: install => buildLocation(install),
        minWidth: 200
      },
      {
        Header: '',
        id: 'contact-button',
        Cell: (
          <span className="contact-button">
            <FontAwesomeIcon icon="envelope" />
          </span>
        ),
        minWidth: 25
      }
    ],
    props.t
  ) as Column[];

  const expanderHandleTdProps = (
    state: FinalState,
    rowInfo: RowInfo,
    column: Column,
    instance: any
  ) => {
    if (column && column.id && column.id === 'contact-button') {
      return {
        onClick: (
          e: React.MouseEvent<HTMLFormElement>,
          handleOriginal: () => void
        ) => {
          console.log(
            'clicked contact support about install',
            rowInfo.original.id
          );
          props.contactAboutInstall(rowInfo.original);
          if (handleOriginal) {
            handleOriginal();
          }
        }
      };
    } else {
      return {};
    }
  };

  // let installs : IinstallBase[] = [];
  // if (props.installs && props.installs){
  //     installs = props.installs;
  // }

  // if there are no installs display a blank one so that the buttons display
  // let installs = props.original.installs;
  // if (installs.length === 0) {
  //   installs = [{ serialNumber: '', nickname: '', rfid: '' }];
  // }
  // if (props.original && props.original.installs) {
  return (
    <div>
      <ReactTable
        className={'attempts-expander'}
        data={props.original.installs}
        sortable={false}
        columns={expanderColumns}
        minRows={0}
        showPageSizeOptions={false}
        rowsText="installs"
        key={props.original.installs.length}
        getTdProps={expanderHandleTdProps}
        noDataText="No installations found."
        resizable={false}
        getTrProps={props.getExpanderTrProps}
        showPagination={props.original.installs.length >= 10}
      />
    </div>
  );
  // } else {
  // return null;
  // }
};
