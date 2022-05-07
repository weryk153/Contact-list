import React from 'react';
import type { NextPage } from 'next';
import ContactsList from '../components/ContactsList/ContactsList';

const Home: NextPage = (): JSX.Element => {
  return (
    <main>
      <ContactsList />
    </main>
  );
};

export default Home;
