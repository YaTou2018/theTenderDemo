<template>
  <div class="ztb-container">
    <div class="formWrap">
      <el-form label-width="126px" class="upload-form">
        <el-form-item label="上传招标文件">
          <el-upload
            ref="uploadEle"
            :action="action"
            :before-upload="handleBeforeUpload"
            :on-remove="handleRemove"
            :on-success="handleSuc"
            :on-error="handleErr"
            :limit="1"
            :file-list="fileList"
            accept=".pdf,.docx,.doc">
            <el-button type="primary" icon="el-icon-upload" size="mini" :loading="uploadLoading">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">{{ uploadErrTip }}</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传投标文件">
          <el-upload
            ref="uploadEle"
            :action="action"
            :before-upload="handleBeforeUpload"
            :on-remove="handleRemove"
            :on-success="handleSuc"
            :on-error="handleErr"
            :limit="1"
            :file-list="fileList"
            accept=".pdf">
            <el-button type="primary" icon="el-icon-upload" size="mini" :loading="uploadLoading">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">{{ uploadErrTip }}</span>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <div class="content">
      <el-card class="box-card" v-if="zbList && zbList.length > 0">
        <div slot="header" class="clearfix">
          <span style="color: #909399;font-weight: 800;">招标项目：</span>
          <span>{{zbList[0].zbProject}}</span>
        </div>
        <div class="text item">
          <el-table border v-loading="loading" :data="zbList.slice(1)">
            <el-table-column :label="zbList[0].zid" prop="zid" align="center" />
            <el-table-column :label="zbList[0].zname" prop="zname" />
            <el-table-column :label="zbList[0].secondName" prop="secondName" />
            <el-table-column :label="zbList[0].shirdName" prop="shirdName" />
            <el-table-column :label="zbList[0].keywords" width="160" prop="keywords"></el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%">
      <div class="">
        <preview-pdf :fileName="curFileName" :curPage="curPdfPage" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getZbIndex, getTbIndex } from "@/api/ztb/zb";
import PreviewPdf from '@/components/PreviewPdf'

export default {
  name: "Zb",
  components: {
    PreviewPdf
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      zbList: [],
      uploadLoading: false,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + '/ztb/zb/uploadzbFile',
      uploadErrTip: '只能上传.pdf 文件',
      drawer: false,
      curFileName: '',
      curPdfPage: 1,
    };
  },
  created() {
    // this.getTbFile('中核武汉核电运行技术股份有限公司_投标文件');
    this.getZbFile("秦二厂低、中水平放射性固体废物钢桶等材料一批采购项目-招标文件发标版本(1).docx");
  },
  methods: {
    /** 查询【招标文件指标】 */
    getZbFile(filename) {
      this.loading = true;
      getZbIndex({filename})
        .then(res => {
          this.zbList = res.rows;
          this.loading = false;
        })
        .catch(() =>  {
          this.zbList = [];
          this.loading = false;
        });
    },
    /** 查询【投标文件指标】 */
    getTbFile(filename) {
      this.loading = true;
      getTbIndex({filename})
        .then(res => {
          this.zbList = res.rows;

          var arr = [];// [{name: 'zh', num: 1, indexArr: [0, 1]}]
          var cuIndex = function(name) {
            return arr.findIndex(item => item.name === name)
          }
          res.rows.forEach((item, i) => {
            var inNum = cuIndex(item.zname);

            if (inNum > -1) {
              arr[inNum].num+=1;
              arr[inNum].indexArr.push(i)
            } else {
              arr.push({name: item.zname, num: 1, indexArr: [i]})
            }
          });
          this.spanRowsArr = arr;
          this.loading = false;
        })
        .catch(() =>  {
          this.zbList = [];
          this.loading = false;
        });
    },
    /** upload按钮操作 */
    handleBeforeUpload(file) {
      console.log(file)
      // if (file.type !== "application/pdf") {
      //   this.$message({
      //     message: this.uploadErrTip,
      //     type: 'warning'
      //   });
      //   return false;
      // }
      this.uploadLoading = true;
    },
    handleRemove() {
      this.fileList = [];
    },
    handleSuc(response) {
      if (response.code !== 200) {
        this.$message.error(response.msg || '上传失败！');
      } else {
        this.getZbFile(response.data);
        this.$message({
          message: '上传成功！',
          type: 'success'
        });
      }

      this.fileList = [];
      this.$refs.uploadEle.clearFiles()
      this.uploadLoading = false;
    },
    handleErr(err) {
      this.$message.error(err.msg || '上传失败！');
      this.fileList = [];
      this.$refs.uploadEle.clearFiles();
      this.uploadLoading = false;
    }
  }
};
</script>

<style lang="less">
  .formWrap{
    padding-top:20px;
    background:#d7ebff;
    padding-bottom:5px;

  }
  .formWrap .upload-form,.content{
    width:80%;
    margin:0 auto;
  }
  .formWrap .upload-form {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .formWrap .upload-form .el-form-item {
    min-width: 360px;
  }
  .content {
    width:80%;
    padding: 20px 0;
  }
  .el-upload__tip {
    margin-left: 8px;
    color: #F56C6C;
  }
  .separator {
    margin: 0 6px;
    color: #CCC;
  }
</style>
