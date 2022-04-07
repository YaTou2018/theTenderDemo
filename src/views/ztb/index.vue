<template>
  <div class="ztb-container">
    <div class="searchWrap">
      <el-form  :model="queryParams" class="form-inline">
        <el-form-item label="请选择检索方式">
          <el-input placeholder="请输入内容" v-model="queryParams.content" class="input-with-select" clearable>
            <el-select v-model="queryParams.query" slot="prepend" placeholder="请选择检索方式">
              <el-option  v-for="item in searchType" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="请选择开标时间">
          <el-date-picker
          name="dateTime"
          v-model="dateTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btnSumit">
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-collapse  class="leftSearch">
            <el-collapse-item title="资金来源" name="1">
              <el-checkbox-group   v-model="leftData1" @change="search()">
                <el-checkbox v-for="item in leftList.fund" :label="item.fund" :key="item.fund" :title="item.fund">{{item.fund}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="招标人" name="2">
              <el-checkbox-group   v-model="leftData2"  @change="search()">
                <el-checkbox v-for="item in leftList.tender" :label="item.tender" :key="item.tender" :title="item.tender">{{item.tender}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="招标代理机构" name="3">
              <el-checkbox-group   v-model="leftData3" @change="search()">
                <el-checkbox v-for="item in leftList.agency" :label="item.agency" :key="item.agency" :title="item.agency">{{item.agency}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="地点" name="4">
              <el-checkbox-group   v-model="leftData4" @change="search()">
                <el-checkbox v-for="item in leftList.province" :label="item.province" :key="item.province" :title="item.province">{{item.province}}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col :span="19">
          <el-table border v-loading="loading" :data="zbList"  :header-cell-style="headerStyle" class="tableList" >
            <el-table-column label="序号" type="index"  align="center" width="80" :index="buildIndex" />
            <el-table-column label="项目名称" min-width="200">
              <template slot-scope="scope">
                <span v-html="scope.row.projectname"></span>
              </template>
            </el-table-column>
            <el-table-column label="招标编号" prop="no" min-width="120" />
            <el-table-column label="招标人" min-width="120">
              <template slot-scope="scope">
                <span v-html="scope.row.tender"></span>
              </template>
            </el-table-column>
            <el-table-column label="开标时间" prop="starttime" min-width="100" />
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看文件</el-button>
            </template>
            </el-table-column>
          </el-table>
          <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.currentPage"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
        </el-col>
      </el-row>

    </div>
    <el-drawer title="" :visible.sync="showDrawer" :with-header="false" size="80%" @close="handleDocClose">
      <div id="docbox" style="width: 100%;height: 100%;">
        <div id="iframeEditor" style="width: 100%;height: 100%;"></div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getList , getLeft} from "@/api/ztb/zb";

export default {
  name: "Zb",
  data() {
    return {
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        currentPage: 1,
        pageSize: 10,
        startTime:"",
        endTime:"",
        query:"",
        content: "",
        groupV:"",
      },
      dateTime:[],
      leftList : {},
      leftData1:[],
      leftData2:[],
      leftData3:[],
      leftData4:[],
      headerStyle:{background:'#f4fafe',color:'#999999'},
      searchType:[
        {name:'全文',id:'content'},
        {name:'关键词',id:'keywords'},
        {name:'项目名称',id:'projectname'},
        {name:'招标人',id:'tender'},
        {name:'招标代理机构',id:'agency'},
        {name:'招标编码',id:'no'},
        {name:'招标地点',id:'address'},
        {name:'招标范围',id:'scope'},
      ],
      select:"",
      // 遮罩层
      loading: false,
      zbList: [],
      showDrawer: false,
    };
  },
  created() {
    this.getLeft();
    this.getList();
  },
  methods: {
    /** 查询数据列表 */
    getList() {
      this.loading = true;
      let parm={
        fund:this.leftData1,
        tender:this.leftData2,
        agency:this.leftData3,
        province:this.leftData4,
      }
      this.queryParams.groupV=JSON.stringify(parm);
      if(this.dateTime && this.dateTime.length){
        this.queryParams.startTime=this.dateTime[0];
        this.queryParams.endTime=this.dateTime[1];
      }else{
        this.queryParams.startTime="";
        this.queryParams.endTime="";
      }
      getList(this.queryParams)
        .then(res => {
          this.zbList = res.data.list;
          this.total = res.data.totalCount;
          this.loading = false;
        })
        .catch(() =>  {
          this.zbList = [];
          this.total = 0;
          this.loading = false;
        });
    },
    search(){
      this.queryParams.currentPage=1;
      this.getList();
    },
    /** 查询左侧数据列表 */
    getLeft() {
      getLeft()
        .then(res => {
          this.leftList = res.data;
        })
        .catch(() =>  {
        });
        },
    handleClick(info) {
      this.showDrawer = true;
      const config = {
        document: {
          fileType: "docx",
          title: info.filename,
          url: info.filepath,
          key: String(Date.now()) + String(Math.random()),
          permissions: {
            comment: false,
            download: false,
            edit: true,
            modifyContentControl: true,
            modifyFilter: true,
            print: false,
          }
        },
        documentType: "word",
        editorConfig: {
          callbackUrl: "",
          customization: {
            "forcesave": false,
            autosave: false,
            chat: false,
            comments: false,
            help: false
          },
          mode: "edit",
          lang: "zh-CN"
        },
        height:" 100%",
        width: "100%"
      };
      this.$nextTick(() => {
        new DocsAPI.DocEditor("iframeEditor", config);
      });
    },
    handleDocClose() {
      document.getElementById("docbox").innerHTML = `<div id="iframeEditor" style="width: 100%; height: 100%"></div>`;
    },
    buildIndex(index) {
      return index + 1 + ((this.queryParams.currentPage - 1) * this.queryParams.pageSize)
    }
  }
};
</script>

<style lang="less">
  .searchWrap{
    padding-top:20px;
    background:#d7ebff;
    padding-bottom:5px;

  }
  .searchWrap .form-inline,.content{
    width:80%;
    margin:0 auto;
  }
  .searchWrap .form-inline{
    width:60%;
    position: relative;
  }
  .btnSumit{
    position:absolute;
    right:0;
    top:0;
  }
  .content{
    padding:20px 0;
  }
  .el-table .cell .cr {
    color: #F56C6C;
  }
  .separator {
    margin: 0 6px;
    color: #CCC;
  }
  .el-select .el-input{
    display: inline-block;
    width: 150px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-form-item__content{
    width:70%;float:left;
    .el-range-editor.el-input__inner{
      width:100%;
    }
  }
  .leftSearch{
    border-right: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    .el-collapse-item__header{
      padding-left:10px;
      border-bottom: 1px solid #EBEEF5;
    }
    .el-collapse-item__content{
      padding:10px 20px;
    }
  }
  
</style>
