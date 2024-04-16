import React from 'react'
import { Card } from "primereact/card";
import { Layout } from '../Components/Layout/Layout';

export const DashboardPage = () => {
  let items = [
    { label: 'New', icon: 'pi pi-plus' },
    { label: 'Search', icon: 'pi pi-search' }
];
  return (
    <Layout>
           <Card title="">
            <h1>Hola soy el admin</h1>
            </Card>
            <Card title="">
                <h1>Hola soy el admin</h1>
            </Card>
    </Layout>
  )
}
