<template>
  <div>
    <a-card :style="{ minHeight: `${minHeight}px` }" :bordered="false">
      <span slot="title">
        <a-space direction="vertical">
          <a-form layout="inline" class="title-form">
            <a-form-item label="标题">
              <a-input v-model.trim="searchData.title" placeholder="输入标题" allowClear />
            </a-form-item>
            <a-form-item label="英文标题">
              <a-input v-model.trim="searchData.title_en" placeholder="输入英文标题" allowClear />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-divider type="vertical" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" :loading="initAddBtnLoading" @click="initAddModal">添加</a-button>
            </a-form-item>
          </a-form>
        </a-space>
      </span>
      <a-table
        bordered
        @change="tableChange"
        :columns="columns"
        :pagination="pagination"
        :loading="tableLoading"
        :rowKey="(record) => record.typeId"
        :data-source="tableData"
        :scroll="{ x: 800, y: taHeight }"
      >
      <template slot="pic_url" slot-scope="record">
        <a href="javascript:void(0)">
          <img v-if="record" :src="record.length > 0  && record[0].url" alt="" style="width: 50px; height: 34px; margin-right: 10px" @click="showPhoto(record)" />
        </a>
      </template>
      <template slot="pic_url_en" slot-scope="record">
        <a href="javascript:void(0)">
          <img v-if="record" :src="record.length > 0 && record[0].url" alt="" style="width: 50px; height: 34px; margin-right: 10px" @click="showPhoto(record)" />
        </a>
      </template>
        <span slot="action" slot-scope="record">
          <a class="mr8" @click="initEditModal(record)"> <a-icon type="edit" style="margin-right: 5px;" />编辑 </a>
          <a-popconfirm title="是否要删除?" ok-text="删除" cancel-text="取消" @confirm="handleDelete(record.id)">
            <a class="mr8" href="#"><a-icon type="delete" style="margin-right: 5px;" />删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <!-- 编辑 -->
    <a-modal width="90%" :visible="visible" :title="isEdit ? '编辑资讯' : '添加资讯'" @cancel="hideModal" @ok="handleOk" centered>
      <a-row type="flex" justify="start" class="mt20">
        <a-col :md="8" :sm="8" :xs="8" :span="8" >
          <div class="content_inner" v-if="detail">
            <div class="top-content" style="text-align: right;margin:10px">
              <a-button style="" type="primary" @click="togglePreview">{{ previewCn ? '中文':'英文' }}</a-button>
            </div>
            <div class="title mb60" :style="{ 'fontSize': detail.titleFontSize+'px'}">{{ detail.myTitle }}</div>
            <div class="content b-f mb60 clearfix" v-html="detail.myContents"></div>
          </div>
        </a-col>
        <a-col :md="16" :sm="16" :xs="16" :span="16" >
          <a-form
            :model="editData"
            v-bind="{
              labelCol: {
                span: 6,
              },
              wrapperCol: {
                span: 18,
              },
            }"
          >
          <a-row type="flex" justify="space-between" class="mt20">
            <a-col :md="12" :sm="12" :xs="12" :span="12" >
              <a-form-item label="是否首页置顶">
                <a-input-number v-model="editData.index_top" :min="0" :max="100" />
              </a-form-item>
            </a-col>
            <a-col push="10" :md="12" :sm="12" :xs="12" :span="12" >
              <a-form-item>
                <a-button type="primary" :loading="btnLoading" @click="handleOk">保存</a-button>
              </a-form-item>
            </a-col>
          </a-row>
          
          <a-row type="flex" justify="space-between" class="mt20">
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="标题">
              <a-input v-model.trim="editData.title" placeholder="请输入标题" />
            </a-form-item>
            </a-col>
            <a-col :md="11" :sm="11" :xs="11" :span="11" offset="1">
              <a-form-item label="英文标题">
              <a-input v-model.trim="editData.title_en" placeholder="请输入英文标题" />
            </a-form-item>
            </a-col>
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="字体大小">
                <a-slider :marks="marks" v-model="editData.setup.title_size" :default-value="30" :min="25" :max="45" @afterChange="titleFontChange($event,'cn')" />
              </a-form-item>
            </a-col>
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="英文字体大小">
                <a-slider :marks="marks" v-model="editData.setup.title_size_en" :default-value="30" :min="25" :max="45" @afterChange="titleFontChange($event,'en')" />
              </a-form-item>
            </a-col>

            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="描述">
                <a-input type="textarea" v-model.trim="editData.description" placeholder="请输入描述" style="height:100px" />
              </a-form-item>
            </a-col>
            <a-col :md="11" :sm="11" :xs="11" :span="11" offset="1">
              <a-form-item label="英文描述">
                <a-input type="textarea" v-model.trim="editData.description_en" placeholder="请输入英文描述" style="height:100px" />
              </a-form-item>
            </a-col>
            <!-- <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="缩略图">
                <imgUpload v-if="visible" multiple :maxCount="2" :urls="editData.pic_url" @uploadImgChange="uploadImgChange($event,'pic_url')" />
              </a-form-item>
            </a-col> -->
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="缩略图">
                <imgCropUpload v-if="visible" multiple :maxCount="2" :urls="editData.pic_url" @uploadImgChange="uploadImgChange($event,'pic_url')" />
              </a-form-item>
            </a-col>
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="英文缩略图">
                <imgCropUpload v-if="visible" multiple :maxCount="2" :urls="editData.pic_url_en" @uploadImgChange="uploadImgChange($event,'pic_url_en')" />
              </a-form-item>
            </a-col>
            
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="内容">
                <a-button type="primary" style="width:120px" :loading="contentModal.btnLoading" @click="initContentModal('CN')">编辑内容</a-button>
                <!-- <editorBar v-if="visible" v-model="editData.contents" height="800px"></editorBar> -->
              </a-form-item>
            </a-col>
            <a-col :md="11" :sm="11" :xs="11" :span="11">
              <a-form-item label="英文内容">
                <a-button type="primary" style="width:120px" :loading="contentModal.btnLoading" @click="initContentModal('EN')">编辑英文内容</a-button>
                <!-- <editorBar v-if="visible" v-model="editData.contents_en" height="800px"></editorBar> -->
              </a-form-item>
            </a-col>
          </a-row>
          </a-form>
        </a-col>
      </a-row>
      
      <template #footer>
        <a-button key="back" @click="hideModal">关闭</a-button>
        <!-- <a-button key="submit" type="primary" :loading="btnLoading" @click="handleOk">保存</a-button> -->
      </template>
    </a-modal>

    <!-- 预览 -->
    <a-modal width="80%" :visible="contentModal.show" :title="contentModal.title" @cancel="contentModal.show = false" centered>
      <div class="contentModal_inner">
        <editorBar v-if="contentModal.show" v-model="contentModal.contents" height="800px"></editorBar>
      </div>
      <template #footer>
        <a-button key="back" @click="contentModal.show = false">关闭</a-button>
        <a-button type="primary" @click="handleEditSave">保存</a-button>
      </template>
    </a-modal>
    <previewImgModal ref="previewImgModalRef" :imgUrl="photo" />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash-es';
import { BASE_PAGINATION } from '@/rayframework/common-pagination';
// import imgUpload from '@/components/my/imgUpload.vue';
import imgCropUpload from '@/components/my/imgCropUpload.vue';
import previewImgModal from '@/components/my/previewImgModal.vue';
import editorBar from '@/components/my/editorBar'
import { isJSONString} from '@/utils/util.js'
import {
  infomationListQuery,
  infomationDetail,
  infomationAdd,
  infomationUpdate,
  infomationDel,
} from '../api';
const  editData = {
  title: '', //	标题
  pic_url: '', //缩略图
  description:'',//描述
  contents: '', //内容
  title_en: '', //英文标题
  pic_url_en: '', //英文缩略图
  description_en:'',//英文描述
  contents_en: '', //英文内容
  index_top: 0, //是否首页置顶
  setup: {
    title_size: 30,
    title_size_en: 30
  } 
}
const detail = {
  myTitle:'',
  myDescription : '',
  myPicUrl : '',
  myContents : ''
}


export default {
  components: {imgCropUpload,editorBar,previewImgModal },
  data() {
    return {
      minHeight: window.innerHeight - 124,
      taHeight: window.innerHeight - 416,
      pagination: cloneDeep(BASE_PAGINATION),
      orderFieldName: 'typeId',
      orderDirection: 'descend',  //排序 ascend descend
      tableData: [],
      tableLoading: false,
      photo: '',
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '英文标题',
          dataIndex: 'title_en',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '缩略图',
          dataIndex: 'pic_url',
          scopedSlots: {
            customRender: 'pic_url',
          },
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '英文缩略图',
          dataIndex: 'pic_url_en',
          scopedSlots: {
            customRender: 'pic_url_en',
          },
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '置顶参数',
          dataIndex: 'index_top',
          align: 'center',
          width: 50,
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action' },
        },
      ],
      visible: false,
      isEdit: false,
      editData: cloneDeep(editData),
      initAddBtnLoading: false,
      btnLoading: false,
      searchData: {
        title: '',
        title_en: '',
      },
      contentModal: {
        title: '内容',
        btnLoading:false,
        show: false,
        contents:''
      },
      detail: cloneDeep(detail),
      curContent_type: 'CN',//当前内容类型（CN,EN）
      previewCn: true,
      marks: {
        25: '25',
        30: '30',
        35: '35',
        40: '40',
        45: '45',
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    titleFontChange(e, type) { 
      console.log('e====',e)
      if (type == 'cn') {
        this.editData.setup.title_size = e;
      } else { 
        this.editData.setup.title_size_en = e;
      }
    },
    //查看图片
    showPhoto(value) {
      if (!value || value.length == 0) return
      this.photo = value[0].url;
      this.$refs.previewImgModalRef.initModal();
    },
    uploadImgChange(arr, type) {
      this.editData[type] = arr.map(item => {
        return {
          name:item.name,
          url:item.url
        }
       });
    },
    initContentModal(type) { 
      this.contentModal.show = true;
      this.curContent_type = type;
      if (type === 'CN') {
        this.contentModal.contents = this.editData.contents
        this.contentModal.title = '编辑内容';
      } else { 
        this.contentModal.contents = this.editData.contents_en;
        this.contentModal.title = '编辑英文内容';
      }
    },
    initPreviewModal(item) {
      this.tableLoading = true;
      infomationDetail({
        id: item.id,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const { data } = res.data;
          data.pic_url = isJSONString(data.pic_url) ? JSON.parse(data.pic_url) :[]
          data.pic_url_en = isJSONString(data.pic_url_en) ? JSON.parse(data.pic_url_en) : []
          this.editData = data;
          this.previewShow = true;
          this.checkDataOflang();
        }
      });
    },
    // 添加详情
    initAddModal() {
      this.isEdit = false;
      this.visible = true;
    },
    // 编辑详情
    initEditModal(item) {
      // this.editData = cloneDeep(item);
      this.tableLoading = true;
      infomationDetail({
        id: item.id,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const { data } = res.data;
          data.pic_url = isJSONString(data.pic_url) ? JSON.parse(data.pic_url) :[]
          data.pic_url_en = isJSONString(data.pic_url_en) ? JSON.parse(data.pic_url_en) : []
          data.setup = isJSONString(data.setup) ? JSON.parse(data.setup) : {}
          this.editData = data;
          this.visible = true;
          this.isEdit = true;
          this.checkDataOflang();
        }
      });
    },
    togglePreview() { 
      this.previewCn = !this.previewCn;
      this.checkDataOflang()
    },
    checkDataOflang (){ 
      // console.log('detail===', state.detail)
      const previewCn = this.previewCn;
      const {title,title_en,setup,description,description_en,pic_url,pic_url_en,contents,contents_en } = this.editData
      this.detail.myTitle = previewCn ? title : title_en;
      this.detail.titleFontSize = previewCn ? setup.title_size : setup.title_size_en;
      this.detail.myDescription = previewCn ? description:description_en
      this.detail.myPicUrl = previewCn ? pic_url[0].url:pic_url_en[0].url
      this.detail.myContents = previewCn ? contents:contents_en
    },
    handleEditSave() { 
      if (this.curContent_type == 'CN') {
        this.editData.contents = this.contentModal.contents;
      } else { 
        this.editData.contents_en = this.contentModal.contents;
      }
      this.contentModal.show = false;
    },
    hideModal() {
      this.visible = false;
      this.editData = cloneDeep(editData);
      this.detail = cloneDeep(detail);
      this.getList();
    },
    handleOk() {
      if (this.editData.title == '') {
        this.$message.warning('请输入标题！');
        return;
      }
      if (this.editData.title_en == '') {
        this.$message.warning('请输入英文标题！');
        return;
      }
      // if(this.editData.title.length <3 || this.editData.title.length > 100){
      //     this.$message.warning('标题长度控制在3到100字符！');
      //   return;
      // }
      // if(this.editData.title_en.length <3 || this.editData.title_en.length > 150){
      //     this.$message.warning('英文标题长度控制在3到150字符！');
      //   return;
      // }
      if (this.editData.pic_url == []) {
        this.$message.warning('请上传缩略图！');
        return;
      }
      if (this.editData.pic_url_en == []) {
        this.$message.warning('请上传英文缩略图！');
        return;
      }
      if (this.editData.description == '') {
        this.$message.warning('请输入描述！');
        return;
      }
      if (this.editData.description_en == '') {
        this.$message.warning('请输入英文描述！');
        return;
      }
      if (this.editData.contents == '') {
        this.$message.warning('请输入内容！');
        return;
      }
      if (this.editData.contents_en == '') {
        this.$message.warning('请输入英文内容！');
        return;
      }
      this.editData.pic_url = JSON.stringify(this.editData.pic_url)
      this.editData.pic_url_en = JSON.stringify(this.editData.pic_url_en)
      this.editData.setup = JSON.stringify(this.editData.setup)
      if (this.isEdit) {
        this.btnLoading = true;
        infomationUpdate({
            ...this.editData,
          }).then((res) => {
            this.btnLoading = false;
            if (res.data.code == 200) {
              // this.hideModal();
              this.$message.success('保存成功！');
              this.initEditModal(this.editData)
            }
          });
      } else {
        this.btnLoading = true;
        infomationAdd({
          ...this.editData,
        }).then((res) => {
          this.btnLoading = false;
          if (res.data.code == 200) {
            this.hideModal();
            // this.getList();
          }
        });
      }
    },
    handleDelete(id) {
      this.tableLoading = true;
      infomationDel({
        id,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.getList();
        }
      });
    },
    getList() {
      const { current,pageSize } = this.pagination;
      // const { orderDirection, orderFieldName } = this;
      this.tableLoading = true;
      infomationListQuery({
        page: current,
        pageSize,
        // orderDirection,
        // orderFieldName,
        ...this.searchData,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const { list, count } = res.data.data;
          list.map(item => { 
            item.pic_url = isJSONString(item.pic_url) ? JSON.parse(item.pic_url) :[]
            item.pic_url_en = isJSONString(item.pic_url_en) ? JSON.parse(item.pic_url_en) : []
          })
          this.tableData = list;
          this.pagination.total = count;
        }
      });
    },
    // 表格数据排序
    tableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.orderFieldName = sorter.columnKey ? sorter.columnKey : '';
      this.orderDirection = sorter.order ? sorter.order : '0';
      this.getList();
    },
    handleSearch() {
      this.pagination.current = 1;
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
// @import url('../../../../style/layout.less');
.content_inner{
  max-width:675px;
  margin:0 auto;
  padding-top:10px;
  background: #eee;
  .title{
    // font-size:40px;
    text-align: center;
    color:#000;
    border-radius:8px;
    max-width:400px;
    margin:0 auto;
    background:#fff;
  }
  .img{
    height:300px;
    width:auto;
    border-radius:8px;

  }
  .content{
    font-size:24px;
    color:#000;
    padding:20px;
    max-width:1000px;
    border-radius:8px;
    margin:20px auto;
    /deep/img{
      width: 100% !important;
    }
    /deep/p:has(>img){
      text-indent: 0 !important; 
    }
  }
}
</style>
