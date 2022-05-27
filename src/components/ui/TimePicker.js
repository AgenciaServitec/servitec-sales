// import React from "react";
// import TimePickerAntd from "antd/lib/time-picker";
// import { ComponentContainer } from "./component-container";
// import { Moment } from "moment";
//
// interface Props {
//   value?: Moment;
//   required?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
//   disabled?: boolean;
// }
//
// export const TimePicker = ({
//   value,
//   disabled,
//   required,
//   error,
//   label,
//   variant = "outlined",
//   ...props
// }: Props): JSX.Element => {
//   const Container = ComponentContainer[variant];
//
//   return (
//     <Container
//       value={value}
//       required={required}
//       disabled={disabled}
//       error={error}
//       label={label}
//     >
//       <TimePickerAntd
//         disabled={disabled}
//         bordered={false}
//         size="large"
//         placeholder=""
//         value={value}
//         {...props}
//       />
//     </Container>
//   );
// };
