import {
  faCheck,
  faExclamation,
  faWarning,
  faWindowMaximize,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export const webStatus = {
  not_reviewed: {
    icon: faWindowMaximize,
    label: "Web no revisado",
    description:
      "Son las webs que recientemente se agregaron y no fueron revisadas.",
    color: "#a6a6a6",
  },
  rate_limited: {
    icon: faWarning,
    label: "Web limitada",
    description:
      "Son las webs que no permiten hacer muchas peticiones de revisión y bloquean por un tiempo determinado, pueden ser minutos u horas.",
    color: "#565555",
  },
  up: {
    icon: faCheck,
    label: "Web estable",
    description:
      "Son las webs que retornan una respuesta exitosa y están funcionando bien.",
    color: "#1fa239",
  },
  down: {
    icon: faXmark,
    label: "Web no responde",
    description:
      "Son las webs que retornan con un error, son las más críticas a revisarlas de manera manual.",
    color: "#fa2525",
  },
  with_problems: {
    icon: faExclamation,
    label: "Web con problemas",
    description:
      "Son las webs que retornan con un error o cargan, pero no están funcionando bien. Puede ser una web con contenido en blanco.",
    color: "#f3a12d",
  },
};
