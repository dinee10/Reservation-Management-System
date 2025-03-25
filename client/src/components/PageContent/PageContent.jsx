import { ProductOutlined, ShopOutlined , FileWordOutlined, UserOutlined  } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import React from 'react'
import SummaryCard from '../SummaryCard/SummaryCard'


function PageContent() {
    return (
        <div className='PageContent'>
            <Space size={30} direction='vertical'>
                <Typography.Title level={4}>Dashboard Overview</Typography.Title>
                <Space size={50} direction='horizontal'>
                    <SummaryCard icon={<UserOutlined d style={{ color: "purple", fontSize: 40 }} />} title={"Bookings"} value={"100"} />
                    <SummaryCard icon={<ProductOutlined style={{ color: "green", fontSize: 40 }} />} title={"Activities"} value={"100"} />
                    <SummaryCard icon={<ShopOutlined style={{ color: "lightblue", fontSize: 40 }} />} title={"Rooms"} value={"2323"} />
                    <SummaryCard icon={<FileWordOutlined style={{ color: "red", fontSize: 40 }} />} title={"Blogs"} value={"454"} />
                    
                </Space>
            </Space>
        </div>
    )
}



export default PageContent;