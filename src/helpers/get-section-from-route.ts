export const getSectionFromRoute = (route: string): string => {
  if (route[0] !== '/') {
    return '';
  }
  const regex = new RegExp(/(\/[^/]*)\/?.*/);
  return regex.exec(route)[1];
};
