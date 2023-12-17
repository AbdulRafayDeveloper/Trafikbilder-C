import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDrop,
  cilImagePlus,
  cilVideo,
  cilStorage,
  cilShareBoxed,
  cilSpeedometer,
  // cilStar,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'List of Customers',
    to: '/customer/list',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Subscriptions',
  },
  {
    component: CNavItem,
    name: 'New Subscription',
    to: '/subscription/add',
    icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'List of Subscriptions',
    to: '/subscription/list',
    icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Payment Requests',
  },
  {
    component: CNavItem,
    name: 'Payment Requests',
    to: '/paymentRequest/list',
    icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Categories',
  },
  {
    component: CNavItem,
    name: 'New Category',
    to: '/category/add',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'List of Categories',
    to: '/category/list',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Images',
  },
  {
    component: CNavItem,
    name: 'New Image',
    to: '/image/add',
    icon: <CIcon icon={cilImagePlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'List of Images',
    to: '/image/list',
    icon: <CIcon icon={cilImagePlus} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Videos',
  },
  {
    component: CNavItem,
    name: 'New Video',
    to: '/video/add',
    icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'List of Videos',
    to: '/video/list',
    icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
  },
]

export default _nav
