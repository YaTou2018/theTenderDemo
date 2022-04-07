<template>
  <div class="previewPdf-container">
    <div class="previewPdf-container_header">
      <el-input
        min="1"
        size="small"
        v-model.number="currentPage"
        type="number"
        style="width: 10em"
      />
      <span> / </span>
      <span>{{pageCount}}</span>
    </div>
    <pdf
      ref="myPdfComponent"
      :src="url + fileName"
      :page="currentPage"
      @num-pages="pageCount = $event"
			@page-loaded="currentPage = $event"
    />
  </div>
</template>

<script>
  import pdf from 'vue-pdf'

  export default {
    name: 'PreviewPdf',
    components: {
      pdf
    },
    props: {
      fileName: String,
      curPage:{
        type: Number,
        default: 1,
        required: true,
        validator: function (value) {
          return value >= 0
        }
      }
    },
    data() {
      return {
        url: process.env.VUE_APP_BASE_API + '/ztb/zb/preview/',
        currentPage: 1,
        pageCount: 0,
      };
    },
    watch: {
      curPage: {
        handler: function (val) {
          this.currentPage = val;
        },
        immediate: true
      },
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .previewPdf-container{
    height: 100vh;
    overflow: auto;
    &_header {
      padding: 16px;
    }
  }
</style>
