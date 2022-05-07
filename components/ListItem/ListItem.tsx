import React, { FC } from 'react';
import { User } from '../../interfaces';
import style from './ListItem.module.scss';

type Props = {
  item: User;
};

const ListItem: FC<Props> = ({ item }): JSX.Element => (
  <div className={style['contact-item']}>
    <p>
      {item.first_name} {item.last_name}
    </p>
    <p>Job: {item.job}</p>
    <p>Description: {item.description}</p>
  </div>
);

export default ListItem;
