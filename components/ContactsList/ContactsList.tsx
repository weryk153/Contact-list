import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import idx from 'idx';
import ListItem from '../ListItem/ListItem';
import { DELETEContact, GETAllContacts } from '../../utils/apis';
import Dialog from '../Common/Dialog/Dialog';
import style from './ContactsList.module.scss';

const ContactsList: FC = (): JSX.Element => {
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const fetchData = async () => {
    try {
      const res = await GETAllContacts();

      return idx(res, (_) => _.data.data);
    } catch (err) {
      console.error(`[GETAllContacts Fetch Error]: ${err}`);
      throw new Error();
    }
  };

  const { data } = useQuery('contacts', fetchData, { initialData: [] });

  const handleToggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation((id) => DELETEContact(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      setIsSuccessful(true);
      setIsOpen(true);
    },
  });

  const handleDeleteContact = (id: number) => () => {
    mutation.mutate(id);
    // const deleteData = async () => {
    //   try {
    //     const res = await DELETEContact(id);
    //     console.log(1, res);

    //     const statusCode = idx(res, (_) => _.data.statusCode);

    //     if (statusCode === 200) {
    //       const newData = data.filter((item) => item.id !== id);
    //     }
    //   } catch (err) {
    //     console.error(`[AnchorMenuM Error]: ${err}`);
    //   }
    // };

    // deleteData();
  };

  const handleSortData = () => {
    const sortData = data.sort(function (a, b) {
      const nameA = a.first_name.toUpperCase();
      const nameB = b.first_name.toUpperCase();

      if (nameA < nameB) {
        return count % 2 === 0 ? -1 : 1;
      }
      if (nameA > nameB) {
        return count % 2 === 1 ? -1 : 1;
      }

      return 0;
    });

    setSortData(sortData);
    setCount((c) => c + 1);
  };

  const dataList = sortData.length ? sortData : data;

  return (
    <section className={style['section']}>
      <h1 className={style['title']}>Contacts</h1>
      <div className={style['sort']} onClick={handleSortData}>
        <p>A</p>
        <p>Z </p>
      </div>
      <div className={style['contacts-wrapper']}>
        {dataList.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            handleDeleteContact={handleDeleteContact(item.id)}
            setIsSuccessful={setIsSuccessful}
            setIsOpen={setIsOpen}
          />
        ))}
      </div>
      {isOpen && (
        <Dialog
          onClose={handleToggleDialog}
          type="delete"
          isSuccessful={isSuccessful}
          setIsSuccessful={setIsSuccessful}
        ></Dialog>
      )}
    </section>
  );
};

export default ContactsList;
