import * as React from 'react';
import ReactTable, {
  RowRenderProps,
  RowInfo,
  Column
} from 'react-table';
import { TranslationFunction } from 'react-i18next';

import { TableUtil } from '../common/TableUtil';
import { Button } from 'react-bootstrap';
interface ExpanderProps extends RowInfo {
  t: TranslationFunction;
  showAddFacility: boolean;
  addFacility: any;
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
