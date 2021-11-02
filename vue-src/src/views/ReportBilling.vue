<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="เลือกวันที่">
        <el-date-picker type="date" placeholder="Pick a date" @change="getlistBilling()" v-model="form.selectDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="ค้นหา Billing">
        <el-input v-model="form.billingNo" maxlength="50" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getlistBilling">Refresh</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
        <el-form-item label="เลือกสาขา">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all</el-checkbox>
            <el-checkbox-group v-model="checked" @change="handleCheckedChange">
              <el-checkbox v-for="item in form.branch" :label="item" :key="item.id">{{ item }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-form>
    <h1>รายการบิลประจำวัน: {{ dateFormat(form.selectDate) }}</h1>
    <el-card style="width: 100%">
      <el-descriptions title="" :column="3">
          <el-descriptions-item label="จำนวน DHL ยังไม่ได้ book: ">{{ summary.c_dhlNotBook }}</el-descriptions-item>
          <el-descriptions-item label="จำนวนที่ book DHL แล้ว: ">{{ summary.c_dhlBooked }}</el-descriptions-item>
          <el-descriptions-item label="ทั้งหมด: ">{{ summary.total }}</el-descriptions-item>
          <el-descriptions-item label="จำนวน Flash ยังไม่ได้ book: ">{{ summary.c_flashNotBook }}</el-descriptions-item>
          <el-descriptions-item label="จำนวนที่ book Flash แล้ว: ">{{ summary.c_flashBooked }}</el-descriptions-item>
          <el-descriptions-item label="ทั้งหมด: ">{{ summary.total }}</el-descriptions-item>
          <el-descriptions-item label="จำนวน Ninja ยังไม่ได้ book: ">{{ summary.c_ninjaNotBook }}</el-descriptions-item>
          <el-descriptions-item label="จำนวนที่ book Ninja แล้ว: ">{{ summary.c_ninjaBooked }}</el-descriptions-item>
          <el-descriptions-item label="ทั้งหมด: ">{{ summary.total }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <div style="margin-top: 20px;"></div>
    <el-table :data="filteredResources" style="width: 100%" height="500" :default-sort="{prop: 'branch_id', order: 'ascending'}">
      <el-table-column prop="branch_id" sortable label="ชื่อสาขา" width="120">
        <template #default="scope">
            <span>{{ scope.row.branch_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billing_no" label="เลขที่บิล">
        <template #default="scope">
            <span>{{ scope.row.billing_no }}</span>
            <span style="color: red; font-size: 10px;">&nbsp;&nbsp;{{ dateFromNow(scope.row.billing_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sender_name" label="ชื่อผู้ส่ง"></el-table-column>
      <el-table-column prop="flash_cNotBook" sortable label="จำนวน flash" width="120">
        <template #default="scope">
          <span v-if="parseInt(scope.row.flash_cNotBook) !== 0" style="color: red;">{{ scope.row.flash_cNotBook }}/{{ scope.row.total }}</span>
          <span v-else>{{ scope.row.flash_cNotBook }}/{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dhl_cNotBook" sortable label="จำนวน dhl" width="120">
        <template #default="scope">
          <span v-if="parseInt(scope.row.dhl_cNotBook) !== 0" style="color: red;">{{ scope.row.dhl_cNotBook }}/{{ scope.row.total }}</span>
          <span v-else>{{ scope.row.dhl_cNotBook }}/{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ninja_cNotBook" sortable label="จำนวน ninja" width="120">
        <template #default="scope">
          <span v-if="parseInt(scope.row.ninja_cNotBook) !== 0" style="color: red;">{{ scope.row.ninja_cNotBook }}/{{ scope.row.total }}</span>
          <span v-else>{{ scope.row.ninja_cNotBook }}/{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="สถานะ"></el-table-column>
      <el-table-column fixed="right" label="Detail" width="80" align="center">
        <template #default="scope">
          <el-button @click.prevent="setStore(scope.row)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "ReportBilling",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      listBilling: [],
      form: {
        billingNo: "",
        branch: [],
        selectDate: moment().format("YYYY-MM-DD")
      },
      checked: [],
      checkAll: true,
      isIndeterminate: false,
      summary: {},
      sorting: -1,
      url: "https://tool.945parcel.com",
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    } else {
      this.getlistBilling();
    }
  },
  methods: {
    getlistBilling(this: any) {
      this.getSummary();
      this.listBilling = [];
      axios
        .get(this.url + "/daily-report?date_check=" + this.form.selectDate)
        .then(response => {
          if (response.data.length === 0) {
            //@ts-ignore
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.listBilling = [];
          } else {
            // this.listBilling = response.data.result;
            var result = response.data.result;
            this.form.branch = [];
            var branchInfo: { [key: string]: any } = {};
            for (let item of result) {
              if (!(item.branch_id in branchInfo)) {
                branchInfo[String(item.branch_id)] = [];
              }
              branchInfo[String(item.branch_id)].push(item);
            }
            for (const [key, value] of Object.entries(branchInfo)) {
              this.form.branch.push(value[0].branch_name);
            }
            this.checked = this.checkAll ? this.form.branch : this.checked;
            if(this.checked.length == 0) {
              this.listBilling = [];
            } else {
              for (let item of result) {
                for (let selectedBranch of this.checked) {
                  if (item.branch_name == selectedBranch) {
                    this.listBilling.push(item);
                  }
                }
              }
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getSummary(this: any) {
      axios
        .get(this.url + "/summary-booking?date_check=" + this.form.selectDate)
        .then(response => {
          if (response.data.length == 0) {
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.summary = {};
          } else {
            this.summary = response.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleCheckAllChange(val: any) {
      this.checked = val ? this.form.branch : [];
      this.isIndeterminate = false;
      this.getlistBilling();
    },
    handleCheckedChange(value: any) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.form.branch.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.form.branch.length;
      this.getlistBilling();
    },
    dateFromNow(strDate: any) {
        return moment(strDate).fromNow();
    },
    dateFormat(strDate: any) {
        return moment(strDate).format("LL");
    },
    setStore(row: any) {
      //@ts-ignore
      this.$store.commit("reportBilling", row);
      this.$router.push({ name: "ReportBillingDetail" });
    },
  },
  computed: {
    filteredResources(this: any) {
      if (this.form.billingNo) {
        return this.listBilling.filter((item: any) => !this.form.billingNo || item.billing_no.toLowerCase().includes(this.form.billingNo.toLowerCase()));
      } else {
        return this.listBilling.slice(0).sort((a: any, b: any) => a.branch_id < b.branch_id ? this.sorting : -this.sorting);
      }
    }
  }
});
</script>

<style>
</style>