import React from 'react';
import Link from 'next/link';

const Header = (): JSX.Element => (
  <header>
    <Link href="/">
      <a>Contact List</a>
    </Link>
    <nav className="nav">
      <div>Add Contact</div>
    </nav>
  </header>
);

export default Header;
