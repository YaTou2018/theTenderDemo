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
        <span>{{zbList.length > 0 ? zbList[0].project : ''}}</span>
        <div class="float: right;">
          <el-button type="primary" :class="{opacity03: !isView}" icon="el-icon-view" size="mini" @click="isView = true">预览</el-button>
          <el-button type="warning" :class="{opacity03: isView}" icon="el-icon-edit" size="mini" @click="isView = false">编辑</el-button>
        </div>
      </h3>
      <!-- s -->
      <a-table v-show="!isView" :columns="columns" :data-source="zbList" rowKey="id" bordered :scroll="{ x: 1300 }">
        <template
          v-for="col in editColumnList"
          :slot="col"
          slot-scope="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, col)"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.id)">Save</a>
              <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">
                <a style="margin-left: 8px;">Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a :disabled="editingKey !== ''" @click="() => edit(record.id)">Edit</a>
            </span>
          </div>
        </template>
      </a-table>
      <!-- e -->
      <ZbViewTable v-show="isView" :zbList="zbList" />
    </div>
    <!--编辑界面-->
    
  </div>
</template>

<script>
import { Table, Input, Popconfirm } from 'ant-design-vue';
import { getZbIndex ,editZb} from "@/api/ztb/zb";
import ZbViewTable from "./ZbFilePreview"

export default {
  name: "ZB",
  components: {
    ATable: Table,
    AInput: Input,
    APopconfirm: Popconfirm,
    ZbViewTable
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'zid',
          scopedSlots: { customRender: 'zid' },
        },
        {
          title: '序号2',
          dataIndex: 'zname',
          scopedSlots: { customRender: 'zname' },
        },
        {
          title: '评分因素',
          dataIndex: 'secondName',
          scopedSlots: { customRender: 'secondName' },
        },
        {
          title: '评分标准',
          dataIndex: 'shirdName',
          scopedSlots: { customRender: 'shirdName' },
        },
        {
          title: '分值',
          dataIndex: 'score',
          scopedSlots: { customRender: 'score' },
        },
        {
          title: '推荐目录',
          dataIndex: 'catalogDesc',
          scopedSlots: { customRender: 'catalogDesc' },
        },
        {
          title: '推荐子目录',
          dataIndex: 'rules',
          scopedSlots: { customRender: 'rules' },
        },
        {
          title: '推荐关键词',
          dataIndex: 'keywords',
          scopedSlots: { customRender: 'keywords' },
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
          width: 120,
          align: 'center',
        },
      ],
      cacheData: [],
      editingKey: '',
      //编辑界面数据
      editForm: {},
      activeName: 'first',
      // 遮罩层
      loading: false,
      zbList: [],
      uploadLoading: false,
      fileList: [],
      action: process.env.VUE_APP_BASE_API + '/ztb/zb/uploadzbFile',
      uploadErrTip: '只能上传 .docx，.doc，.pdf 文件',
      isView: true,
    };
  },
  computed: {
    editColumnList() {
      return this.columns.slice(0, -1).map(item => item.dataIndex)
    }
  },
  created() {
    this.getZbFile("秦二厂低、中水平放射性固体废物钢桶等材料一批采购项目-招标文件发标版本(1).docx");
  },
  methods: {
    handleChange(value, id, column) {
      const newData = [...this.zbList];
      const target = newData.find(item => id === item.id);
      if (target) {
        target[column] = value;
        this.zbList = newData;
      }
    },
    edit(id) {
      const newData = [...this.zbList];
      const target = newData.find(item => id === item.id);
      this.editingKey = id;
      if (target) {
        target.editable = true;
        this.zbList = newData;
      }
    },
    save(id) {
      const newData = [...this.zbList];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => id === item.id);
      const targetCache = newCacheData.find(item => id === item.id);
      
      editZb(target).then(res => {
        if (res.code === 200) {
          if (target && targetCache) {
            delete target.editable;
            this.zbList = newData;
            Object.assign(targetCache, target);
            this.cacheData = newCacheData;
          }
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.editingKey = '';
        } else {
          this.$message({
            message: "操作失败",
            type: "warning"
          });
        }
      });

      this.editingKey = '';
    },
    cancel(id) {
      const newData = [...this.zbList];
      const target = newData.find(item => id === item.id);
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.find(item => id === item.id));
        delete target.editable;
        this.zbList = newData;
      }
    },
    /** 查询【招标文件指标】 */
    getZbFile(filename) {
      this.loading = true;
      getZbIndex({filename})
        .then(res => {
          this.zbList = res.rows.map((item, i) => {
            if (i === 0) {
              item.keywords = item.keywords || '推荐关键词';
              item.rules = item.rules || '推荐子目录';
              item.catalogDesc = item.catalogDesc || '推荐目录';
            }
            return item;
          });
          this.cacheData = [...res.rows];
          
          this.loading = false;
        })
        .catch(() =>  {
          this.zbList = [];
          this.cacheData = [];
          this.loading = false;
        });
    },
    /** upload按钮操作 */
    handleBeforeUpload(file) {
      console.log(file)
      const fileTypeList = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf", "application/msword" ]
      if (!fileTypeList.includes(file.type)) {
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
  .ant-table-thead {
    display: none;
  }
  .el-tabs__nav-wrap::after{background-color: #badcff;}
  .opacity03 {
    opacity: 0.3;
  }
</style>
