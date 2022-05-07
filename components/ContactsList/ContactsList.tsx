import React, { FC } from 'react';
import ListItem from '../ListItem/ListItem';
import { User } from '../../interfaces';
import style from './ContactsList.module.scss';

type Props = {
  items: User[];
};

const List: FC<Props> = ({ items }): JSX.Element => (
  <section className={style['section']}>
    <h1>Contacts</h1>
    <div className={style['contacts-wrapper']}>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  </section>
);

export default List;
