// import React from "react";
// import InputNumberAntd from "antd/lib/input-number";
// import { ComponentContainer } from "./component-container";
//
// interface Props {
//   value?: string | number;
//   required?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
//   disabled?: boolean;
// }
//
// export const InputNumber = ({
//   value,
//   required,
//   disabled,
//   error,
//   label,
//   variant = "outlined",
//   ...props
// }: Props): JSX.Element => {
//   const Container = ComponentContainer[variant];
//
//   return (
//     <Container value={value} required={required} error={error} label={label}>
//       <InputNumberAntd
//         bordered={false}
//         placeholder=""
//         size="large"
//         value={value}
//         disabled={disabled}
//         {...props}
//       />
//     </Container>
//   );
// };
