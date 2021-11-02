<template>
  <div>
    <h1>ยกเลิก Tracking</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณากรอกเลขที่บิล">
        <el-input v-model="form.billingNo" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click.prevent="getData">ค้นหา</el-button>
      </el-form-item>
    </el-form>
    <el-card style="width: 100%">
      <el-descriptions title="ข้อมูลบิล">
        <el-descriptions-item label="เลขที่บิล: ">{{ billingInfo.billing_no }}</el-descriptions-item>
        <el-descriptions-item label="วันที่: ">{{ billingInfo.billing_date == undefined ? "" : dateFormat(billingInfo.billing_date) }}</el-descriptions-item>
        <el-descriptions-item label="สาขา: ">{{ billingInfo.branch_name }}</el-descriptions-item>
        <el-descriptions-item label="ชื่อผู้ส่ง: ">{{ sender_name }}</el-descriptions-item>
        <el-descriptions-item label="จำนวนรายการ: ">{{ billingItem.length }}</el-descriptions-item>
        <el-descriptions-item label="ยอดรวมค่าส่ง: ">{{ billingInfo.total }}</el-descriptions-item>
        <el-descriptions-item label="สถานะ">
          <span v-if="billingInfo.status == 'complete'">สาขาทำรายการเข้าระบบ</span>
          <span v-else-if="billingInfo.status == 'checking'">ข้อมูลกำลังถูกส่งไปยัง บ. ขนส่ง</span>
          <span v-else-if="billingInfo.status == 'booked'">ข้อมูลถูกส่งไปยัง บ. ขนส่ง ทั้งหมดแล้ว</span>
          <span v-else-if="billingInfo.status == 'cancel'">ข้อมูลถูกยกเลิกแล้ว</span>
          <span v-else-if="billingInfo.status == 'pass'">server หลัก กำลังบันทึกข้อมูล</span>
          <span v-else></span>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 20px;"></div>
      <el-table ref="multipleTable" :data="billingItem" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="tracking" label="Tracking"></el-table-column>
        <el-table-column prop="alias_size" label="ขนาดพัสดุ"></el-table-column>
        <el-table-column prop="size_price" label="ราคาพัสดุ"></el-table-column>
        <el-table-column prop="parcel_type" label="ประเภทพัสดุ"></el-table-column>
        <el-table-column prop="cod_value" label="ยอด COD"></el-table-column>
        <el-table-column prop="receiver_name" label="ชื่อผู้รับ"></el-table-column>
        <el-table-column prop="phone" label="เบอร์ผู้รับ"></el-table-column>
        <el-table-column prop="status" label="สถานะ"></el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 20px;"></div>
    <el-form ref="form" :model="formConfirm" label-width="300px">
      <el-form-item label="เหตุผล">
        <el-select v-model="formConfirm.reason" placeholder="เลือกเหตุผล">
          <el-option label="เลือก size พัสดุผิด" value="wrong_size"></el-option>
          <el-option label="เลือกประเภทการจัดส่งผิด" value="wrong_type"></el-option>
          <el-option label="ยอด COD ผิด" value="wrong_codvalue"></el-option>
          <el-option label="ทำรายการผิด member" value="wrong_member"></el-option>
          <el-option label="ข้อมูลผู้รับผิด" value="wrong_receiver_info"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="รายละเอียดเพิ่มเติม">
        <el-input type="textarea" :rows="3" placeholder="" v-model="formConfirm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="confirmData">บันทึก</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "CancelBill",
  components: {
  },
  data() {
    return {
      form: {
        billingNo: "",
      },
      formConfirm: {
        reason: "",
        remark: ""
      },
      billingItem: [],
      responseData: {},
      billingInfo: {},
      selectItem: [],

      sender_name: "",
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
      if (this.form.billingNo == "") {
        this.$alert("กรุณาใส่เลขที่บิลให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        axios.get(this.url + "/check/info/billing?billing=" + this.form.billingNo.trim())
          .then(response => {
            if (response.data.status == "SUCCESS") {
              this.responseData = response.data.data;
              this.billingInfo = this.responseData.billing;
              this.billingItem = this.responseData.billingItem;
              this.sender_name = this.billingItem[0].sender_name;
            } else {
              this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
              this.responseData = {};
              this.billingInfo = {};
              this.billingItem = [];
              this.sender_name = "";
              this.selectItem = [];
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    handleSelectionChange(val: any) {
      this.selectItem = val;
    },
    confirmData(this:any) {
      if (this.billingInfo.billing_no == undefined) {
        this.$alert("กรุณาระบุเลขที่บิลเพื่อทำรายการ", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.status == "cancel") {
        this.$alert("รายการนี้ได้ถูกยกเลิกไปแล้ว", "", { confirmButtonText: "OK" });
      } else if (this.selectItem.length <= 0) {
        this.$alert("กรุณาเลือกรายการที่ต้องการยกเลิก", "", { confirmButtonText: "OK" });
      } else if (this.formConfirm.reason == "") {
        this.$alert("กรุณาระบุ เหตุผล", "", { confirmButtonText: "OK" });
      } else if (this.formConfirm.remark.trim() == "") {
        this.$alert("กรุณากรอกรายละเอียดเพิ่มเติม ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.formConfirm.remark.length < 25) {
        this.$alert("กรุณากรอกรายละเอียดเพิ่มเติม ให้ชัดเจน", "", { confirmButtonText: "OK" });
      } else {
        let moduleName = this.selectItem.length == this.billingItem.length ? "cancel_billing" : "cancel_tracking";

        var dataConfirm = {
          billingNo: this.billingInfo.billing_no,
          billingInfo: this.responseData,
          billingStatus: this.billingInfo.status,
          selectItem: this.selectItem,
          currentMember: {
            memberCode: this.billingInfo.member_code,
            senderName: this.billingItem[0].sender_name,
            senderPhone: this.billingItem[0].sender_phone,
            senderAddress: this.billingItem[0].sender_address
          },
          reason: this.formConfirm.reason,
          remark: this.formConfirm.remark,
          user: this.$store.state.userInfo.name,
          moduleName: moduleName
        };
        // console.log(JSON.stringify(dataConfirm));
        axios.post(this.url + "/tools/void-billing", dataConfirm)
          .then(response => {
            if (response.data.status == "SUCCESS") {
              if (response.data.billingNo !== undefined) {
                if(response.data.billingNo !== ""){
                  this.$confirm("เลขที่บิลใหม่..." + response.data.billingNo, 'รายการที่คุณเลือกได้ถูกยกเลิกแล้ว', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'success' }).then(() => {
                    this.responseData = {};
                    this.billingInfo = {};
                    this.billingItem = [];
                    this.sender_name = "";
                    this.selectItem = [];
                    this.$router.push({ name: "Home" });
                  }).catch((error: any) => {
                    console.log("confirm error", error);
                  });
                } else {
                  this.$alert("ยกเลิกรายการทั้งหมดแล้ว", "", { confirmButtonText: "OK" });
                  this.responseData = {};
                  this.billingInfo = {};
                  this.billingItem = [];
                  this.sender_name = "";
                  this.selectItem = [];
                  this.$router.push({ name: "Home" });
                }
              } else {
                this.$alert("ไม่สามารถยกเลิกรายการได้ เนื่องจาก..." + response.data, "", { confirmButtonText: "OK" });
                this.responseData = {};
                this.billingInfo = {};
                this.billingItem = [];
                this.sender_name = "";
                this.selectItem = [];
                this.$router.push({ name: "Home" });
              }
            } else {
              this.$alert("ไม่สามารถยกเลิกรายการได้ เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
                this.responseData = {};
                this.billingInfo = {};
                this.billingItem = [];
                this.sender_name = "";
                this.selectItem = [];
                this.$router.push({ name: "Home" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    dateFormat(strDate: any) {
      return moment(strDate).format("LL HH:mm");
    },
  },
  computed: {
  }
});
</script>

<style>
</style>