<template>
  <el-table border :data="zbList" :span-method="objectSpanMethod">
    <el-table-column label="序号" prop="zid" align="center" min-width="80"/>
    <el-table-column :label="zbList.length > 0 ? zbList[0].zname : '评分因素'" prop="zname" min-width="80"/>
    <el-table-column label="评分因素" prop="secondName" min-width="100"/>
    <el-table-column label="评分标准" prop="shirdName" min-width="160"/>
    <el-table-column label="分值" prop="score" min-width="80"></el-table-column>
    <el-table-column label="推荐目录" prop="catalogDesc" min-width="150"></el-table-column>
    <el-table-column label="推荐子目录" prop="rules" min-width="120"></el-table-column>
    <el-table-column label="推荐关键词" prop="keywords" min-width="150"></el-table-column>
  </el-table>
</template>

<script>
import { Table } from 'ant-design-vue';

export default {
  name: "ZbViewTable",
  props: {
    zbList: {
      type: Array,
      default: [],
      required: true,
    }
  },
  components: {
    ATable: Table,
  },
  data() {
    return {};
  },
  computed: {
    spanRowsArrZid() {
      // -----查询重复的zid
      var arr = [];// [{name: 'zh', num: 1, indexArr: [0, 1]}]
      var cuIndex = function(val) {
        return arr.findIndex(item => item.name === val);
      }
      this.zbList.forEach((item, i) => {
        var inNum = cuIndex(item.zid);
        if (inNum > -1) {
          const len_ = arr[inNum].indexArr.length;
          if ((i - 1) === arr[inNum].indexArr[len_ - 1]) {
            arr[inNum].num+=1;
            arr[inNum].indexArr.push(i)
          }
        } else {
          arr.push({name: item.zid, num: 1, indexArr: [i]})
        }
      });
      return arr;
    },
    spanRowsArrZname() {
      // -----查询重复的zid
      var arr = [];// [{name: 'zh', num: 1, indexArr: [0, 1]}]
      var cuIndex = function(val) {
        return arr.findIndex(item => item.name === val);
      }
      this.zbList.forEach((item, i) => {
        if (String(item.zname)) {
          var inNum = cuIndex(item.zname);
          if (inNum > -1) {
            const len_ = arr[inNum].indexArr.length;
            if ((i - 1) === arr[inNum].indexArr[len_ - 1]) {
              arr[inNum].num+=1;
              arr[inNum].indexArr.push(i)
            }
          } else {
            arr.push({name: item.zname, num: 1, indexArr: [i]})
          }
        }
      });
      return arr;
    },
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const spanRowsArrZid = this.spanRowsArrZid;
      const cuspan = function () {
        const obj = spanRowsArrZid.find(item => item.indexArr.includes(rowIndex));
        return obj;
      }
      const cuspanObj = cuspan();
      // 
      const spanRowsArrZname = this.spanRowsArrZname
      const cuspan_zname = function () {
        const obj = spanRowsArrZname.find(item => item.indexArr.includes(rowIndex));
        return obj;
      }
      const cuspanObj_zname = cuspan_zname();

      if (columnIndex === 0 && cuspanObj) {
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
      } else if (columnIndex === 1 && cuspanObj_zname){
        if (rowIndex === cuspanObj_zname.indexArr[0]) {
          return {
            rowspan: cuspanObj_zname.num,
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
  .el-table__header-wrapper {
    display: none;
  }
</style>
