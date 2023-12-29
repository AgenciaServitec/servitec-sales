import React from "react";
import ReactResponsive from "react-responsive";
import { breakPoints } from "./breakPoints";

const Desktop = (props) => (
  <ReactResponsive {...props} minWidth={breakPoints.desktop} />
);

const DesktopAndTable = (props) => (
  <ReactResponsive {...props} minWidth={breakPoints.tablet} />
);

const Tablet = (props) => (
  <ReactResponsive
    {...props}
    maxWidth={breakPoints.desktop - 1}
    minWidth={breakPoints.tablet}
  />
);

const TableAndMobile = (props) => (
  <ReactResponsive {...props} maxWidth={breakPoints.desktop - 1} />
);

const Mobile = (props) => (
  <ReactResponsive {...props} maxWidth={breakPoints.tablet - 1} />
);

const Custom = (props) => <ReactResponsive {...props} />;

export const Responsive = {
  Desktop,
  DesktopAndTable,
  Tablet,
  TableAndMobile,
  Mobile,
  Custom,
};
