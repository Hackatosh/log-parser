import moment from 'moment';

export const formatTimestamp = (timestamp: number): string => moment(timestamp * 1000).format('DD-MM-YYYY HH:mm:ss');
