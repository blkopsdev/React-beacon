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

interface ExpanderProps extends RowInfo {
  addToQuote: (product: any) => void;
  addInstallation: () => void;
  t: TranslationFunction;
  getExpanderTrProps: (
    state: FinalState,
    rowInfo: RowInfo
  ) => object | undefined;
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
        <Button bsStyle="link" onClick={() => props.addToQuote(props.original)}>
          {props.t('Add to Quote')}
        </Button>
        <Button bsStyle="link" onClick={props.addInstallation}>
          {props.t('Add Installation')}
        </Button>
      </span>
    );
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
      Footer: ExpanderButtonBar,
      minWidth: 20,
      id: 'indent-column-button-bar'
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
      Cell: (
        <span>
          <FontAwesomeIcon icon="envelope" />{' '}
        </span>
      ),
      minWidth: 25
    }
  ] as Column[];

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
  let installs = props.original.installs;
  if (installs.length === 0) {
    installs = [{ serialNumber: '', nickname: '', rfid: '' }];
  }
  if (props.original && props.original.installs) {
    return (
      <div>
        <ReactTable
          className={'attempts-expander'}
          data={installs}
          columns={expanderColumns}
          defaultPageSize={10}
          rowsText="installs"
          key={props.original.installs.length}
          getTdProps={expanderHandleTdProps}
          noDataText="No installations found."
          resizable={false}
          getTrProps={props.getExpanderTrProps}
        />
      </div>
    );
  } else {
    return null;
  }
};
