<template>
  <div class="ztb-container">
    <div class="bg"></div>
    <div class="formWrap">
      <el-tabs v-model="activeName" >
    <el-tab-pane label="招标" name="first">
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
      <el-card class="box-card" v-if="zbList && zbList.length > 0">
        <div slot="header" class="clearfix">
          <span style="color: #909399;font-weight: 800;">招标项目：</span>
          <span>{{zbList[0].zbProject}}</span>
        </div>
        <div class="text item">
          <el-table border v-loading="loading" :data="zbList.slice(1)">
            <el-table-column label="序号" prop="zid" align="center" min-width="80"/>
            <el-table-column label="序号" prop="zname" min-width="80"/>
            <el-table-column label="评分因素" prop="secondName" min-width="100"/>
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
      </el-card>
    </div>
    </el-tab-pane>
    <el-tab-pane label="投标" name="second">
      <tbFile></tbFile>
    </el-tab-pane>
  </el-tabs>  
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
import { getZbIndex, getTbIndex ,editZb} from "@/api/ztb/zb";
import PreviewPdf from '@/components/PreviewPdf'
import tbFile from './tbFile'

export default {
  name: "Zb",
  components: {
    PreviewPdf,
    tbFile
  },
  data() {
    return {
      //编辑界面数据
      editForm: {
        
      },
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
    // this.getTbFile('中核武汉核电运行技术股份有限公司_投标文件');
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
                this.getZbFile("秦二厂低、中水平放射性固体废物钢桶等材料一批采购项目-招标文件发标版本(1).docx");

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

<style lang="less" scope>
.bg{width:100%;
height:140px;
  background:#d7ebff;}
.ztb-container .content{
width:100%;
}
  .formWrap{
    padding-top:20px;
    
    padding-bottom:5px;

  }
  .formWrap{
    width:80%;
    margin:-140px auto 0;
  }
  .formWrap .el-form-item {
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
  .el-tabs__nav-wrap::after{background-color: #badcff;}
</style>
