"use client";

import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  // @ts-ignore - React 19 type compatibility
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  // @ts-ignore - React 19 type compatibility specific fix
  <HelmetProvider><>{children}</></HelmetProvider>
);

export default PageMeta;
