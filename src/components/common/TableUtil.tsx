import { map } from 'lodash';
import { TranslationFunction } from 'react-i18next';

export const TableUtil = {
  translateHeaders: (columns: any, t: TranslationFunction) => {
    return map(columns, column => {
      if (column.Header) {
        return { ...column, Header: t(column.Header) };
      }
      return column;
    });
  }
};
