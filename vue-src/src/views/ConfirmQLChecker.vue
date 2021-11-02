<template>
  <div>
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
                <el-descriptions-item>
                  <span><el-button @click.prevent="confirmData()">แก้ไขข้อมูล</el-button></span>
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
    } else {
        this.getData();
    }
  },
  methods: {
    getData(this: any) {
      axios
        .get(this.url + "/check/info/tracking?tracking=" + this.$store.state.qlchecker.tracking.toUpperCase())
        .then(response => {
          if (response.data.status == "SUCCESS") {
            this.$store.commit("qlcheckerPreviousValue", JSON.stringify(response.data.billingInfo[0])); //เก็บไว้ส่งค่าตอน confirm
            
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
          } else {
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
    selectType(this:any) {
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
      var phone = this.billingInfo.phone;
      let rawDataAutoStr = this.removeCharacter(this.capture_text);
      
      if (this.receiver_first_name == "") {
        this.$alert("กรุณากรอก ชื่อผู้รับ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.receiver_last_name == "") {
        this.$alert("กรุณากรอก นามสกุลผู้รับ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (phone[0] + phone[1] != "06" && phone[0] + phone[1] != "08" && phone[0] + phone[1] != "09") {
        this.$alert("กรุณากรอก เบอร์โทรศัทพ์ผู้รับ เท่านั้น", "", { confirmButtonText: "OK" });
      } else if (phone.length < 10) {
        this.$alert("กรุณากรอก เบอร์โทรศัพท์ผู้รับ ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.br_zipcode == "") {
        this.$alert("กรุณากรอก รหัสไปรษณีย์ผู้รับให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.br_zipcode != this.billingInfo.bi_zipcode) {
        this.$alert("กรุณากรอก รหัสไปรษณีย์ผู้รับ ให้ตรงกับหน้ากล่องผู้รับ", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.bi_parcel_type != this.billingInfo.br_parcel_type) {
        this.$alert("กรุณากรอก ประเภทการจัดส่ง ให้ตรงกับหน้ากล่องผู้รับ", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.cod_value == null) {
        this.$alert("กรุณากรอก ค่าเก็บเงินปลายทาง ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.bi_parcel_type == "COD" && (this.billingInfo.cod_value == "" || parseInt(this.billingInfo.cod_value) == 0)) {
        this.$alert("กรุณากรอก ค่าเก็บเงินปลายทาง ให้ถูกต้อง", "", { confirmButtonText: "OK" });
      } else if (this.billingInfo.bi_parcel_type == "NORMAL" && parseInt(this.billingInfo.cod_value) !== 0) {
        this.$alert("กรุณากรอก ค่าเก็บเงินปลายทาง ให้ถูกต้อง", "", { confirmButtonText: "OK" });
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
            console.log("confirm error", error);
          });
        } else if (this.billingInfo.bi_parcel_type == "COD" && parseInt(this.billingInfo.cod_value) < 100) {
          this.$confirm("มูลค่า COD น้อยกว่า 100 บาท ยืนยันมูลค่า", { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
            this.saveData();
          }).catch((error: any) => {
            console.log("confirm error", error);
          });
        } else if (sender_address.search(this.billingInfo.br_zipcode) !== -1) {
          this.$confirm("zipcode ผู้รับ/ผู้ส่ง ตรงกัน", { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }).then(() => {
            this.saveData();
          }).catch((error: any) => {
            console.log("confirm error", error);
          });
        } else {
          this.saveData();
        }
      }
    },
    saveData(this: any) {
      var dataConfirm = {
        tracking: this.billingInfo.tracking,
        billing_no: this.billingInfo.billing_no,
        previous_value: JSON.parse(this.$store.state.qlchecker_previous_value),
        current_value: {
          parcel_type: this.billingInfo.bi_parcel_type,
          cod_value: parseInt(this.billingInfo.cod_value),
          size_id: this.billingInfo.size_id,
          size_price: this.billingInfo.size_price,
          first_name: this.receiver_first_name,
          last_name: this.receiver_last_name == undefined || this.receiver_last_name == "" ? "" : this.receiver_last_name,
          phone: this.billingInfo.phone,
          address: this.billingInfo.receiver_address,
          district_code: this.selectedAddress.DISTRICT_CODE,
          br_zipcode: this.billingInfo.br_zipcode
        },
        user: this.$store.state.userInfo.name
      };
      // console.log(JSON.stringify(dataConfirm));
      axios
        .post(this.url + "/confirm/match/data/info", dataConfirm)
        .then(response => {
          if (response.data.status == "SUCCESS") {
            //@ts-ignore
            this.$store.commit("qlcheckerPreviousValueClear");
            this.$alert("แก้ไขข้อมูลผู้รับเรียบร้อยแล้ว", "", { confirmButtonText: "OK" });
            this.$router.push({ name: "ListPending" });
          } else {
            this.$alert("ข้อมูลไม่ถูกต้อง เนื่องจาก " + response.data.status, "", { confirmButtonText: "OK" });
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