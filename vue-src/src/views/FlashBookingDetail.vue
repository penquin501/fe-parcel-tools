<template>
  <div>
    <table style="width: 100%;">
      <tbody>
        <tr>
          <td style="width: 350px; text-align: center;">
            <div v-if="capture_text == ''">
                <v-zoomer style="width: 350px; height: 350px; border: solid 1px silver;">
                    <img :src="imgUrl" :style="{'object-fit': 'contain','width': '100%', 'height': '100%', 'transform': `rotate(${rotation}deg)`}">
                </v-zoomer>
                <div>
                    <el-button icon="el-icon-refresh-left" circle @click.prevent="rotateLeft()"></el-button>
                    &nbsp;
                    <el-button icon="el-icon-refresh-right" circle @click.prevent="rotateRight()"></el-button>
                </div>
            </div>
            <div>
                {{ capture_text }}
            </div>
          </td>
          <td style="width: 70%;">
              <el-descriptions :title='`ข้อมูล Tracking: ${billingInfo.tracking}`' :column="2">
                <el-descriptions-item label="ชื่อผู้รับ:">
                  <el-input @keypress="inputCheckFormatName($event)" v-model="billingInfo.receiver_name"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="เบอร์โทรศัพท์ผู้รับ:">
                  <el-input @keypress="onlyNumber(ele, $event)" v-model="billingInfo.phone" maxlength="10"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="ตำบล:">
                  <el-input :placeholder="billingInfo.district_name" v-model="district_name"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="อำเภอ:">
                  <el-input :placeholder="billingInfo.amphur_name" v-model="amphur_name"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="จังหวัด:">
                    <el-select style="width: 100%;" ref="branch" v-model="selectedProvince" placeholder="จังหวัด" @change="selectProvince()">
                        <el-option v-for="item in listProvince" :key="item.PROVINCE_ID" :label="item.PROVINCE_NAME" :value="item.PROVINCE_ID"></el-option>
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="รหัสไปรษณีย์:">
                  <el-input maxlength="5" @keypress="onlyNumber(ele, $event)" v-model="zipcode"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="ที่อยู่ผู้รับ:">
                  <el-input style="width: 100%;" v-model="billingInfo.receiver_address"></el-input>
                </el-descriptions-item>
                <el-descriptions-item>
                    <span>
                      <el-button @click.prevent="confirmData()">บันทึก</el-button>
                    </span>
                </el-descriptions-item>
              </el-descriptions>
          </td>
        </tr>
      </tbody>
    </table>
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
      listProvince: [],
      billingInfo: {},
      imgUrl: "",
      capture_text: "",
      imgCapture: "",
      district_name: "",
      amphur_name: "",
      zipcode: "",
      provinceInfo: {},
      selectedProvince: "",
      loading: false,
      zoom: 1,
      rotation: 0
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
        .get(this.url + "/check/info/tracking?tracking=" + this.$store.state.flash_booking_tracking.tracking.toUpperCase())
        .then(response => {
          if (response.data.status == "SUCCESS") {
            this.$store.commit("flashCheckerPreviousValue", JSON.stringify(response.data.billingInfo[0])); //เก็บไว้ส่งค่าตอน confirm

            this.billingInfo = response.data.billingInfo[0];
            this.district_name = this.$store.state.flash_booking_tracking.reason_code == "dstDistrictName" ? "": this.billingInfo.district_name;
            this.amphur_name = this.$store.state.flash_booking_tracking.reason_code == "dstCityName" ? "": this.billingInfo.amphur_name;
            this.zipcode = this.$store.state.flash_booking_tracking.reason_code == "dstPostalCode" ? "": this.billingInfo.br_zipcode;
            this.selectedProvince = this.billingInfo.province_id;
            this.getListProvince();

            var regex_img = /http:\/\/|https:\/\//g;
            this.imgCapture = response.data.imgCapture;

            if (this.imgCapture == false) {
              this.imgUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTDGlsf5n4LgX_Bj23tTVsUeBQodMUP1CHhqk-My3EZIkIYvMDC";
              this.capture_text = "";
            } else {
              if (this.imgCapture[0].image_url.match(regex_img) == null) {
                this.imgUrl = "";
                this.capture_text = this.imgCapture[0].image_url;
              } else {
                this.imgUrl = this.imgCapture[0].image_url;
                this.capture_text = "";
              }
            }
          } else {
            this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getListProvince(this: any) {
      axios
        .get(this.url + "/general/list-province")
        .then(response => {
          if (response.data.status == "success") {
            var provinceInfo = response.data.data;
            if (provinceInfo.length !== 0) {
              this.listProvince = provinceInfo;
              let object = this.listProvince.find((d: any) => d.PROVINCE_ID == this.selectedProvince);
              this.provinceInfo = object;
            } else {
                this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
            }
          } else {
            this.$alert("ไม่พบข้อมูล เนื่องจาก..."+response.data, "", { confirmButtonText: "OK" });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectProvince(this: any) {
      let object = this.listProvince.find((d: any) => d.PROVINCE_ID == this.selectedProvince);
      this.provinceInfo = object;
    },
    inputCheckFormatName(event: KeyboardEvent) {
      var keyCode = event.keyCode ? event.keyCode : event.which;
      if (!(keyCode < 48 || keyCode > 57)) {
        event.preventDefault();
      }
    },
    confirmData(this: any) {
        var phone = this.billingInfo.phone;
      if (this.tracking == "") {
        this.$alert("กรุณาระบุ Tracking เพื่อทำรายการ", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.receiver_name == "" || this.billingInfo.receiver_name == undefined) {
        this.$alert("กรุณาใส่ชื่อ-นามสกุลผู้รับให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.receiver_name.indexOf(" ") == -1) {
        this.$alert("กรุณาใส่ชื่อ-นามสกุลผู้รับให้ครบถ้วน", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.receiver_address.trim() == "") {
        this.$alert("กรุณาระบุ ที่อยู่ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.district_name.trim() == "") {
        this.$alert("กรุณากรอก ตำบล ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.amphur_name.trim() == "") {
        this.$alert("กรุณากรอก อำเภอ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.provinceInfo.PROVINCE_ID == undefined) {
        this.$alert("กรุณากรอก จังหวัด ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.zipcode == "") {
        this.$alert("กรุณากรอก รหัสไปรษณีย์ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (
        phone[0] + phone[1] != "06" &&
        phone[0] + phone[1] != "08" &&
        phone[0] + phone[1] != "09"
      ) {
        this.$alert("กรุณากรอก เบอร์โทรศัทพ์มือถือ เท่านั้น", "", { confirmButtonText: "OK" });
      } else if (phone.length < 10) {
        this.$alert("กรุณากรอก เบอร์โทรศัพท์ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else {
        var dataConfirm = {
          tracking: this.billingInfo.tracking,
          billing_no: this.billingInfo.billing_no,
          previous_value: JSON.parse(this.$store.state.flash_previous_value),
          current_value: {
            receiver_name: this.billingInfo.receiver_name,
            receiver_address: this.billingInfo.receiver_address,
            receiver_phone: this.billingInfo.phone,
            district_code: this.billingInfo.DISTRICT_CODE,
            district_name: this.district_name,
            amphur_name: this.amphur_name,
            province_info: this.provinceInfo,
            zipcode: this.zipcode
          },
          user: this.$store.state.userInfo.name
        };
        // console.log(JSON.stringify(dataConfirm));
        axios
          .post(this.url + "/update/flash/data", dataConfirm)
          .then(response => {
            if (response.data.status == "SUCCESS") {
                //@ts-ignore
                this.$store.commit("flashCheckerPreviousValueClear");
                this.$alert("ข้อมูลได้ update เข้าระบบแล้ว", "", { confirmButtonText: "OK" });
                this.$router.push({ name: "FlashBookingChecker" });
            } else {
                this.$alert("ไม่สามารถแก้ไข ได้ เนื่องจาก..." + response.data.status, "", { confirmButtonText: "OK" });
            //   this.$router.push("/");
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
    },
    rotateRight(this: any) {
      this.rotation += 90;
    },
    rotateLeft(this: any) {
      this.rotation -= 90;
    },
  },
  computed: {
  }
});
</script>

<style>

</style>