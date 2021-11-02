<template>
  <div>
    <h1>Tracking Info</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณาระบุ Tracking:">
        <el-input v-model="form.tracking" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click.prevent="getData">ค้นหา</el-button>
      </el-form-item>
    </el-form>
    <el-card style="width: 100%">
      <p>Billing Item Temp</p>
      <el-table ref="multipleTable" :data="billingItemTemp" style="width: 100%">
        <el-table-column prop="billing_no" label="billing_no"></el-table-column>
        <el-table-column fixed prop="tracking" label="tracking"></el-table-column>
        <el-table-column prop="zipcode" label="zipcode"></el-table-column>
        <el-table-column prop="size_id" label="size_id"></el-table-column>
        <el-table-column prop="size_price" label="size_price"></el-table-column>
        <el-table-column prop="parcel_type" label="parcel_type"></el-table-column>
        <el-table-column prop="cod_value" label="cod_value"></el-table-column>
        <el-table-column prop="source" label="source"></el-table-column>
        <el-table-column label="created_at">
            <template #default="scope">
                <span>{{ scope.row.created_at == null ? "" : dateFormatDetail(scope.row.created_at) }}</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="" width="80" align="center">
            <template #default="scope">
              <el-button size="mini" type="danger" @click="handleDeleteItemTemp(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
      </el-table>
      <p>Billing Item</p>
      <el-table ref="multipleTable" :data="billingItem" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="billing_no" label="billing_no"></el-table-column>
        <el-table-column fixed prop="tracking" label="tracking"></el-table-column>
        <el-table-column prop="zipcode" label="zipcode"></el-table-column>
        <el-table-column prop="size_id" label="size_id"></el-table-column>
        <el-table-column prop="size_price" label="size_price"></el-table-column>
        <el-table-column prop="parcel_type" label="parcel_type"></el-table-column>
        <el-table-column prop="cod_value" label="cod_value"></el-table-column>
        <el-table-column prop="source" label="source"></el-table-column>
        <el-table-column label="created_at">
            <template #default="scope">
                <span>{{ scope.row.created_at == null ? "" : dateFormatDetail(scope.row.created_at) }}</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="" width="80" align="center">
            <template #default="scope">
              <el-button size="mini" type="danger" @click="handleDeleteItem(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
      </el-table>
      <p>Receiver Info Temp</p>
      <el-table ref="multipleTable" :data="receiverInfoTemp" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column fixed prop="tracking" label="tracking"></el-table-column>
        <el-table-column prop="parcel_type" label="parcel_type"></el-table-column>
        <el-table-column prop="sender_name" label="sender_name"></el-table-column>
        <el-table-column prop="sender_phone" label="sender_phone"></el-table-column>
        <el-table-column prop="sender_address" label="sender_address"></el-table-column>
        <el-table-column prop="receiver_name" label="receiver_name"></el-table-column>
        <el-table-column prop="phone" label="phone"></el-table-column>
        <el-table-column prop="receiver_address" label="receiver_address"></el-table-column>
        <el-table-column prop="district_id" label="district_id"></el-table-column>
        <el-table-column prop="district_name" label="district_name"></el-table-column>
        <el-table-column prop="amphur_id" label="amphur_id"></el-table-column>
        <el-table-column prop="amphur_name" label="amphur_name"></el-table-column>
        <el-table-column prop="province_id" label="province_id"></el-table-column>
        <el-table-column prop="province_name" label="province_name"></el-table-column>
        <el-table-column prop="zipcode" label="zipcode"></el-table-column>
        <el-table-column prop="courirer_id" label="courirer_id"></el-table-column>
        <el-table-column prop="status" label="status"></el-table-column>
        <el-table-column fixed="right" label="" width="80" align="center">
            <template #default="scope">
              <el-button size="mini" type="danger" @click="handleDeleteReceiverTemp(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
      </el-table>
      <p>Receiver Info</p>
      <el-table ref="multipleTable" :data="receiverInfo" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column fixed prop="tracking" label="tracking"></el-table-column>
        <el-table-column prop="parcel_type" label="parcel_type"></el-table-column>
        <el-table-column prop="cod_value" label="cod_value"></el-table-column>
        <el-table-column prop="sender_name" label="sender_name"></el-table-column>
        <el-table-column prop="sender_phone" label="sender_phone"></el-table-column>
        <el-table-column prop="sender_address" label="sender_address"></el-table-column>
        <el-table-column prop="receiver_name" label="receiver_name"></el-table-column>
        <el-table-column prop="phone" label="phone"></el-table-column>
        <el-table-column prop="receiver_address" label="receiver_address"></el-table-column>
        <el-table-column prop="district_id" label="district_id"></el-table-column>
        <el-table-column prop="district_name" label="district_name"></el-table-column>
        <el-table-column prop="amphur_id" label="amphur_id"></el-table-column>
        <el-table-column prop="amphur_name" label="amphur_name"></el-table-column>
        <el-table-column prop="province_id" label="province_id"></el-table-column>
        <el-table-column prop="province_name" label="province_name"></el-table-column>
        <el-table-column prop="zipcode" label="zipcode"></el-table-column>
        <el-table-column prop="courirer_id" label="courirer_id"></el-table-column>
        <el-table-column prop="status" label="status"></el-table-column>
        <el-table-column prop="booking_status" label="booking_status"></el-table-column>
        <el-table-column prop="booking_flash_status" label="booking_flash_status"></el-table-column>
        <el-table-column prop="booking_ninja_status" label="booking_ninja_status"></el-table-column>
        <el-table-column label="booking_date">
            <template #default="scope">
                <span>{{ scope.row.booking_date == null ? "" : dateFormatDetail(scope.row.booking_date) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="booking_flash_date">
            <template #default="scope">
                <span>{{ scope.row.booking_flash_date == null ? "" : dateFormatDetail(scope.row.booking_flash_date) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="booking_ninja_date">
            <template #default="scope">
                <span>{{ scope.row.booking_ninja_date == null ? "" : dateFormatDetail(scope.row.booking_ninja_date) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="remark" label="remark"></el-table-column>
        <el-table-column label="created_at">
            <template #default="scope">
                <span>{{ scope.row.created_at == null ? "" : dateFormatDetail(scope.row.created_at) }}</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="" width="80" align="center">
            <template #default="scope">
              <el-button size="mini" type="danger" @click="handleDeleteReceiver(scope.$index, scope.row)">Delete</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import moment from "moment";
import momentTimezone from "moment-timezone";
moment.locale("th");
export default defineComponent({
  name: "TrackingInfo",
  components: {
  },
  data() {
    return {
      form: {
        tracking: "",
      },
      billingItem: [],
      billingItemTemp: [],
      receiverInfo: [],
      receiverInfoTemp: [],
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
      if (this.form.tracking == "") {
        this.$alert("กรุณาใส่ Tracking ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        axios.get(this.url + "/check-data-item?tracking=" + this.form.tracking.trim())
          .then(response => {
            if (response.data.status == "SUCCESS") {
              this.billingItem = response.data.data.billingItem;
              this.billingItemTemp = response.data.data.billingItemTemp;
            } else {
              // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
              this.billingItem = [];
              this.billingItemTemp = [];
            }
          })
          .catch(function(error) {
            console.log(error);
          });

        axios.get(this.url + "/check-data-receiver?tracking=" + this.form.tracking.trim())
          .then(response => {
            if (response.data.status == "SUCCESS") {
              this.receiverInfo = response.data.data.receiverInfo;
              this.receiverInfoTemp = response.data.data.receiverInfoTemp;
            } else {
              // this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
              this.receiverInfo = [];
              this.receiverInfoTemp = [];
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    handleDeleteItemTemp(this: any, index: number, row: any) {
        this.$confirm('ต้องการลบข้อมูล '+ row.tracking + ' ในตาราง billing_item_temp ใช่หรือไม่', 'แจ้งเตือน', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
          axios.get(this.url + "/delete-data-item-temp?tracking=" + row.tracking.trim())
            .then(response => {
              if (response.data.status == "SUCCESS") {
                this.$alert("ลบข้อมูล " + row.tracking + " เรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.getData();
              } else {
                this.$alert("ไม่สามารถลบข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }).catch(() => {
          // this.$message({ type: 'info', message: 'Delete canceled' });
        });
    },
    handleDeleteItem(this: any, index: number, row: any) {
        // console.log(index, row);
        this.$confirm('ต้องการลบข้อมูล '+ row.tracking + ' ในตาราง billing_item ใช่หรือไม่', 'แจ้งเตือน', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
          axios.get(this.url + "/delete-data-item?tracking=" + row.tracking.trim() + "&id="+ row.id)
            .then(response => {
              if (response.data.status == "SUCCESS") {
                this.$alert("ลบข้อมูล " + row.tracking + " เรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.getData();
              } else {
                this.$alert("ไม่สามารถลบข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }).catch(() => {
          // this.$message({ type: 'info', message: 'Delete canceled' });
        });
    },
    handleDeleteReceiverTemp(this:any, index: number, row: any) {
        // console.log(index, row);
        this.$confirm('ต้องการลบข้อมูล '+ row.tracking + ' ในตาราง billing_receiver_info_temp ใช่หรือไม่', 'แจ้งเตือน', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
          axios.get(this.url + "/delete-data-receiver-temp?tracking=" + row.tracking.trim())
            .then(response => {
              if (response.data.status == "SUCCESS") {
                this.$alert("ลบข้อมูล " + row.tracking + " เรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.getData();
              } else {
                this.$alert("ไม่สามารถลบข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }).catch(() => {
          // this.$message({ type: 'info', message: 'Delete canceled' });
        });
    },
    handleDeleteReceiver(this: any, index: number, row: any) {
        // console.log(index, row);
        this.$confirm('ต้องการลบข้อมูล '+ row.tracking + ' ในตาราง billing_receiver_info ใช่หรือไม่', 'แจ้งเตือน', { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
          axios.get(this.url + "/delete-data-receiver?tracking=" + row.tracking.trim() + "&id=" + row.id )
            .then(response => {
              if (response.data.status == "SUCCESS") {
                this.$alert("ลบข้อมูล " + row.tracking + " เรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.getData();
              } else {
                this.$alert("ไม่สามารถลบข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }).catch(() => {
          // this.$message({ type: 'info', message: 'Delete canceled' });
        });
    },
    dateFormat(strDate: any) {
        return moment(strDate).format("LL HH:mm");
    },
    dateFormatDetail(strDate: any) {
        return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  computed: {
  }
});
</script>

<style>
</style>