import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import CancelBill from '../views/CancelBill.vue'
import CancelAllBill from '../views/CancelAllBill.vue'
import ChangeBillMember from '../views/ChangeBillMember.vue'

import ReLabel from '../views/ReLabel.vue'
import ListPending from '../views/ListPending.vue'
import ConfirmQLChecker from '../views/ConfirmQLChecker.vue'
import ReCalBill from '../views/ReCalBill.vue'

import MoveMember from '../views/MoveMember.vue'
import ChangePhoneRegis from '../views/ChangePhoneregis.vue'

import FlashBookingChecker from '../views/FlashBookingChecker.vue'
import FlashBookingDetail from '../views/FlashBookingDetail.vue'
import NinjaBookingChecker from '../views/NinjaBookingChecker.vue'
import NinjaBookingDetail from '../views/NinjaBookingDetail.vue'

import ListSender from '../views/ListSender.vue'
import ListNotKey from '../views/ListNotKey.vue'

import ReportBilling from '../views/ReportBilling.vue'
import ReportBillingDetail from '../views/ReportBillingDetail.vue'
import ReportBranch from '../views/ReportBranch.vue'
import ReportRelabel from '../views/ReportRelabel.vue'
import ReportQLChecker from '../views/ReportQLChecker.vue'
import ReportToolsLog from '../views/ReportToolsLog.vue'
import ReportCaptureMonitor from '../views/ReportCaptureMonitor.vue'
import ListCaptureInfo from '../views/ListCaptureInfo.vue'

import BranchInfo from '../views/BranchInfo.vue'
import SizeInfo from '../views/SizeInfo.vue'
import EditSize from '../views/EditSize.vue'

import TrackingInfo from '../views/TrackingInfo.vue'
import ResendBilling from '../views/ResendBilling.vue'
import ReBooking from '../views/ReBooking.vue'

import ExportDHLExcel from '../views/ExportDHLExcel.vue'
import CheckBookingLog from '../views/CheckBookingLog.vue'
import ListDHLToken from '../views/ListDHLToken.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cancel-bill',
    name: 'CancelBill',
    component: CancelBill
  },
  {
    path: '/cancel-all-bill',
    name: 'CancelAllBill',
    component: CancelAllBill
  },
  {
    path: '/change-bill-member',
    name: 'ChangeBillMember',
    component: ChangeBillMember
  },
  {
    path: '/relabeling',
    name: 'ReLabel',
    component: ReLabel
  },
  {
    path: '/list-pending',
    name: 'ListPending',
    component: ListPending
  },
  {
    path: '/confirm-qlchecker',
    name: 'ConfirmQLChecker',
    component: ConfirmQLChecker
  },
  {
    path: '/recal-bill',
    name: 'ReCalBill',
    component: ReCalBill
  },
  {
    path: '/list-sender',
    name: 'ListSender',
    component: ListSender
  },
  {
    path: '/list-notkey',
    name: 'ListNotKey',
    component: ListNotKey
  },
  {
    path: '/report-billing',
    name: 'ReportBilling',
    component: ReportBilling
  },
  {
    path: '/report-billing-detail',
    name: 'ReportBillingDetail',
    component: ReportBillingDetail
  },
  {
    path: '/report-branch',
    name: 'ReportBranch',
    component: ReportBranch
  },
  {
    path: '/report-relabel',
    name: 'ReportRelabel',
    component: ReportRelabel
  },
  {
    path: '/report-qlchecker',
    name: 'ReportQLChecker',
    component: ReportQLChecker
  },
  {
    path: '/report-tools-log',
    name: 'ReportToolsLog',
    component: ReportToolsLog
  },
  {
    path: '/report-capture-monitor',
    name: 'ReportCaptureMonitor',
    component: ReportCaptureMonitor
  },
  {
    path: '/list-capture-info',
    name: 'ListCaptureInfo',
    component: ListCaptureInfo
  },
  {
    path: '/move-member',
    name: 'MoveMember',
    component: MoveMember
  },
  {
    path: '/change-phoneregis',
    name: 'ChangePhoneRegis',
    component: ChangePhoneRegis
  },
  {
    path: '/flash-booking-checker',
    name: 'FlashBookingChecker',
    component: FlashBookingChecker
  },
  {
    path: '/flash-booking-detail',
    name: 'FlashBookingDetail',
    component: FlashBookingDetail
  },
  {
    path: '/ninja-booking-checker',
    name: 'NinjaBookingChecker',
    component: NinjaBookingChecker
  },
  {
    path: '/ninja-booking-detail',
    name: 'NinjaBookingDetail',
    component: NinjaBookingDetail
  },
  {
    path: '/branchinfo',
    name: 'BranchInfo',
    component: BranchInfo
  },
  {
    path: '/sizeinfo',
    name: 'SizeInfo',
    component: SizeInfo
  },
  {
    path: '/edit-size-info',
    name: 'EditSize',
    component: EditSize
  },
  {
    path: '/tracking-info',
    name: 'TrackingInfo',
    component: TrackingInfo
  },
  {
    path: '/resend-billing',
    name: 'ResendBilling',
    component: ResendBilling
  },
  {
    path: '/rebooking',
    name: 'ReBooking',
    component: ReBooking
  },
  {
    path: '/export-dhl-excel',
    name: 'ExportDHLExcel',
    component: ExportDHLExcel
  },
  {
    path: '/check-dhl-booking-log',
    name: 'CheckBookingLog',
    component: CheckBookingLog
  },
  {
    path: '/list-dhl-token',
    name: 'ListDHLToken',
    component: ListDHLToken
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory('/admin/'),
  routes
})

export default router
