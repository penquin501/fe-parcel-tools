<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="ค้นหา Tracking">
        <el-input v-model="form.tracking" maxlength="20" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click.prevent="getData">Refresh</el-button>
      </el-form-item>
    </el-form>
    <p>เลขที่บิล: {{ $store.state.report_billing_no }}</p>
    <el-table :data="filteredResources" style="width: 100%" height="500" :row-class-name="tableRowClassName">
            <el-table-column type="expand">
                <template #default="props">
                    <p v-if="props.row.receiverInfo.receiver_name == '' || props.row.receiverInfo.receiver_name == null" style="color: red;">ชื่อผู้รับ: {{ props.row.receiverInfo.receiver_name }}</p>
                    <p v-else>ชื่อผู้รับ: {{ props.row.receiverInfo.receiver_name }}</p>

                    <p v-if="props.row.receiverInfo.phone == '' || props.row.receiverInfo.phone == null" style="color: red;">เบอร์ผู้รับ: {{ props.row.receiverInfo.phone }}</p>
                    <p v-else>ชื่อผู้รับ: {{ props.row.receiverInfo.phone }}</p>

                    <p v-if="props.row.receiverInfo.receiver_address == '' || props.row.receiverInfo.receiver_address == null" style="color: red;">
                      ที่อยู่ผู้รับ: {{ props.row.receiverInfo.receiver_address }} {{ props.row.receiverInfo.district_name }} {{ props.row.receiverInfo.amphur_name }} {{ props.row.receiverInfo.province_name }}
                    </p>
                    <p v-else>ที่อยู่ผู้รับ: {{ props.row.receiverInfo.receiver_address }} {{ props.row.receiverInfo.district_name }} {{ props.row.receiverInfo.amphur_name }} {{ props.row.receiverInfo.province_name }}</p>
                    
                    <p>
                      <span v-if="props.row.receiverInfo.receiver_name == '' || props.row.receiverInfo.receiver_name == null"><el-tag type="warning">ไม่มีชื่อผู้รับ</el-tag></span>
                      <span v-if="props.row.receiverInfo.phone == '' || props.row.receiverInfo.phone == null"><el-tag type="warning">ไม่มีเบอร์ผู้รับ</el-tag></span>
                      <span v-if="props.row.receiverInfo.receiver_address == '' || props.row.receiverInfo.receiver_address == null"><el-tag type="warning">ไม่มีที่อยู่ผู้รับ</el-tag></span>
                      <span v-if="props.row.matchSenderZipcode !== -1 && props.row.receiverInfo.status !== 'booked'"><el-tag type="warning">zipcode ผู้ส่ง/ผู้รับตรงกัน</el-tag></span>

                      <span v-if="props.row.bi_parcel_type !== props.row.receiverInfo.parcel_type"><el-tag type="danger">ประเภทรายการไม่ตรงกัน</el-tag></span>
                      <span v-if="props.row.bi_zipcode !== props.row.receiverInfo.zipcode"><el-tag type="danger">zipcode ไม่ตรงกัน</el-tag></span>
                      <span v-if="props.row.receiverInfo.sender_phone == props.row.receiverInfo.phone"><el-tag type="danger">เบอร์ผู้ส่ง/ผู้รับตรงกัน/</el-tag></span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column fixed label="เลขที่พัสดุ" width="120">
                <template #default="scope">
                    <span v-if="scope.row.receiverInfo.booking_status==100">{{ scope.row.tracking }}</span>
                    <span style="color: blue;" v-else>
                        <a @click.prevent="getTracking(scope.$index, scope.row)">{{ scope.row.tracking }}</a>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="ขนาด/ราคา" width="90">
                <template #default="scope">
                    <span>{{ scope.row.alias_size }}/{{ scope.row.size_price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="ประเภท(QL/KI)" width="150">
                <template #default="scope">
                    <span v-if="scope.row.bi_parcel_type==scope.row.receiverInfo.parcel_type">{{ scope.row.bi_parcel_type }}/{{ scope.row.receiverInfo.parcel_type }}</span>
                    <span v-else style="color: red;">{{ scope.row.bi_parcel_type }}/{{ scope.row.receiverInfo.parcel_type }}</span>
                </template>
            </el-table-column>
            <el-table-column label="รหัสไปรษณีย์(QL/KI)" width="150">
                <template #default="scope">
                    <span v-if="scope.row.matchSenderZipcode !== -1 && scope.row.receiverInfo.status !== 'booked'" style="color: orange;">{{ scope.row.bi_zipcode }}/{{ scope.row.receiverInfo.zipcode }}</span>
                    <span v-else-if="scope.row.bi_zipcode !== scope.row.receiverInfo.zipcode" style="color: red;">{{ scope.row.bi_zipcode }}/{{ scope.row.receiverInfo.zipcode }}</span>
                    <span v-else>{{ scope.row.bi_zipcode }}/{{ scope.row.receiverInfo.zipcode }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cod_value" label="มูลค่า COD" width="90"></el-table-column>
            <el-table-column prop="receiverInfo.status" label="สถานะ" width="80"></el-table-column>
            <el-table-column label="วัน/เวลา DHL booking" width="170">
                <template #default="scope">
                    <span>{{ scope.row.receiverInfo.booking_date == null ? "" : dateFormat(scope.row.receiverInfo.booking_date) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="วัน/เวลา Flash booking" width="170">
                <template #default="scope">
                    <span>{{ scope.row.receiverInfo.booking_flash_date == null ? "" : dateFormat(scope.row.receiverInfo.booking_flash_date) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="วัน/เวลา Ninja booking" width="170">
                <template #default="scope">
                    <span>{{ scope.row.receiverInfo.booking_ninja_date == null ? "" : dateFormat(scope.row.receiverInfo.booking_ninja_date) }}</span>
                </template>
            </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <div style="text-align: center">
      <el-pagination background layout="prev, pager, next" @current-change="setPage" :page-size="pageSize" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import dayjs from 'dayjs';

import moment from "moment-timezone";
moment.locale("th");
import 'dayjs/locale/th';
dayjs.locale('th');

export default defineComponent({
  name: "ReportBillingDetail",
  components: {
    // HelloWorld,
  },
  data() {
    return {
      data: [],
      filtered: [],
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        tracking: "",
      },
      url: "https://tool.945parcel.com"
    };
  },
  mounted: function(this: any) {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$route.push({ path: "/" });
    } else {
      this.getData();
    }
  },
  methods: {
    getData(this: any) {
      this.data = [];
      axios
        .get(this.url + "/list-tracking-bill?billing_no=" + this.$store.state.report_billing_no)
        .then(response => {
          if (response.data.length === 0) {
            //@ts-ignore
            // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            this.data = [];
          } else {
            var dataDetail = response.data;
            for(let e of dataDetail) {
                e.matchSenderZipcode = e.receiverInfo.sender_address.search(e.receiverInfo.zipcode);
                this.data.push(e);
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    dateFormat(strDate: any) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
    getTracking(index: number, row: any) {
      window.open("https://key.my945capture.com/v2/api/parcel-capture/tasks/manual/pick/" + row.tracking);
    },
    setPage(this:any, val: any) {
      this.page = val;
    },
    tableRowClassName({row, rowIndex}: any) {
        if (row.receiverInfo.status === 'pending') {
          return 'warning-row';
        } 
        // if (rowIndex === 3) {
        //   return 'success-row';
        // }
        return '';
    }
  },
  computed: {
    filteredResources(this: any) {
      if(this.form.tracking == null) return this.data;      
        this.filtered = this.data.filter((item: any) => !this.form.tracking || (item.tracking).toLowerCase().includes(this.form.tracking.toLowerCase()));
        this.total = this.filtered.length;
        return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  }
});
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  a:hover, a:active {
    color: lightskyblue;
  }
</style>