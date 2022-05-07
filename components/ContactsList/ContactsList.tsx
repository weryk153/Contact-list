import React, { FC, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import ListItem from '../ListItem/ListItem';
import { User } from '../../interfaces';
import { DELETEContact } from '../../utils/apis';
import Dialog from '../Common/Dialog/Dialog';
import style from './ContactsList.module.scss';

type Props = {
  data: User[];
};

const ContactsList: FC<Props> = ({ data }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

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

  return (
    <section className={style['section']}>
      <h1 className={style['title']}>Contacts</h1>
      <div className={style['contacts-wrapper']}>
        {data.map((item) => (
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
