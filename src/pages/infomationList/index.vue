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
      <template slot="pic_url" slot-scope="record" v-if="record">
        <a href="javascript:void(0)">
          <img :src="record[0].url" alt="" style="width: 50px; height: 34px; margin-right: 10px" @click="showPhoto(record)" />
        </a>
      </template>
      <template slot="pic_url_en" slot-scope="record" v-if="record">
        <a href="javascript:void(0)">
          <img :src="record[0].url" alt="" style="width: 50px; height: 34px; margin-right: 10px" @click="showPhoto(record)" />
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
    <a-modal width="80%" :visible="visible" :title="isEdit ? '编辑资讯' : '添加资讯'" @cancel="hideModal" @ok="handleOk" centered>
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
      <a-row type="flex" justify="end" class="mt20">
        <a-col :md="10" :sm="10" :xs="10" :span="10" >
          <a-form-item label="是否首页置顶">
            <a-input-number v-model="editData.index_top" :min="0" :max="100" />
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
          <a-form-item label="描述">
            <a-input type="textarea" v-model.trim="editData.description" placeholder="请输入描述" style="height:100px" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11" offset="1">
          <a-form-item label="英文描述">
            <a-input type="textarea" v-model.trim="editData.description_en" placeholder="请输入英文描述" style="height:100px" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="缩略图">
            <imgUpload v-if="visible" multiple :maxCount="2" :urls="editData.pic_url" @uploadImgChange="uploadImgChange($event,'pic_url')" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="英文缩略图">
            <imgUpload v-if="visible" multiple :maxCount="2" :urls="editData.pic_url_en" @uploadImgChange="uploadImgChange($event,'pic_url_en')" />
          </a-form-item>
        </a-col>
      </a-row>
        <a-form-item label="内容" v-bind="{
          labelCol: {
            span: 2,
          },
          wrapperCol: {
            span: 22,
          },
        }">
          <editorBar v-if="visible" v-model="editData.contents" height="300px"></editorBar>
        </a-form-item>
        <a-form-item label="英文内容" v-bind="{
          labelCol: {
            span: 2,
          },
          wrapperCol: {
            span: 22,
          },
        }">
          <editorBar v-if="visible" v-model="editData.contents_en" height="300px"></editorBar>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="hideModal">取消</a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="handleOk">保存</a-button>
      </template>
    </a-modal>
    <previewImgModal ref="previewImgModalRef" :imgUrl="photo" />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash-es';
import { BASE_PAGINATION } from '@/rayframework/common-pagination';
import imgUpload from '@/components/my/imgUpload.vue';
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
  index_top:0 //是否首页置顶
}


export default {
  components: { imgUpload, editorBar,previewImgModal },
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
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //查看图片
    showPhoto(value) {
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
    initAddModal() {
      this.isEdit = false;
      this.visible = true;
    },
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
          this.editData = data;
          this.visible = true;
          this.isEdit = true;
        }
      });
    },
    hideModal() {
      this.visible = false;
      this.editData = cloneDeep(editData);
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
      if(this.editData.title.length <3 || this.editData.title.length > 100){
          this.$message.warning('标题长度控制在3到100字符！');
        return;
      }
      if(this.editData.title_en.length <3 || this.editData.title_en.length > 150){
          this.$message.warning('英文标题长度控制在3到150字符！');
        return;
      }
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
      if (this.isEdit) {
        this.btnLoading = true;
        infomationUpdate({
            ...this.editData,
          }).then((res) => {
            this.btnLoading = false;
            if (res.data.code == 200) {
              this.hideModal();
              this.getList();
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
            this.getList();
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
</style>
