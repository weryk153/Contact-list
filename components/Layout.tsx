import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children?: ReactNode;
};

const Layout: FC<Props> = ({ children }): JSX.Element => (
  <div>
    <Head>
      <title>Kuren</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no"
      />
    </Head>
    <Header />
    {children}
  </div>
);

export default Layout;
