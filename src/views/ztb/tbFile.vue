<template>
  <div class="tb-container">
    <el-form :inline="true" label-width="126px">
      <el-form-item label="上传指标项目文件">
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

    <div class="content">
      <el-table border v-loading="loading" :data="tbList" :span-method="objectSpanMethod">
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">
            <p>
              {{ spanRowsArr.findIndex(item => item.indexArr.includes(scope.$index)) + 1 }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="指标" width="160" prop="zname" />
        <el-table-column label="分值" prop="total" width="80" />
        <el-table-column label="评分标准" prop="cname" />
        <el-table-column label="页码" width="160" prop="pages">
          <template slot-scope="scope">
            <template v-for="(p, index) in formatPageNum(scope.row.pages)">
              <el-button
                :key="index"
                type="text"
                @click="handlePreviewPdfOfPage(scope.row.filename, p)">
                  {{ p }}
              </el-button>
              <span class="separator" :key="index+'span'" v-if="index !== formatPageNum(scope.row.pages).length-1">||</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="符合情况的文本" prop="content">
          <template slot-scope="scope">
            <p style="padding:0;margin:0;" v-for="(t, index) in scope.row.keywords.split('/n')" :key="index">
              {{ t }}
            </p>
          </template>
        </el-table-column>
      </el-table>
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
import { getTbIndex } from "@/api/ztb/zb";
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
      total: 0,
      tbList: [],
      spanRowsArr: [],
      uploadLoading: false,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + '/ztb/zb/upload',
      uploadErrTip: '只能上传.pdf 文件',
      drawer: false,
      curFileName: '',
      curPdfPage: 1,
    };
  },
  methods: {
    /** 查询【投标文件指标】 */
    getTbFile(filename) {
      this.loading = true;
      getTbIndex({filename})
        .then(res => {
          this.tbList = res.rows;
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

          this.total = res.total;
          this.loading = false;
        })
        .catch(() =>  {
          this.tbList = [];
          this.total = 0;
          this.loading = false;
        });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const arr = this.spanRowsArr;
      const len = arr.length;

      const cuspan = function () {
        const obj = arr.find(item => item.indexArr.includes(rowIndex)) || {};
        return obj;
      }

      const cuspanObj = cuspan();

      if ([0, 1, 2].includes(columnIndex)) {
        if (rowIndex === cuspanObj.indexArr[0]) {
          return {
            rowspan: cuspanObj.num,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    /** upload按钮操作 */
    handleBeforeUpload(file) {
      if (file.type !== "application/pdf") {
        this.$message({
          message: this.uploadErrTip,
          type: 'warning'
        });
        return false;
      }
      this.uploadLoading = true;
    },
    handleRemove() {
      this.fileList = [];
    },
    handleSuc(response, file) {
      if (response.code !== 200) {
        this.$message.error(response.msg || '上传失败！');
      } else {
        this.getTbFile(file.name.slice(0, -4));
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
    },
    handlePreviewPdfOfPage(filename, page) {
      this.curPdfPage = +page;
      this.drawer = true;
      this.curFileName = filename;
    },
    formatPageNum(pagesStr) {
      if (!pagesStr) return [];
      const arr_ = pagesStr.split('||');
      return arr_.filter(p => +p > 0)
    }
  }
};
</script>

<style lang="less" scope>
  .content {
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
