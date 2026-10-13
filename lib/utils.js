export const pad = (n) => String(n).padStart(2, '0');
export const uid = () => Date.now() + '' + Math.floor(Math.random() * 9999);
export const dstr = (d) => {
  d = d || new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
};
export const parseD = (s) => {
  const p = String(s).slice(0, 10).split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
};
export const daysBetween = (a, b) => Math.round((parseD(b) - parseD(a)) / 86400000);
export const today = () => dstr();
/* i18n ETAPA 4: datas curtas acompanham o idioma do app (setLocaleLang vem do store) */
const LOCALES = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
let _lang = 'pt';
export const setLocaleLang = (l) => { _lang = LOCALES[l] ? l : 'pt'; };
export const localeOf = (l) => LOCALES[l || _lang] || 'pt-BR';
export const fmtD = (s) => {
  try {
    return parseD(s).toLocaleDateString(LOCALES[_lang], { day: '2-digit', month: 'short' });
  } catch (e) {
    return s;
  }
};
export const fdmy = (s) => {
  const p = String(s).split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
};
export const yesterday = (base) => dstr(new Date(parseD(base || today()).getTime() - 86400000));
export const getWeekDays = (refDateStr) => {
  const d = parseD(refDateStr || today());
  const day = d.getDay();
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(d.getTime() + diffToMonday * 86400000);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const curr = new Date(monday.getTime() + i * 86400000);
    days.push(dstr(curr));
  }
  return days;
};
export const shiftWeek = (baseDateStr, weekOffset) => {
  const d = parseD(baseDateStr || today());
  return dstr(new Date(d.getTime() + (weekOffset * 7 * 86400000)));
};
export const LSKEY = 'forjando_guerreiros_v1';
