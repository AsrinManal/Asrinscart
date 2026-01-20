import React from "react";
import { Helmet } from "react-helmet-async";

const Metadata = ({ title }) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export default Metadata;
