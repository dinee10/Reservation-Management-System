import React from 'react'
import { Space } from 'antd'
import Navbar from '../../components/NavbarAdmin/Navbar'
import SideMenu from '../../components/SideMenu/Sidemenu'
import PageContent from '../../components/PageContent/PageContent'

import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div 
      className='App' 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {/* Header section */}
      <header style={{ 
        margin: '20px 20px 100px 20px',
        width: 'calc(100% - 40px)' 
      }}>
        <Navbar />
      </header>

      {/* Main content section */}
      <main 
        style={{ 
          margin: '20px',
          padding: '20px',
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          flex: 1,
          width: 'calc(100% - 40px)'
        }}
      >
        <Space 
          className="SideMenuAndPageContent"
          style={{ 
            width: '100%',
            display: 'flex'
          }}
        >
          <SideMenu />
          <PageContent />
          <Outlet />
        </Space>
      </main>
     

      
    </div>
  )
}

export default Dashboard;