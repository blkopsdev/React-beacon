export default function createShowModalWithNamedType(modalName = '') {
  return function modalToggle(state: boolean = false, action: any) {
    switch (action.type) {
      case `TOGGLE_MODAL_${modalName}`:
        return !state;
      default:
        return state;
    }
  };
}
