import React, { FC } from 'react';
import Image from 'next/image';
import { User } from '../../interfaces';
import style from './ListItem.module.scss';

type Props = {
  item: User;
};

const ListItem: FC<Props> = ({ item }): JSX.Element => (
  <div className={style['contact-item']}>
    <div className={style['profile']}>
      <Image src="/profile-icon.png" alt="profile" width={60} height={60} />
      <p>
        {item.first_name} {item.last_name}
      </p>
    </div>
    <div className={style['desc']}>
      <p>Job: {item.job}</p>
      <p>Description: {item.description}</p>
    </div>
    <div className={style['btn-block']}>
      <button className={style['btn']}>Edit</button>
      <button className={style['btn']}>Delete</button>
    </div>
  </div>
);

export default ListItem;
