import { transitionInType, transitionOutType } from '../models';

const constants = {
  toastrError: {
    transitionIn: 'bounceInDown' as transitionInType,
    transitionOut: 'bounceOutUp' as transitionOutType,
    timeOut: 0
  }
};

export default constants;
