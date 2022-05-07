import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import idx from 'idx';
import ContactsList from '../components/ContactsList/ContactsList';
import { GETAllContacts } from '../utils/apis';
import { useQuery } from 'react-query';

const Home: NextPage = (): JSX.Element => {
  const fetchData = async () => {
    try {
      const res = await GETAllContacts();

      return idx(res, (_) => _.data.data);
    } catch (err) {
      console.error(`[AnnounceDetail Fetch Error]: ${err}`);
      throw new Error();
    }
  };

  const { data } = useQuery('contacts', fetchData, { initialData: [] });

  return (
    <main>
      <ContactsList data={data} />
    </main>
  );
};

export default Home;
