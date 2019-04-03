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
import { Ifacility, IinstallBase } from 'src/models';
import { TableUtil } from '../common/TableUtil';
import { selectResult } from 'src/actions/measurementPointResultsActions';

interface RowInfoInstallBase extends RowInfo {
  value: IinstallBase;
}
interface ExpanderProps extends RowInfo {
  addToCart: typeof addToCart;
  addInstallation: () => void;
  contactAboutInstall: (install: any) => void;
  t: TranslationFunction;
  getExpanderTrProps: (
    state: FinalState,
    rowInfo: RowInfoInstallBase
  ) => object | undefined;
  showAddInstallation: boolean;
  showRequestQuote: boolean;
  facility: Ifacility;
  selectResult: typeof selectResult;
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
        accessor: (install: IinstallBase) =>
          TableUtil.buildLocation(install, props.facility),
        minWidth: 200
      },
      {
        Header: '',
        id: 'contact-button',
        Cell: (
          <span className="contact-button">
            <FontAwesomeIcon icon="wrench" />
          </span>
        ),
        minWidth: 25
      },
      {
        Header: '',
        id: 'select-result-button',
        Cell: <span className="select-result-button">Current Result</span>,
        minWidth: 60
      },
      {
        Header: '',
        id: 'historical-results-button',
        Cell: (
          <span className="historical-results-button">Historical Results</span>
        ),
        minWidth: 60
      }
    ],
    props.t
  ) as Column[];

  const expanderHandleTdProps = (
    state: FinalState,
    rowInfo: RowInfoInstallBase,
    column: Column,
    instance: any
  ) => {
    if (column && column.id && column.id === 'contact-button') {
      return {
        onClick: (
          e: React.MouseEvent<HTMLFormElement>,
          handleOriginal: () => void
        ) => {
          props.contactAboutInstall(rowInfo.original);
          if (handleOriginal) {
            handleOriginal();
          }
        }
      };
    } else if (column && column.id && column.id === 'select-result-button') {
      return {
        onClick: (
          e: React.MouseEvent<HTMLFormElement>,
          handleOriginal: () => void
        ) => {
          props.selectResult(rowInfo.original.id);
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
