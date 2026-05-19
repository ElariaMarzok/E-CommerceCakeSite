export const getText = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'string') return field;       // داتا قديمة 
  return field[lang] || field.es || field.en || '';  // داتا جديدة 
};