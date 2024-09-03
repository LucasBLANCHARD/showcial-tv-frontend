import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { t } from 'i18next';

export const formatActivityDate = (date, language) => {
  //TODO: use i18next to get the current language
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return `${t('activity.today-at')} ${format(parsedDate, 'HH:mm', { locale: fr })}`;
  } else if (isYesterday(parsedDate)) {
    return `${t('activity.yesterday-at')} ${format(parsedDate, 'HH:mm', { locale: fr })}`;
  } else {
    return format(parsedDate, 'dd MMMM yyyy à HH:mm', { locale: fr });
  }
};
