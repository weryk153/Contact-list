import React, { FC, useState } from 'react';
import Image from 'next/image';
import idx from 'idx';
import { User } from '../../interfaces';
import { PATCHContact } from '../../utils/apis';
import style from './ListItem.module.scss';

type Props = {
  item: User;
  handleDeleteContact: () => void;
  setIsSuccessful: (arg0: boolean) => void;
  setIsOpen: (arg0: boolean) => void;
};

const ListItem: FC<Props> = ({
  item,
  handleDeleteContact,
  setIsSuccessful,
  setIsOpen,
}): JSX.Element => {
  const [isEdit, setIsEdit] = useState(false);
  const [profile, setProfile] = useState(item);

  const handleEditContact = (id: number) => () => {
    const params = {
      info: profile,
    };

    const patchData = async () => {
      try {
        const res = await PATCHContact(profile.id, params);
        const statusCode = idx(res, (_) => _.status);

        if (statusCode === 201) {
          setIsEdit(false);
          setIsSuccessful(true);
          setIsOpen(true);
        }
      } catch (err) {
        console.error(`[patchData Error]: ${err}`);
      }
    };

    patchData();
  };

  const handleSetContact = (e) => {
    const changeName = e.target.name;
    setProfile({
      ...profile,
      [changeName]: e.target.value,
    });
  };

  const handleCancel = () => {
    setIsEdit(false);
    setProfile(item);
  };

  return (
    <div className={style['contact-item']}>
      <div className={style['profile']}>
        <Image src="/profile-icon.png" alt="profile" width={60} height={60} />
        {isEdit ? (
          <div className={style['input-row']}>
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleSetContact}
            ></input>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleSetContact}
            ></input>
          </div>
        ) : (
          <p>
            {profile.first_name} {profile.last_name}
          </p>
        )}
      </div>
      <div className={style['desc']}>
        {isEdit ? (
          <>
            <div className={style['input-row']}>
              Job:{' '}
              <input
                type="text"
                name="job"
                value={profile.job}
                onChange={handleSetContact}
              ></input>
            </div>
            <div className={style['input-row']}>
              Description:{' '}
              <input
                type="text"
                name="description"
                value={profile.description}
                onChange={handleSetContact}
              ></input>
            </div>
          </>
        ) : (
          <>
            <p>Job: {profile.job}</p>
            <p>Description: {profile.description}</p>
          </>
        )}
      </div>
      <div className={style['btn-block']}>
        {isEdit ? (
          <>
            <button
              className={style['btn']}
              onClick={handleEditContact(item.id)}
            >
              confirm
            </button>
            <button className={style['btn']} onClick={handleCancel}>
              cancel
            </button>
          </>
        ) : (
          <>
            <button className={style['btn']} onClick={() => setIsEdit(true)}>
              Edit
            </button>
            <button className={style['btn']} onClick={handleDeleteContact}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ListItem;
