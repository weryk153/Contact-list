import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { POSTAddContact } from '../../utils/apis';
import Dialog from '../Common/Dialog/Dialog';
import style from './ContactAddBtn.module.scss';

type Props = {
  firstName: string;
  lastName: string;
  job: string;
  description: string;
};

const initialState = {
  firstName: '',
  lastName: '',
  job: '',
  description: '',
};

const inputs = [
  {
    display: 'First Name:',
    inputName: 'firstName',
  },
  {
    display: 'Last Name:',
    inputName: 'lastName',
  },
  {
    display: 'Job:',
    inputName: 'job',
  },
  {
    display: 'Description:',
    inputName: 'description',
  },
];

const ContactAddBtn = (): JSX.Element => {
  const [data, setData] = useState<Props>(initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation((param) => POSTAddContact(param), {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      setIsSuccessful(true);
      setData(initialState);
    },
  });

  const handleAddContact = () => {
    const param = {
      contact: {
        first_name: data.firstName,
        last_name: data.lastName,
        job: data.job,
        description: data.description,
      },
    };

    if (data.firstName !== '') {
      mutation.mutate(param);
    }
  };

  const handleSetContact = (e) => {
    const changeName = e.target.name;
    setData({
      ...data,
      [changeName]: e.target.value,
    });
  };

  const handleToggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const renderContent = () => (
    <>
      {inputs.map((item) => (
        <div key={item.inputName} className={style['text-field']}>
          <p>{item.display}</p>
          <input
            type="text"
            name={item.inputName}
            value={data[item.inputName]}
            onChange={(e) => handleSetContact(e)}
          />
        </div>
      ))}
      <button onClick={handleAddContact}>confirm</button>
    </>
  );

  return (
    <>
      <div onClick={handleToggleDialog}>Add Contact</div>
      {isOpen && (
        <Dialog
          onClose={handleToggleDialog}
          type="add"
          isSuccessful={isSuccessful}
          setIsSuccessful={setIsSuccessful}
        >
          {renderContent()}
        </Dialog>
      )}
    </>
  );
};

export default ContactAddBtn;
