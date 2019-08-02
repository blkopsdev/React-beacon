import * as React from 'react';
import ReactTable, {
  RowRenderProps,
  RowInfo,
  Column,
  FinalState
} from 'react-table';
import { TranslationFunction } from 'react-i18next';

import { TableUtil } from '../common/TableUtil';
import { Button } from 'react-bootstrap';
import { Ifacility } from '../../models';
interface ExpanderProps extends RowInfo {
  t: TranslationFunction;
  showAddFacility: boolean;
  addFacility: any;
  setSelectedFacilityID: any;
}

interface RowInfoFacility extends RowInfo {
  original: Ifacility;
}

/*
* The Facilities Expander
*/
const ManageFacility = (props: ExpanderProps) => {
  const ExpanderButtonBar = (eProps: RowRenderProps) => {
    return (
      <span
        className="expander-button-bar text-right"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      >
        {props.showAddFacility && (
          <Button bsStyle="link" onClick={props.addFacility}>
            {props.t('newFacility')}
          </Button>
        )}
      </span>
    );
  };

  /*
  * Handle user clicking on a location row
  * set the selected location to state and open the modal
  */
  const getTrProps = (
    state: FinalState,
    rowInfo: RowInfoFacility | undefined
  ) => {
    // console.log("ROWINFO", rowInfo, state, column);
    if (rowInfo) {
      return {
        onClick: () => {
          props.setSelectedFacilityID(rowInfo.original.id);
          props.addFacility();
          // this.setState({
          //   selectedRow: {
          //     [rowInfo.viewIndex || 0]: !this.state.selectedRow[
          //     rowInfo.viewIndex || 0
          //       ]
          //   }
          // });
        }
      };
    }
  };

  const expanderColumns = TableUtil.translateHeaders(
    [
      {
        Footer: ExpanderButtonBar,
        minWidth: 20,
        id: 'indent-column-button-bar'
      },
      {
        Header: 'name',
        accessor: 'name',
        minWidth: 100
      },
      {
        Header: 'address',
        accessor: 'address',
        minWidth: 100
      },
      {
        Header: 'address2',
        accessor: 'address2',
        minWidth: 100
      },
      {
        Header: 'city',
        accessor: 'city',
        minWidth: 100
      },
      {
        Header: 'state',
        accessor: 'state',
        minWidth: 100
      },
      {
        Header: 'postalCode',
        accessor: 'postalCode',
        minWidth: 100
      }
    ],
    props.t
  ) as Column[];
  return (
    <div>
      <ReactTable
        className={'attempts-expander'}
        data={props.original.facilities ? props.original.facilities : []}
        sortable={false}
        columns={expanderColumns}
        minRows={0}
        showPageSizeOptions={false}
        rowsText="facilities"
        key={props.original.facilities ? props.original.facilities.length : 0}
        getTdProps={getTrProps}
        noDataText="No installations found."
        resizable={false}
        showPagination={
          props.original.facilities
            ? props.original.facilities.length >= 10
            : false
        }
      />
    </div>
  );
};

export default ManageFacility;
