<template>
  <div class="ztb-container">
    <div class="bg"></div>
    <div class="formWrap">
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
import zbFile from './zbFile'
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
    width:100%;
    height:140px;
    background:#d7ebff;
  }
  .formWrap{
    width:80%;
    padding-top:20px;
    padding-bottom:5px;
  }
  .formWrap{
    margin:-140px auto 0;
  }
  .formWrap .el-form-item {
    min-width: 360px;
  }
</style>