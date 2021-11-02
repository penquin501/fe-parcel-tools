<template>
  <div>
    <h1>Re-Labeling</h1>
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <el-form-item label="กรุณาใส่ Tracking">
        <el-input v-model="form.tracking" maxlength="30" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click.prevent="getData">ค้นหา</el-button>
      </el-form-item>
    </el-form>
    <div v-show="billingInfo.tracking !== undefined">
        <el-card class="box-card">
            <table style="width: 100%;">
                <tbody>
                    <tr>
                    <td style="width: 350px; text-align: center;">
                        <div v-if="capture_text == ''">
                            <v-zoomer style="width: 500px; height: 500px; border: solid 1px silver;">
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
                        <el-descriptions title="ข้อมูลสาขา" :column="2">
                            <el-descriptions-item label="Tracking:">{{ billingInfo.tracking }}</el-descriptions-item>
                            <el-descriptions-item label="เลขที่บิล:">{{ billingInfo.billing_no }}</el-descriptions-item>
                            <el-descriptions-item label="ขนาดพัสดุ:">{{ billingInfo.alias_size }}</el-descriptions-item>
                            <el-descriptions-item label="ราคาพัสดุ:">{{ billingInfo.size_price }}</el-descriptions-item>
                            <el-descriptions-item label="ประเภทการจัดส่ง:">
                                <el-radio-group v-model="billingInfo.bi_parcel_type" @change="selectType()">
                                    <el-radio label="COD"></el-radio>
                                    <el-radio label="NORMAL"></el-radio>
                                </el-radio-group>
                            </el-descriptions-item>
                            <el-descriptions-item label="รหัสไปรษณีย์:">{{ billingInfo.bi_zipcode }}</el-descriptions-item>
                            <el-descriptions-item label="มูลค่า COD:">
                                <el-input @keypress="onlyNumber(ele, $event)" v-model="billingInfo.cod_value"></el-input>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions title="ข้อมูลผู้ส่ง" :column="2">
                            <el-descriptions-item label="ชื่อผู้ส่ง:">{{ billingInfo.sender_name }}</el-descriptions-item>
                            <el-descriptions-item label="เบอร์โทรศัพท์ผู้ส่ง:">{{ billingInfo.sender_phone }}</el-descriptions-item>
                            <el-descriptions-item label="ที่อยู่ผู้ส่ง:">{{ billingInfo.sender_address }}</el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions title="ข้อมูลผู้รับ" :column="2">
                            <el-descriptions-item label="ชื่อผู้รับ:">
                            <el-input @keypress="inputCheckFormatName($event)" v-model="receiver_first_name"></el-input>
                            </el-descriptions-item>
                            <el-descriptions-item label="นามสกุลผู้รับ:">
                            <el-input @keypress="inputCheckFormatName($event)" v-model="receiver_last_name"></el-input>
                            </el-descriptions-item>
                            <el-descriptions-item label="เบอร์โทรศัพท์ผู้รับ:">
                            <el-input @keypress="onlyNumber(ele, $event)" v-model="billingInfo.phone" maxlength="10"></el-input>
                            </el-descriptions-item>
                            <el-descriptions-item label="ที่อยู่ผู้รับ:">
                            <el-input v-model="billingInfo.receiver_address"></el-input>
                            </el-descriptions-item>
                            <el-descriptions-item label="รหัสไปรษณีย์:">
                            <el-select style="width: 100%;" v-model="value" filterable remote reserve-keyword placeholder="รหัสไปรษณีย์" :remote-method="remoteMethod" :loading="loading" @change="selectAddress()">
                                <el-option v-for="item in listZipcode" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            </el-descriptions-item>
                            <el-descriptions-item label="ประเภทการจัดส่ง:">{{ billingInfo.br_parcel_type }}</el-descriptions-item>
                        </el-descriptions>
                    </td>
                    </tr>
                </tbody>
            </table>
        </el-card>
        <div style="margin-top: 20px;"></div>
        <el-form ref="form" :model="formConfirm" label-width="300px">
            <el-form-item label="ระบุสาเหตุ">
                <el-radio-group v-model="formConfirm.causeType">
                    <el-radio :label="1">945 เป็นฝ่ายผิด</el-radio>
                    <el-radio :label="2">ลูกค้า/shop เป็นฝ่ายผิด</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="เลขจัดส่งใหม่">
                <el-input v-model="formConfirm.tracking" maxlength="30" readonly></el-input>
            </el-form-item>
            <el-form-item label="เหตุผล">
                <el-select v-model="formConfirm.reason" placeholder="เลือกเหตุผล">
                <el-option label="เปลี่ยนประเภท COD เป็น NORMAL" value="change_cod_to_normal"></el-option>
                <el-option label="เปลี่ยนประเภท NORMAL เป็น COD" value="change_normal_to_cod"></el-option>
                <el-option label="เปลี่ยนมูลค่า COD" value="change_codvalue"></el-option>
                <el-option label="เปลี่ยนที่อยู่" value="change_address"></el-option>
                <el-option label="ปิดสถานะก่อนกำหนด" value="close_status_early_due"></el-option>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios from "axios";
import VueZoomer from 'vue-zoomer';

export default defineComponent({
  name: "ReLabel",
  components: {
  },
  data() {
    return {
      form: {
        tracking: "",
      },
      formConfirm: {
        causeType: "",
        tracking: "",
        reason: "",
        remark: ""
      },
      url: "https://tool.945parcel.com",
      listZipcode: [],
      billingInfo: {},
      receiver_first_name: "",
      receiver_last_name: "",
      imgUrl: "",
      capture_text: "",
      imgCapture: "",
      value: { 
        DISTRICT_CODE: "",
        zipcode: "",
        DISTRICT_ID: 0,
        DISTRICT_NAME: "",
        AMPHUR_ID: 0,
        AMPHUR_NAME: "",
        PROVINCE_ID: 0,
        PROVINCE_NAME: ""
      },
      selectedAddress: {},
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
    }
  },
  methods: {
    getData(this: any) {
      axios
        .get(this.url + "/check/info/tracking?tracking=" + this.form.tracking.toUpperCase())
        .then(response => {
          if (response.data.status == "SUCCESS") {
            this.$store.commit("relabelPreviousValue", JSON.stringify(response.data.billingInfo[0])); //เก็บไว้ส่งค่าตอน confirm

            this.billingInfo = response.data.billingInfo[0];
            this.billingInfo.alias_size = this.billingInfo.alias_size.toUpperCase();
            var res = this.billingInfo.receiver_name.split(" ");
            this.receiver_first_name = res[0];
            this.receiver_last_name = res[1] == "" || res[1] == undefined ? "" : res[1];

            this.value = JSON.stringify({ 
              DISTRICT_CODE: this.billingInfo.DISTRICT_CODE,
              zipcode: this.billingInfo.br_zipcode,
              DISTRICT_ID: this.billingInfo.district_id,
              DISTRICT_NAME: this.billingInfo.district_name,
              AMPHUR_ID: this.billingInfo.amphur_id,
              AMPHUR_NAME: this.billingInfo.amphur_name,
              PROVINCE_ID: this.billingInfo.province_id,
              PROVINCE_NAME: this.billingInfo.province_name
            });
            this.listAddress();
            this.selectedAddress = JSON.parse(this.value);
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
            this.getNewTracking();
          } else {
            //@ts-ignore
            this.$store.commit("relabelPreviousValueClear");
            this.billingInfo = {};
            this.form.tracking = "";
            this.formConfirm = {};
            this.value = {};
            this.receiver_first_name = "";
            this.receiver_last_name = "";
            this.imgUrl = "";
            this.capture_text = "";
            this.imgCapture = "";
            this.$alert("ไม่พบข้อมูล", "", { confirmButtonText: "OK" });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    listAddress(this:any) {
      axios
        .get("https://pos.945.report/billingPos/checkZipcode/?zipcode=" + this.billingInfo.br_zipcode)
        .then(results => {
          this.listZipcode = results.data.map((item: any) => {
            return { value: JSON.stringify(item), label: `${item.zipcode} ${item.DISTRICT_NAME} ${item.AMPHUR_NAME} ${item.PROVINCE_NAME}` };
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    remoteMethod(zipcodeInput: any) {
      if (zipcodeInput.length > 2 && zipcodeInput.length < 6) {
        this.listZipcode = [];
        this.loading = true;
        axios
          .get("https://pos.945.report/billingPos/checkZipcode/?zipcode=" + zipcodeInput)
          .then(results => {
            this.loading = false;
            this.listZipcode = results.data.map((item: any) => {
              return { value: JSON.stringify(item), label: `${item.zipcode} ${item.DISTRICT_NAME} ${item.AMPHUR_NAME} ${item.PROVINCE_NAME}` };
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    selectAddress(this: any) {
      let object = this.listZipcode.find((d: any) => d.value == this.value);
      this.selectedAddress = JSON.parse(object.value);
      this.billingInfo.br_zipcode = this.selectedAddress.zipcode;
      this.billingInfo.bi_zipcode = this.selectedAddress.zipcode;
      this.selectSize();
    },
    getNewTracking(this: any) {
      axios.get(this.url + "/get-new-tracking").then(response => {
        this.formConfirm.tracking = response.data.toUpperCase();
      });
    },
    selectType(this: any) {
      this.billingInfo.br_parcel_type = this.billingInfo.bi_parcel_type;
      this.billingInfo.cod_value = this.billingInfo.bi_parcel_type == "NORMAL" ? 0 : this.billingInfo.cod_value;
    },
    selectSize(this: any) {
      var dataSize = {
        zipcode: this.billingInfo.br_zipcode,
        size_name: this.billingInfo.alias_size,
        // zone: (this.branch_id !== 50 && this.branch_id !== 70) ? 2 : 1
        zone: 2
      };
      axios
        .post(this.url + "/parcelPrice", dataSize)
        .then(response => {
          let parcelSizeSelect = response.data;
          if (response.data != undefined) {
            this.billingInfo.size_price = parcelSizeSelect[0].parcel_price;
            this.billingInfo.size_id = parcelSizeSelect[0].size_id;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    removeCharacter(text: string) {
      var newText = "";
      var newCha = "";
      text = text.replace(/^[<br>]*/g, "");

      for (let i = 0; i < text.length; i++) {
        if (text[i] == "-") {
          newCha = text[i].replace("-", "");
          newText += newCha;
        } else if (text[i] == " ") {
          newCha = text[i].replace(" ", "");
          newText += newCha;
        } else if (text[i] == ":") {
          newCha = text[i].replace(":", "");
          newText += newCha;
        } else if (text[i] == "?") {
          newCha = text[i].replace("?", "");
          newText += newCha;
        } else {
          newText += text[i];
        }
      }
      return newText;
    },
    inputCheckFormatName(event: KeyboardEvent) {
      var keyCode = event.keyCode ? event.keyCode : event.which;
      if (!(keyCode < 48 || keyCode > 57)) {
        event.preventDefault();
      }
    },
    confirmData(this: any) {
        var regTracking = /^[T|t][D|d][Z|z]+[0-9]{8}[A-Z]?$/i;
        var phone = this.billingInfo.phone;
        let rawDataAutoStr = this.removeCharacter(this.capture_text);

        if (this.billingInfo.tracking == "") {
            this.$alert("กรุณาระบุ Tracking เพื่อทำรายการ", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.billing_no == "") {
            this.$alert("ไม่สามารถยกเลิกได้ เนื่องจากทางร้านยังไม่ได้ทำรายการ", "", { confirmButtonText: "OK" });
        } else if (this.receiver_first_name == "" || this.receiver_first_name == undefined) {
            this.$alert("กรุณาใส่ชื่อผู้รับให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.receiver_last_name == "" || this.receiver_last_name == undefined) {
            this.$alert("กรุณาใส่นามสกุลผู้รับให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.formConfirm.reason == "") {
            this.$alert("กรุณาระบุ เหตุผล", "", { confirmButtonText: "OK" });
        } else if (this.formConfirm.remark.trim() == "") {
            this.$alert("กรุณากรอกรายละเอียดเพิ่มเติม ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.formConfirm.remark.length < 25) {
            this.$alert("กรุณากรอกรายละเอียดเพิ่มเติม ให้ชัดเจน", "", { confirmButtonText: "OK" });
        } else if (this.formConfirm.causeType == 0) {
            this.$alert("กรุณาระบุสาเหตุ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.formConfirm.tracking == "") {
            this.$alert("กรุณาใส่เลขที่จัดส่งใหม่ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.tracking == this.formConfirm.tracking) {
            this.$alert("กรุณาใส่เลขที่จัดส่งใหม่ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.formConfirm.tracking.match(regTracking) === null) {
            this.$alert("กรุณาใส่เลขที่จัดส่งใหม่ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.status == "cancel") {
            this.$alert("รายการนี้ได้ถูกยกเลิกไปแล้ว", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.status == "relabel") {
            this.$alert("ไม่สามารถเปลี่ยนเลขนี้ได้ เนื่องจากเลขนี้ได้ถูกเปลี่ยนเลขไปแล้ว", "", { confirmButtonText: "OK" });
        } else if (phone[0] + phone[1] != "06" && phone[0] + phone[1] != "08" && phone[0] + phone[1] != "09") {
            this.$alert("กรุณากรอก เบอร์โทรศัทพ์ผู้รับ เท่านั้น", "", { confirmButtonText: "OK" });
        } else if (phone.length < 10) {
            this.$alert("กรุณากรอก เบอร์โทรศัพท์ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.br_zipcode == "") {
            this.$alert("กรุณากรอก รหัสไปรษณีย์ผู้รับให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.br_zipcode != this.billingInfo.bi_zipcode) {
            this.$alert("กรุณากรอก รหัสไปรษณีย์ผู้รับ ให้ตรงกับหน้ากล่องผู้รับ", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.bi_parcel_type != this.billingInfo.br_parcel_type) {
            this.$alert("กรุณาระบุ ประเภทการจัดส่ง ให้ตรงกับหน้ากล่องผู้รับ", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.bi_parcel_type == "COD" && (this.billingInfo.cod_value == "" || parseInt(this.billingInfo.cod_value) == 0)) {
            this.$alert("กรุณากรอก มูลค่า COD ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.bi_parcel_type == "NORMAL" && parseInt(this.billingInfo.cod_value) !== 0) {
            this.$alert("กรุณากรอก มูลค่า COD ให้ถูกต้อง", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.bi_parcel_type == "COD" && parseInt(this.billingInfo.cod_value) > 50000) {
            this.$alert("มูลค่า COD มากกว่า 50000 บาท ไม่สามารถทำรายการได้", "", { confirmButtonText: "OK" });
        } else if (this.billingInfo.sender_phone == this.billingInfo.phone) {
            this.$alert("กรุณาแก้ไข เบอร์โทรศัพท์ผู้รับ เนื่องจากเป็น เบอร์โทรศัพท์ผู้ส่ง", "", { confirmButtonText: "OK" });
        } else if (this.capture_text !== "" && this.billingInfo.phone !== "0914271551" && rawDataAutoStr.search(this.billingInfo.phone) == -1) {
            this.$alert("ไม่มีข้อมูล เบอร์โทรศัพท์ผู้รับ ใน ข้อความหน้ากล่อง", "", { confirmButtonText: "OK" });
        } else {
            let sender_address = this.removeCharacter(this.billingInfo.sender_address);

            if (this.billingInfo.bi_parcel_type == "COD" && parseInt(this.billingInfo.cod_value) >= 10000) {
                this.$confirm("มูลค่า COD มีมูลค่าที่สูงมาก ยืนยันมูลค่า", { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
                    this.saveData();
                }).catch((error: any) => {
                    /* กด cancel หรือ x */
                    console.log("confirm error", error);
                });
            } else if (this.billingInfo.bi_parcel_type == "COD" && parseInt(this.billingInfo.cod_value) < 100) {
                this.$confirm("มูลค่า COD น้อยกว่า 100 บาท ยืนยันมูลค่า", { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
                    this.saveData();
                }).catch((error: any) => {
                    /* กด cancel หรือ x */
                    console.log("confirm error", error);
                });
            } else if (sender_address.search(this.billingInfo.br_zipcode) !== -1) {
                this.$confirm("zipcode ผู้รับ/ผู้ส่ง ตรงกัน", { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
                    this.saveData();
                }).catch((error: any) => {
                    /* กด cancel หรือ x */
                    console.log("confirm error", error);
                });
            } else {
                this.saveData();
            }
        }
    },
    saveData(this: any) {
        var moduleName = "relabeling_tracking";

        var dataConfirm = {
            billingNo: this.billingInfo.billing_no,
            billingInfo: JSON.parse(this.$store.state.relabel_previous_value),
            billingStatus: this.billingInfo.status,
            currentValue: {
                billingItem: {
                    tracking: this.formConfirm.tracking.toUpperCase(),
                    parcelType: this.billingInfo.bi_parcel_type.toUpperCase(),
                    codValue: this.billingInfo.cod_value,
                    sizeId: this.billingInfo.size_id,
                    sizePrice: this.formConfirm.causeType == 1 ? 0 : this.billingInfo.size_price
                },
                receiverInfo: {
                    receiverName: this.receiver_first_name + " " + this.receiver_last_name,
                    phone: this.billingInfo.phone,
                    receiverAddress: this.billingInfo.receiver_address,
                    keyAddress: this.selectedAddress
                }
            },
            causeType: this.formConfirm.causeType,
            reason: this.formConfirm.reason,
            remark: this.formConfirm.remark,
            user: this.$store.state.userInfo.name,
            moduleName: moduleName
        };
        // console.log(JSON.stringify(dataConfirm));
        axios
          .post(this.url + "/tools/relabel-tracking", dataConfirm)
          .then(response => {
            if (response.data.status == "SUCCESS") {
              let billingNo = response.data.billingNo;
                this.$confirm("เลขที่บิลใหม่..." + billingNo, { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'success' }).then(() => {
                    this.billingInfo = {};
                    this.form.tracking = "";
                    this.formConfirm = {};
                    this.value = {};
                    this.receiver_first_name = "";
                    this.receiver_last_name = "";
                    this.imgUrl = "";
                    this.capture_text = "";
                    this.imgCapture = "";
                    //@ts-ignore
                    this.$store.commit("relabelPreviousValueClear");
                    this.$router.push({ name: "Home" });
                }).catch((error: any) => {
                    /* กด cancel หรือ x */
                    this.billingInfo = {};
                    this.form.tracking = "";
                    this.formConfirm = {};
                    this.value = {};
                    this.receiver_first_name = "";
                    this.receiver_last_name = "";
                    this.imgUrl = "";
                    this.capture_text = "";
                    this.imgCapture = "";
                    //@ts-ignore
                    this.$store.commit("relabelPreviousValueClear");
                    this.$router.push({ name: "Home" });
                });
            } else {
                //@ts-ignore
                this.$store.commit("relabelPreviousValueClear");
                this.billingInfo = {};
                this.form.tracking = "";
                this.formConfirm = {};
                this.value = {};
                this.receiver_first_name = "";
                this.receiver_last_name = "";
                this.imgUrl = "";
                this.capture_text = "";
                this.imgCapture = "";
                this.$alert("ไม่สามารถ relabel tracking ได้ เนื่องจาก..." + response.data.reason, "", { confirmButtonText: "OK" });
                this.$router.push({ name: "Home" });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
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