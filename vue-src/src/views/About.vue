<template>
  <div class="about">
    <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
      <div style="text-align: center;">
        <h3>Parcel Tools</h3>
      </div>
      <el-submenu index="1">
        <template #title>
          <i class="el-icon-first-aid-kit"></i>
          <span>Tools</span>
        </template>
        <el-menu-item-group title="Parcel Tools">
          <el-menu-item index="1-1"><router-link to="/cancel-bill">ยกเลิก Tracking</router-link></el-menu-item>
          <el-menu-item index="1-2"><router-link to="/cancel-all-bill">ยกเลิก Bill</router-link></el-menu-item>
          <el-menu-item index="1-3"><router-link to="/change-bill-member">เปลี่ยน Member</router-link></el-menu-item>
          <el-menu-item index="1-4"><router-link to="/relabeling">Re-Labeling</router-link></el-menu-item>
          <el-menu-item index="1-5"><router-link to="/list-pending">QL Checker</router-link></el-menu-item>
          <el-menu-item index="1-6"><router-link to="/recal-bill">Re-Cal Billing</router-link></el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Member Tools">
          <el-menu-item index="1-7"><router-link to="/move-member">ย้าย Member ไป Shop อื่น</router-link></el-menu-item>
          <el-menu-item index="1-8"><router-link to="/change-phoneregis">เปลี่ยนเบอร์โทรศัพท์ Member</router-link></el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Courier Checker">
          <el-menu-item index="1-9"><router-link to="/flash-booking-checker">Flash Booking Checker</router-link></el-menu-item>
          <el-menu-item index="1-10"><router-link to="/ninja-booking-checker">Ninja Booking Checker</router-link></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-s-platform"></i>
        <span><router-link to="/list-sender">Key Helper</router-link></span>
      </el-menu-item>
      <el-submenu index="3">
        <template #title>
          <i class="el-icon-document"></i>
          <span>Report</span>
        </template>
        <el-menu-item-group title="Report">
          <el-menu-item index="3-1"><router-link to="/report-billing">Report Billing</router-link></el-menu-item>
          <el-menu-item index="3-2"><router-link to="/report-branch">Report Branch</router-link></el-menu-item>
          <el-menu-item index="3-3"><router-link to="/report-relabel">Report Relabel</router-link></el-menu-item>
          <el-menu-item index="3-4"><router-link to="/report-qlchecker">Report QL Checker</router-link></el-menu-item>
          <el-menu-item index="3-5"><router-link to="/report-tools-log">Report Tools Log</router-link></el-menu-item>
          <el-menu-item index="3-6"><router-link to="/report-capture-monitor">Report Capture Monitor</router-link></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template #title>
          <i class="el-icon-setting"></i>
          <span>Setting</span>
        </template>
        <el-menu-item-group title="Setting">
          <el-menu-item index="4-1"><router-link to="/branchinfo">Branch Info</router-link></el-menu-item>
          <el-menu-item index="4-2"><router-link to="/sizeinfo">Size Info</router-link></el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Super Admin Tools">
          <el-menu-item index="4-3"><router-link to="/tracking-info">Tracking Info</router-link></el-menu-item>
          <el-menu-item index="4-4"><router-link to="/resend-billing">Resend Billing(Step 1)</router-link></el-menu-item>
          <el-menu-item index="4-5"><router-link to="/rebooking">Re Booking(Step 2+3)</router-link></el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="DHL Info">
          <el-menu-item index="4-6"><router-link to="/export-dhl-excel">Export Excel (un-book)</router-link></el-menu-item>
          <el-menu-item index="4-7"><router-link to="/check-dhl-booking-log">DHL Booking Log</router-link></el-menu-item>
          <el-menu-item index="4-8"><router-link to="/list-dhl-token">DHL Token</router-link></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-divider></el-divider>

      <el-menu-item index="5">
        <div style="text-align: center;" @click.prevent="logout">
          <i class="fa fa-sign-out" aria-hidden="true"></i>
          <router-link to="/">Logout</router-link>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import About from '@/views/About.vue';

export default defineComponent({
  name: "App",
  components: {
    About
  },
  data() {
    return {
    };
  },
  mounted: function() {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$router.push({ name: "Home" });
    }
  },
  methods: {
    logout() {
      //@ts-ignore
      this.$store.commit("doLogout");
      window.localStorage.removeItem('vuex');
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
});
</script>
