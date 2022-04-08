<template>
  <div class="zb-container">
    <el-form label-width="100px" class="upload-form">
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
    </el-form>
    
    <div class="content">
      <h3 class="list-tile">
        <span style="color: #909399;font-weight: 800;">招标项目：</span>
        <span>{{zbList.length > 0 ? zbList[0].zbProject : ''}}</span>
      </h3>
      <el-table border v-loading="loading" :data="zbList.slice(1)" height="500">
        <el-table-column label="序号" prop="zid" align="center" min-width="80"/>
        <el-table-column :label="zbList.length > 0 ? zbList[0].zname : '评分因素'" prop="zname" min-width="80"/>
        <!-- <el-table-column label="评分因素" prop="secondName" min-width="100"/> -->
        <el-table-column label="评分标准" prop="shirdName" min-width="160"/>
        <el-table-column label="分值" prop="score" min-width="80"></el-table-column>
        <el-table-column label="推荐目录" prop="catalogDesc" min-width="150"></el-table-column>
        <el-table-column label="推荐子目录" prop="rules" min-width="120"></el-table-column>
        <el-table-column label="推荐关键词" prop="keywords" min-width="150"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--编辑界面-->
    <el-dialog title="编辑信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" ref="editForm" size="mini">
        <el-form-item label="序号" prop="zid">
          <el-input v-model="editForm.zid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="zname">
          <el-input v-model="editForm.zname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="评分因素" prop="secondName">
          <el-input v-model="editForm.secondName" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="评分标准" prop="shirdName" >
          <el-input v-model="editForm.shirdName" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input v-model="editForm.score" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="推荐目录" prop="catalogDesc" >
          <el-input v-model="editForm.catalogDesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="推荐子目录" prop="rules">
          <el-input v-model="editForm.rules" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="推荐关键词" prop="keywords">
          <el-input v-model="editForm.keywords" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click.native="editFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getZbIndex ,editZb} from "@/api/ztb/zb";

export default {
  name: "ZB",
  data() {
    return {
      //编辑界面数据
      editForm: {},
      editLoading: false,
      editFormVisible: false, //编辑界面是否显示
      activeName: 'first',
      // 遮罩层
      loading: false,
      zbList: [],
      uploadLoading: false,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + '/ztb/zb/uploadzbFile',
      uploadErrTip: '只能上传.docx 文件',
      drawer: false,
      curFileName: '',
      curPdfPage: 1,
    };
  },
  created() {
    this.getZbFile("秦二厂低、中水平放射性固体废物钢桶等材料一批采购项目-招标文件发标版本(1).docx");
  },
  methods: {
    //编辑
    editSubmit: function() {
      this.$confirm("确认提交吗？", "提示", {
        type: "warning",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini"
        }).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            editZb(para).then(res => {
              this.editLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getZbFile(res.data);

            });
          });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row, { index: index });
      console.log(this.editForm)
    },
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
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>

<style lang="less" scope>
  .content {
    padding: 20px 0;
  }
  .content .list-title {
    font-size: 16px;
  }
  .el-upload__tip {
    margin-left: 8px;
    color: #F56C6C;
  }
  .separator {
    margin: 0 6px;
    color: #CCC;
  }
  .el-tabs__nav-wrap::after{background-color: #badcff;}
</style>
