<template>
  <div class="container">
    <div class="bg"></div>
    <div class="cont-wrap">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="招标" name="first">
          <zbFile />
        </el-tab-pane>
        <el-tab-pane label="投标" name="second">
          <tbFile />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import zbFile from './zbFile/ZbFile'
import tbFile from './tbFile'

export default {
  name: "Zb",
  components: {
    zbFile,
    tbFile
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
  .bg{
    position: absolute;
    left: 0;
    top: 0;
    width:100%;
    height:140px;
    background:#d7ebff;
  }
  .cont-wrap{
    width:80%;
    padding-top:20px;
    padding-bottom:5px;
    margin: 0 auto;
  }
</style>