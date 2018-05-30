export const loadState = (key: string = 'state') => {
  try {
    const serializedState = localStorage.getItem(key);
    if(serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = (state: any, key: string = 'state') => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    // ignore write error
  }
};