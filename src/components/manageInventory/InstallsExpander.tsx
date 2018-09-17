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
// import { Iproduct, IinstallBase } from "../../models";

export const expanderToggle = (props: RowRenderProps) => {
  return (
    <div>
      {props.isExpanded ? (
        <span>
          <FontAwesomeIcon icon="chevron-down" />
        </span>
      ) : (
        <span>
          <FontAwesomeIcon icon="chevron-right" />
        </span>
      )}
    </div>
  );
};

const ExpanderButtonBar = (props: RowRenderProps) => {
  if (props.index === 0) {
    return (
      <span
        className="expander-button-bar text-right"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      >
        <Button bsSize="sm" bsStyle="link">
          Edit Product
        </Button>
      </span>
    );
  } else {
    return '';
  }
};

/*
* TODO add the location column
  {
    Header: "Location",
    accessor: 'location',
    minWidth: 100
  },
*/

const expanderColumns = [
  {
    Header: '',
    minWidth: 20,
    id: 'indent-column-button-bar',
    Cell: ExpanderButtonBar
  },
  {
    Header: 'S/N',
    accessor: 'serialNumber',
    minWidth: 100
  },
  {
    Header: 'Nickname',
    accessor: 'nickname',
    minWidth: 100
  },
  {
    Header: 'RFID',
    accessor: 'rfid',
    minWidth: 100
  },

  {
    Header: '',
    id: 'contact-button',
    minWidth: 25
  }
] as Column[];

interface ExpanderProps extends RowInfo {
  addToQuote: () => void;
  addInstallation: () => void;
}

/*
* The Installations Expander
*/
export const InstallationsExpander = (props: ExpanderProps) => {
  // console.log(props.original, `${props.original.class.id}/${props.original.userID}`);
  console.log(props);

  /*
* assign the correct color to the table cell for teachers and students
* assign the function to open the ModalQuizResultPreview for teachers only
*/
  const expanderHandleTdProps = (
    state: FinalState,
    rowInfo: RowInfo,
    column: Column,
    instance: any
  ) => {
    if (
      column &&
      column.id &&
      rowInfo.row[column.id] &&
      rowInfo.row[column.id].className
    ) {
      return {
        onClick: (
          e: React.MouseEvent<HTMLFormElement>,
          handleOriginal: () => void
        ) => {
          console.log('clocked add to quote');
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
  if (props.original && props.original.installs) {
    return (
      <div>
        <ReactTable
          className={'attempts-expander'}
          data={props.original.installs}
          columns={expanderColumns}
          pageSize={props.original.installs.length}
          key={props.original.installs.length}
          showPagination={false}
          showPageSizeOptions={false}
          getTdProps={expanderHandleTdProps}
          noDataText="No installations found."
        />
      </div>
    );
  } else {
    return null;
  }
};
