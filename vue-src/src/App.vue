<template>
  <div id="nav">
    <div v-show="$store.state.is_login">
    <el-container>
      <el-aside>
        <About></About>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 20px">
          <span>Welcome <b>{{ $store.state.userInfo ? $store.state.userInfo.name : "" }}</b></span>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    </div>
    <div v-show="!$store.state.is_login">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import About from '@/views/About.vue';

export default defineComponent({
  name: "App",
  components: {
    About
  },
  data() {
    return {
    };
  },
  mounted: function() {
    //@ts-ignore
    if (this.$store.state.is_login == false) {
      //@ts-ignore
      this.$router.push({ name: "Home" });
    }
  },
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: none;
  text-decoration: none;
}

#nav {
  padding: 30px;

  a {
    // font-weight: bold;
    color: none;
    text-decoration: none;

    &.router-link-exact-active {
      // color: none;
      text-decoration: none;
    }
  }
}
a:visited {
  color: #303133;
}
</style>
