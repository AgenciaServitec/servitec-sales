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
    color: "#a6a6a6",
  },
  rate_limited: {
    icon: faWarning,
    label: "Web limitada",
    color: "#565555",
  },
  up: {
    icon: faCheck,
    label: "Web estable",
    color: "#1fa239",
  },
  down: {
    icon: faXmark,
    label: "Web no responde",
    color: "#fa2525",
  },
  with_problems: {
    icon: faExclamation,
    label: "Web con problemas",
    color: "#f3a12d",
  },
};
