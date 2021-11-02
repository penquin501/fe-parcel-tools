<template>
  <div>
    <h1>Re-Cal Billing</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form">
      <el-form-item label="อัพโหลดไฟล์ Excel/CSV">
        <input type="file" id="file" ref="file" @change="handleFileUpload($event)"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-upload2" @click.prevent="submitFile">อัพโหลด</el-button>
      </el-form-item>
    </el-form>
    <el-card style="width: 100%">
        <el-descriptions title="" :column="4">
            <el-descriptions-item label="รายการ เลขที่บิลใหม่ (Re-Cal)">
                <el-table :data="listBilling" style="width: 100%" height="500">
                    <el-table-column prop="billingNo" label=""></el-table-column>
                </el-table>
            </el-descriptions-item>
            <el-descriptions-item label="รายการ เลขที่บิลใหม่ (Remain)">
                <el-table :data="listRemainBilling" style="width: 100%" height="500">
                    <el-table-column prop="billingNo" label=""></el-table-column>
                </el-table>
            </el-descriptions-item>
            <el-descriptions-item label="รายการ เลขที่บิล ที่มีปัญหา">
                <el-table :data="listBillingError" style="width: 100%" height="500">
                    <el-table-column prop="billingNo" label=""></el-table-column>
                </el-table>
            </el-descriptions-item>
            <el-descriptions-item label="รายการ Tracking ที่มีปัญหา">
                <el-table :data="listTrackingError" style="width: 100%" height="500">
                    <el-table-column prop="tracking" label=""></el-table-column>
                </el-table>
            </el-descriptions-item>
        </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import XLSX from "xlsx";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "ReCalBill",
  components: {
  },
  data() {
    return {
      file: "",
      dataJson: [],
      listBilling: [],
      listRemainBilling: [],
      listBillingError: [],
      listTrackingError: [],
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
    handleFileUpload(this:any, e: any) {
      var self = this;
      this.file = this.$refs.file.files[0];
      var fileInput = this.$refs.file.value;
      var allowedExtensions = /(\.xls|\.xlsx|\.csv)$/i;

      if (!allowedExtensions.exec(fileInput)) {
        this.$alert("กรุณาเลือกไฟล์ xls/xlsx/csv เท่านั้น", "", { confirmButtonText: "OK" });
        fileInput.value = "";
        return false;
      }
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e: any) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: "binary"
        });
        workbook.SheetNames.forEach(function(sheetName) {
          var XL_row_object = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );
          self.dataJson = XL_row_object;
        });
      };
      reader.readAsBinaryString(file);
    },
    submitFile(this: any) {
      var moduleName = "recal_billing";
      var data = {
        user: this.$store.state.userInfo.name,
        moduleName: moduleName,
        resultsFile: this.dataJson
      };

      axios
        .post(this.url + "/tools/recal-billing", data)
        .then(response => {
          if (response.data.status == "SUCCESS") {
            this.listBilling = response.data.listBilling;
            this.listRemainBilling = response.data.listRemainBilling;
            this.listBillingError = response.data.listBillingError;
            this.listTrackingError = response.data.listTrackingError;
          } else if(response.data.status == "ERROR_NO_DATA_TO_RECAL_BILLING") {
            this.listBilling = response.data.listBilling;
            this.listRemainBilling = response.data.listRemainBilling;
            this.listBillingError = response.data.listBillingError;
            this.listTrackingError = response.data.listTrackingError;
          } else {
            this.$alert("ไม่สามารถ re-cal billing ได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
            this.dataJson = [];
          }
        })
        .catch(function(error) {
          /* eslint-disable */
          console.log(error);
          /* eslint-disable */
        })
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