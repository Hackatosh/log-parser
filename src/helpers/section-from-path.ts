export const sectionFromPath = (path: string): string => {
  if (path[0] !== '/') {
    return '';
  }
  const regex = new RegExp(/(\/[^/]*)\/?.*/);
  return regex.exec(path)[1];
};
