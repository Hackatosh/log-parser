import moment from 'moment-timezone';
import 'moment/locale/fr';

moment.locale('fr');
moment.tz.setDefault('Europe/Paris');

export const formatTimestamp = (timestamp: number): string => moment(timestamp * 1000).format('DD-MM-YYYY HH:mm:ss');
