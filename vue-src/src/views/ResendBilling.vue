<template>
  <div>
    <h1>Resend Billing(Step 1)</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณาระบุ เลขที่บิล:">
        <el-input v-model="form.billing_no" maxlength="30" clearable></el-input>
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
        billing_no: "",
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
        if (this.form.billing_no == "") {
            this.$alert("กรุณาใส่ เลขที่บิล ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else {
            var data = {
                "billing_no": this.form.billing_no.trim(),
                "reason": "data_not_reach",
                "remark": "แจ้งจากทาง support ว่าฝั่งserver ไม่ได้รับข้อมูล",
                "user": this.$store.state.userInfo.name,
            };
            
            axios
                .post(this.url + "/resend-bill-to-queue", data, 
                {
                    headers: { 
                        'apikey': 'XbOiHrrpH8aQXObcWj69XAom1b0ac5eda2b', 
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.data.billing_no !== undefined) {
                        this.result = "ส่งข้อมูลบิล(step 1) "+ response.data.billing_no +" เรียบร้อยแล้ว";
                        this.form.billing_no = "";
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