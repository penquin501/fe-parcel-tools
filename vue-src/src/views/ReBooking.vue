<template>
  <div>
    <h1>Re Booking</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณาระบุ Tracking:">
        <el-input v-model="form.tracking" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-s-promotion" @click.prevent="getData">ส่งข้อมูล</el-button>
      </el-form-item>
    </el-form>
    <p style="color: green;">{{ result }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "ResendBilling",
  components: {
  },
  data() {
    return {
      form: {
        tracking: "",
      },
      result: "",
      url: "https://tool.945parcel.com",
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    }
  },
  methods: {
    getData(this: any) {
        this.result == "";
        if (this.form.tracking == "") {
            this.$alert("กรุณาใส่ tracking ให้ถูกต้อง", "", { confirmButtonText: "OK" });
            this.form.tracking = "";
            this.result = "";
        } else {
            var data = {
                "tracking": this.form.tracking.trim()
            };
            
            axios
                .post(this.url + "/resume-booking-to-queue", data, 
                {
                    headers: { 
                        'apikey': 'XbOiHrrpH8aQXObcWj69XAom1b0ac5eda2b', 
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.data.tracking !== undefined) {
                        this.result = "ส่งข้อมูล booking "+ response.data.tracking +" เรียบร้อยแล้ว";
                        this.form.tracking = "";
                    } else {
                        this.$alert("ไม่สามารถส่งข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
                        this.result = "";
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    dateFormat(strDate: Date) {
        return moment(strDate).format("LL HH:mm");
    },
    dateFormatDetail(strDate: Date) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  computed: {
  }
});
</script>

<style>
</style>