// import React from "react";
// import InputAntd, { InputProps } from "antd/lib/input";
// import { ComponentContainer } from "./component-container";
//
// interface Props {
//   value?: string | number;
//   name?: string;
//   required?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
//   disabled?: boolean;
// }
//
// export const InputPassword = ({
//   value,
//   required,
//   disabled,
//   error,
//   label,
//   variant = "outlined",
//   ...props
// }: Props & InputProps): JSX.Element => {
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
//       <InputAntd.Password
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
