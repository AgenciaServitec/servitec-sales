import moment from "moment";

/**
 * Convierte una fecha a formato ISO 8601 con la zona horaria de Lima, Perú (UTC-5)
 * @param {Date | string} date - La fecha que deseas convertir (puede ser un objeto Date o un string).
 * @returns {string} - Fecha en formato ISO 8601.
 */

export const toISO8601Lima = (date = moment()) => {
  const limaTimezone = "-05:00"; // Zona horaria de Lima, Perú
  const momentDate = moment(date).utcOffset(limaTimezone); // Ajusta la zona horaria
  return momentDate.format("YYYY-MM-DDTHH:mm:ssZ"); // Formato ISO 8601
};
