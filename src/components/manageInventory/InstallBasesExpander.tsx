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
import { Ifacility, IinstallBase, IinstallBaseWithStatus } from 'src/models';
import { TableUtil } from '../common/TableUtil';
import { selectResult } from 'src/actions/measurementPointResultsActions';
import {
  toggleMPResultModal,
  toggleMPResultHistory
} from 'src/actions/manageInventoryActions';
import { constants } from 'src/constants/constants';
import { orderBy } from 'lodash';

interface RowInfoInstallBase extends RowInfo {
  original: IinstallBaseWithStatus;
}
interface ExpanderProps extends RowInfo {
  addToCart: typeof addToCart;
  addInstallation: () => void;
  t: TranslationFunction;
  showAddInstallation: boolean;
  showRequestQuote: boolean;
  facility: Ifacility;
  selectResult: typeof selectResult;
  handleInstallBaseSelect: (i: IinstallBase) => void;
  contactAboutInstall: (i: IinstallBase) => void;
  toggleMPResultModal: typeof toggleMPResultModal;
  selectInstallBase: (i: IinstallBase) => void;
  toggleMPResultHistory: typeof toggleMPResultHistory;
}

/*
* The Installations Expander
*/
export const InstallBasesExpander = (props: ExpanderProps) => {
  // console.log(props.original, `${props.original.class.id}/${props.original.userID}`);
  // console.log(props);

  const installBasesWithLocationString = props.original.installs.map(
    (install: IinstallBase) => {
      return {
        ...install,
        locationString: TableUtil.buildLocation(install, props.facility)
      };
    }
  );
  const sortedInstallBases = orderBy(
    installBasesWithLocationString,
    'installString'
  );
  /*
  * Handle user clicking on an install row column
  * if there is no "id" to key off of for a specific button, then set the selected install to state and open the edit install modal
  * Note: handleOriginal has been commented out.  if you need to receive the click on the row in getTrProps - then you need to add back handleOriginal()
  * onClick: (
          e: React.MouseEvent<HTMLFormElement>,
          handleOriginal: () => void
        )
        if (handleOriginal) {
            handleOriginal();
          }
  * 
  */
  const getTdProps = (
    state: FinalState,
    rowInfo: RowInfoInstallBase,
    column: Column,
    instance: any
  ) => {
    const notTested =
      rowInfo.original.status ===
      constants.measurementPointResultStatusTypes[0];
    if (column.id && column.id === 'contact-button') {
      return {
        onClick: () => {
          props.contactAboutInstall(rowInfo.original);
        }
      };
    } else if (column.id && column.id === 'select-result-button') {
      if (notTested) {
        return {};
      }
      return {
        onClick: () => {
          props.selectResult(rowInfo.original.id);
          props.toggleMPResultModal();
          props.selectInstallBase(rowInfo.original); // TODO move this to redux
        }
      };
    } else if (column.id && column.id === 'historical-results-button') {
      return {
        onClick: () => {
          // this.props.selectHistoricalResult
          console.log('selecting historical');
          props.selectInstallBase(rowInfo.original);
          props.toggleMPResultHistory();
        }
      };
    } else if (column.id && column.id === 'select-result-button-disabled') {
      return {};
    } else {
      return {
        onClick: () => {
          props.handleInstallBaseSelect(rowInfo.original);
        }
      };
    }
  };

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
        accessor: 'locationString',
        minWidth: 220
      },
      {
        Header: 'status',
        id: 'status',
        accessor: ({ status }: IinstallBaseWithStatus) => (
          <span className={`status ${status}`}>{`${props.t(
            'manageMeasurementPointLists:' + status
          )}`}</span>
        ),
        minWidth: 100
      },
      {
        Header: '',
        id: 'contact-button',
        Cell: (
          <span className="contact-button" title={props.t('Request Service')}>
            <FontAwesomeIcon icon={['far', 'wrench']} />
          </span>
        ),
        minWidth: 25
      },
      {
        Header: '',
        id: 'select-result-button',
        Cell: ({ original }: { original: IinstallBaseWithStatus }) => {
          const notTested =
            original.status === constants.measurementPointResultStatusTypes[0];
          const color = notTested
            ? constants.colors.greyText
            : constants.colors.green;
          return (
            <span
              className="select-result-button"
              style={{ color }}
              title={props.t('Current Status')}
            >
              <FontAwesomeIcon icon={['far', 'clipboard-list']} />
            </span>
          );
        },
        minWidth: 25
      },
      {
        Header: '',
        id: 'historical-results-button',
        Cell: ({ original }: { original: IinstallBaseWithStatus }) => {
          return (
            <span
              className="historical-results-button"
              style={{ color: constants.colors.green }}
              title={props.t('History')}
            >
              <FontAwesomeIcon icon={['far', 'history']} />
            </span>
          );
        },
        minWidth: 25
      }
    ],
    props.t
  ) as Column[];

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
        data={sortedInstallBases}
        sortable={false}
        columns={expanderColumns}
        minRows={0}
        showPageSizeOptions={false}
        rowsText="installs"
        key={props.original.installs.length}
        getTdProps={getTdProps}
        noDataText="No installations found."
        resizable={false}
        showPagination={props.original.installs.length >= 10}
      />
    </div>
  );
  // } else {
  // return null;
  // }
};
