<template>
  <div>
      <el-form ref="form" :model="editForm">
        <el-form-item label="ขนาด">
            <el-input v-model="editForm.alias_size" readonly></el-input>
        </el-form-item>
        <el-form-item label="พื้นที่">
            <el-radio-group v-model="editForm.location_zone" disabled>
                <el-radio label="BKK"></el-radio>
                <el-radio label="UPC"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="Zone">
            <el-input v-model="editForm.zone" readonly></el-input>
        </el-form-item>
        <el-form-item label="ราคาขาย">
            <el-input v-model="editForm.parcel_price"></el-input>
        </el-form-item>
        <el-form-item label="ราคาทุน">
            <el-input v-model="editForm.parcel_cost"></el-input>
        </el-form-item>
        <el-form-item label="sold to account id">
            <el-input v-model="editForm.sold_to_account_id"></el-input>
        </el-form-item>
        <el-form-item label="pickup account id">
            <el-input v-model="editForm.pickup_account_id"></el-input>
        </el-form-item>
        <el-form-item label="customer account id">
            <el-input v-model="editForm.customer_account_id"></el-input>
        </el-form-item>
        <el-form-item label="global product id (NORMAL)">
            <el-input v-model="editForm.global_product_id_normal"></el-input>
        </el-form-item>
        <el-form-item label="global product id (COD)">
            <el-input v-model="editForm.global_product_id_cod"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click.prevent="confirmData()">บันทึก</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import VueZoomer from 'vue-zoomer';

export default defineComponent({
  name: "ConfirmQLChecker",
  components: {
  },
  data() {
    return {
      url: "https://tool.945parcel.com",
      editForm: {
          size_id : 0,
          alias_size: "",
          location_zone: "",
          zone: "",
          parcel_price: "",
          parcel_cost: "",
          sold_to_account_id: "",
          pickup_account_id: "",
          customer_account_id: "",
          global_product_id_normal: "",
          global_product_id_cod: ""
      },
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
      axios
          .get(this.url + "/size/get-size-info/" + this.$store.state.size_info.size_id)
          .then(response => {
            if (response.data) {
              var dataSize = response.data.data;
              this.editForm = dataSize.size_info[0];
              this.editForm.location_zone = dataSize.size_info[0].location_zone.toUpperCase();

              dataSize.global_size.forEach((value: any) => {
                if (value.type == "NORMAL") {
                  this.editForm.global_product_id_normal = value.product_id;
                }
                if (value.type == "COD") {
                  this.editForm.global_product_id_cod = value.product_id;
                }
              });
            } else {
              this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
    },
    confirmData(this: any) {
      if (this.editForm.alias_size == "") {
        this.$alert("กรุณาใส่ขนาดให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.location_zone == "") {
        this.$alert("กรุณาระบุพื้นที่ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.parcel_price == "" && parseInt(this.formSize.parcel_price) == 0) {
        this.$alert("กรุณาระบุราคาขายให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.parcel_cost == "" && parseInt(this.formSize.parcel_cost) == 0) {
        this.$alert("กรุณาระบุราคาทุนให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.sold_to_account_id == "") {
        this.$alert("กรุณาใส่รหัส sold to account id ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.pickup_account_id == "") {
        this.$alert("กรุณาใส่รหัส pickup account id ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.customer_account_id == "") {
        this.$alert("กรุณารหัส customer account idให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.zone == 0) {
        this.$alert("กรุณาระบุ zone ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.global_product_id_normal == "") {
        this.$alert("กรุณาใส่ global product id สำหรับ Normal ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.editForm.global_product_id_cod == "") {
        this.$alert("กรุณาใส่ global product id สำหรับ COD ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        this.editForm.data_size_id = this.editForm.size_id;
        this.editForm.parcel_price = parseInt(this.editForm.parcel_price);
        this.editForm.parcel_cost = parseInt(this.editForm.parcel_cost);
        
        axios
            .post(this.url + "/size/edit-size", this.editForm)
            .then(response => {
              if (response.data.status == "success") {
                this.$alert("บันทึกข้อมูล Size เรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
                this.$router.push({ name: "SizeInfo" });
              } else {
                this.$alert("ไม่สามารถแก้ไขข้อมูลได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
      }
    },
    engOnly(ele: any, event: KeyboardEvent) {
      var englishAlphabetAndWhiteSpace = /[A-Za-z | 0-9]/g;
      // let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      var key = String.fromCharCode(event.which);
      if (event.keyCode == 8 || event.keyCode == 37 || englishAlphabetAndWhiteSpace.test(key)) {
        return true;
      }
      event.preventDefault();
    },
    onlyNumber(ele: any, event: KeyboardEvent) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        event.preventDefault();
      }
    }
  },
  computed: {
  }
});
</script>

<style>

</style>