import { map } from 'lodash';
import { TranslationFunction } from 'react-i18next';
import { Column } from 'react-table';

export const TableUtil = {
  translateHeaders: (columns: Column[], t: TranslationFunction) => {
    return map(columns, column => {
      if (column.Header && typeof column.Header === 'string') {
        return { ...column, Header: t(column.Header) };
      }
      return column;
    });
  }
};
