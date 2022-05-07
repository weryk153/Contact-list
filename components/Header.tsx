import React from 'react';
import Link from 'next/link';
import ContactAddBtn from './ContactAddBtn/ContactAddBtn';

const Header = (): JSX.Element => {
  return (
    <header>
      <Link href="/">
        <a>Contact List</a>
      </Link>
      <ContactAddBtn />
    </header>
  );
};

export default Header;
