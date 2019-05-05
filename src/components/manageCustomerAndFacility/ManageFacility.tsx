import * as React from 'react';
import ReactTable, {
  RowRenderProps,
  RowInfo,
  Column
  // FinalState
} from 'react-table';
// import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TranslationFunction } from 'react-i18next';
import {
  // Ifacility,
  // IinstallBase,
  IinstallBaseWithStatus
} from 'src/models';
import { TableUtil } from '../common/TableUtil';
// import { selectResult } from 'src/actions/measurementPointResultsActions';
// import {
//     toggleMPResultModal,
//     toggleMPResultHistory
// } from 'src/actions/manageInventoryActions';
import { constants } from 'src/constants/constants';

// interface RowInfoInstallBase extends RowInfo {
//     original: IinstallBaseWithStatus;
// }
interface ExpanderProps extends RowInfo {
  t: TranslationFunction;
  // facility: Ifacility;
  // selectResult: typeof selectResult;
  // handleInstallBaseSelect: (i: IinstallBase) => void;
  // contactAboutInstall: (i: IinstallBase) => void;
  // toggleMPResultModal: typeof toggleMPResultModal;
  // selectInstallBase: (i: IinstallBase) => void;
  // toggleMPResultHistory: typeof toggleMPResultHistory;
}

/*
* The Installations Expander
*/
const ManageFacility = (props: ExpanderProps) => {
  // const getTdProps = (
  //     state: FinalState,
  //     rowInfo: RowInfoInstallBase,
  //     column: Column,
  //     instance: any
  // ) => {
  // const notTested =
  //     rowInfo.original.status ===
  //     constants.measurementPointResultStatusTypes[0];
  // if (column.id && column.id === 'contact-button') {
  //     return {
  //         onClick: () => {
  //             props.contactAboutInstall(rowInfo.original);
  //         }
  //     };
  // } else if (column.id && column.id === 'select-result-button') {
  //     if (notTested) {
  //         return {};
  //     }
  //     return {
  //         onClick: () => {
  //             props.selectResult(rowInfo.original.id);
  //             props.toggleMPResultModal();
  //             props.selectInstallBase(rowInfo.original); // TODO move this to redux
  //         }
  //     };
  // } else if (column.id && column.id === 'historical-results-button') {
  //     if (notTested) {
  //         return {};
  //     }
  //     return {
  //         onClick: () => {
  //             // this.props.selectHistoricalResult
  //             console.log('selecting historical');
  //             props.selectInstallBase(rowInfo.original);
  //             props.toggleMPResultHistory();
  //         }
  //     };
  // } else if (column.id && column.id === 'select-result-button-disabled') {
  //     return {};
  // } else {
  //     return {
  //         onClick: () => {
  //             props.handleInstallBaseSelect(rowInfo.original);
  //         }
  //     };
  // }
  // };

  const ExpanderButtonBar = (eProps: RowRenderProps) => {
    return (
      <span
        className="expander-button-bar text-right"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      >
        {/*{props.showRequestQuote && (*/}
        {/*    <Button*/}
        {/*        bsStyle="link"*/}
        {/*        onClick={() => props.addToCart(props.original, 'INVENTORY')}*/}
        {/*    >*/}
        {/*        {props.t('addToQuote')}*/}
        {/*    </Button>*/}
        {/*)}*/}

        {/*        {props.showAddInstallation && (*/}
        {/*            <Button bsStyle="link" onClick={props.addInstallation}>*/}
        {/*                {props.t('addInstallation')}*/}
        {/*            </Button>*/}
        {/*        )}*/}
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
      // {
      //     Header: 'Location',
      //     id: 'location',
      //     accessor: (install: IinstallBase) =>
      //         TableUtil.buildLocation(install, props.facility),
      //     minWidth: 220
      // },
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
          const notTested =
            original.status === constants.measurementPointResultStatusTypes[0];
          const color = notTested
            ? constants.colors.greyText
            : constants.colors.green;
          return (
            <span
              className="historical-results-button"
              style={{ color }}
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
  return (
    <div>
      <ReactTable
        className={'attempts-expander'}
        data={props.original.facilities}
        sortable={false}
        columns={expanderColumns}
        minRows={0}
        showPageSizeOptions={false}
        rowsText="facilities"
        key={props.original.facilities.length}
        // getTdProps={getTdProps}
        noDataText="No installations found."
        resizable={false}
        showPagination={props.original.facilities.length >= 10}
      />
    </div>
  );
};

export default ManageFacility;
