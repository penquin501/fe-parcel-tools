import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

export default createStore({
  state: {
    is_login: false,
    userInfo: null,
    phoneNumber: "",
    priority: 0,
    report_billing_no: "",
    report_capture_monitor: {
      memberId: "",
      phoneNumber: "",
      memberName: "",
      dateSelect: ""
    },
    qlchecker: {
      tracking: ""
    },
    qlchecker_previous_value: "",
    relabel_previous_value: "",
    flash_booking_tracking: {
      tracking: "",
      reason_code: ""
    },
    flash_previous_value: "",
    ninja_booking_tracking: {
      tracking: ""
    },
    ninja_previous_value: "",
    size_info: {
      size_id: 0
    }
  },
  mutations: {
    doLogin(state, data) {
      state.is_login = true,
      state.userInfo = data
    },
    phoneNumber(state, data) {
      state.phoneNumber = data.phoneNumber,
      state.priority = parseInt(data.priority)
    },
    reportBilling(state, data) {
      state.report_billing_no = data.billing_no
    },
    reportCaptureMonitor(state, data) {
      state.report_capture_monitor.memberId = data.memberId,
      state.report_capture_monitor.phoneNumber = data.phoneNumber,
      state.report_capture_monitor.memberName = data.memberName,
      state.report_capture_monitor.dateSelect = data.dateSelect
    },
    qlchecker(state, data) {
      state.qlchecker.tracking = data.tracking
    },
    qlcheckerPreviousValue(state, data) {
      state.qlchecker_previous_value = data
    },
    qlcheckerPreviousValueClear(state) {
      state.qlchecker_previous_value = ""
    },
    relabelPreviousValue(state, data) {
      state.relabel_previous_value = data
    },
    relabelPreviousValueClear(state) {
      state.relabel_previous_value = ""
    },
    flashBooking(state, data) {
      state.flash_booking_tracking.tracking = data.tracking,
      state.flash_booking_tracking.reason_code = data.reason_code
    },
    flashCheckerPreviousValue(state, data) {
      state.flash_previous_value = data
    },
    flashCheckerPreviousValueClear(state) {
      state.flash_previous_value = ""
    },
    ninjaBooking(state, data) {
      state.ninja_booking_tracking.tracking = data.tracking
    },
    ninjaCheckerPreviousValue(state, data) {
      state.ninja_previous_value = data
    },
    ninjaCheckerPreviousValueClear(state) {
      state.ninja_previous_value = ""
    },
    editSizeInfo(state, data) {
      state.size_info = data
    },
    doLogout(state) {
      state.is_login = false,
      state.userInfo = null,
      state.phoneNumber = "",
      state.priority = 0,
      state.report_billing_no = "",
      state.report_capture_monitor.memberId = "",
      state.report_capture_monitor.phoneNumber = "",
      state.report_capture_monitor.memberName = "",
      state.report_capture_monitor.dateSelect = "",
      state.qlchecker.tracking = "",
      state.qlchecker_previous_value = "",
      state.relabel_previous_value = "",
      state.flash_booking_tracking.tracking = "",
      state.flash_booking_tracking.reason_code = "",
      state.flash_previous_value = "",
      state.ninja_booking_tracking.tracking = "",
      state.ninja_previous_value = "",
      state.size_info.size_id = 0
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [new VuexPersistence().plugin]
})
