import React from 'react'
import { Menu } from 'primereact/menu';
import { Navbar } from '../Navbar';

export const DashboardPage = () => {
  let items = [
    { label: 'New', icon: 'pi pi-plus' },
    { label: 'Search', icon: 'pi pi-search' }
];
  return (
    <>
    <Menu model={items} />
    <Navbar />
    </>
    
  )
}
