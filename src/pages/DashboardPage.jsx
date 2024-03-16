import React from 'react'
import { Menu } from 'primereact/menu';

export const DashboardPage = () => {
  let items = [
    { label: 'New', icon: 'pi pi-plus' },
    { label: 'Search', icon: 'pi pi-search' }
];
  return (
    <Menu model={items} />
    
  )
}
