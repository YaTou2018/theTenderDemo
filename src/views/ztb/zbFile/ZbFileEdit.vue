<template>
  <a-table :columns="columns" :data-source="zbList" rowKey="id" bordered :scroll="{ x: 1300 }">
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
</template>

<script>
import { Table, Input, Popconfirm } from 'ant-design-vue';
import { getZbIndex ,editZb} from "@/api/ztb/zb";

export default {
  name: "ZbEditTable",
  props: {
    zbList: Array
  },
  components: {
    ATable: Table,
    AInput: Input,
    APopconfirm: Popconfirm
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
      zbList: [],
    };
  },
  computed: {
    editColumnList() {
      return this.columns.slice(0, -1).map(item => item.dataIndex)
    }
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
    }
  }
};
</script>

<style lang="less" scope>
  .ant-table-thead {
    display: none;
  }
</style>
