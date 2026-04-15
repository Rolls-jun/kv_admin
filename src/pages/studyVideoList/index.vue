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
              <a-button type="primary" :loading="initAddBtnLoading" @click="initAddModal('detail')">添加</a-button>
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
      <template slot="product_id" slot-scope="record">
        <a-tag v-if="record === 0" color="#e91e63">未绑定</a-tag>
        <a-tag v-else color="#2db7f5">已绑定</a-tag>
      </template>
        <span slot="action" slot-scope="record">
          <a class="mr8" @click="editDetailModal(record)"> <a-icon type="edit" style="margin-right: 5px;" />编辑 </a>
          <a-popconfirm title="是否要删除?" ok-text="删除" cancel-text="取消" @confirm="handleDelete(record.id)">
            <a class="mr8" href="#"><a-icon type="delete" style="margin-right: 5px;" />删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <!-- 详情modal -->
    <a-modal width="80%" :visible="detailModalInfo.visible" :title="detailModalInfo.isEdit ? '编辑视频' : '添加视频'" @cancel="hideModal('detail');" @ok="handleOk" centered>
      <a-form
        :model="detailData"
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
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="视频标题">
          <a-input v-model.trim="detailData.title" placeholder="请输入视频标题" />
        </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11" offset="1">
          <a-form-item label="英文标题">
          <a-input v-model.trim="detailData.title_en" placeholder="请输入视频英文标题" />
        </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" :xs="24" :span="24">
          <a-form-item
            v-bind="{
              labelCol: {
                span: 3,
              },
              wrapperCol: {
                span: 21,
              },
            }" 
            label="视频连接地址"
          >
            <a-input v-model.trim="detailData.link_url" placeholder="请输入视频标题" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" :xs="24" :span="24">
          <a-form-item 
            v-bind="{
              labelCol: {
                span: 3,
              },
              wrapperCol: {
                span: 21,
              },
            }" 
          label="英文视频连接地址"
          >
            <a-input v-model.trim="detailData.link_url_en" placeholder="请输入视频英文标题" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="描述">
            <a-input type="textarea" v-model.trim="detailData.description" placeholder="请输入描述" style="height:100px" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11" offset="1">
          <a-form-item label="英文描述">
            <a-input type="textarea" v-model.trim="detailData.description_en" placeholder="请输入英文描述" style="height:100px" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="视频封面图">
            <imgUpload v-if="detailModalInfo.visible" multiple :maxCount="2" :urls="detailData.pic_url" @uploadImgChange="detailUploadChange($event,'pic_url')" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="视频英文封面图">
            <imgUpload v-if="detailModalInfo.visible" multiple :maxCount="2" :urls="detailData.pic_url_en" @uploadImgChange="detailUploadChange($event,'pic_url_en')" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="对应产品">
            <a-select 
            show-search
            v-model="detailData.product_id"
            style="width: 220px" 
            :filter-option="filterOption"
            >
              <a-select-option v-for="(product) in productList" :key="product.id" :value="product.id">
                {{ product.title }}(￥{{ product.price }})
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      </a-form>
      <template #footer>
        <a-button key="back" @click="hideModal('detail')">取消</a-button>
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
import {
  linkListQuery,
  linkDetail,
  linkAdd,
  linkUpdate,
  linkDel,
  productListQuery
} from '../api';

const detailData = {
  id:'',
  title: '', //	标题
  product_id: 0,//绑定的产品
  pic_url: '', //封面图
  link_url:'',//视频
  description:'',//描述
  title_en: '', //英文标题
  pic_url_en: '', //英文封面图
  link_url_en:'',//英文视频
  description_en:'',//英文描述
}


export default {
  components: { imgUpload,previewImgModal },
  data() {
    return {
      product_id:'',
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
          title: '视频链接地址',
          dataIndex: 'link_url',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '英文视频链接地址',
          dataIndex: 'link_url_en',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '封面图',
          dataIndex: 'pic_url',
          scopedSlots: {
            customRender: 'pic_url',
          },
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '英文封面图',
          dataIndex: 'pic_url_en',
          scopedSlots: {
            customRender: 'pic_url_en',
          },
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '已绑定产品',
          dataIndex: 'product_id',
          scopedSlots: {
            customRender: 'product_id',
          },
          align: 'center',
          width: 100,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'action' },
        },
      ],
      detailModalInfo: {
        visible: false,
        isEdit: false,
      },
      detailData: cloneDeep(detailData),
      initAddBtnLoading: false,
      btnLoading: false,
      searchData: {
        title: '',
        title_en: '',
      },
      productList:[]
    };
  },
  mounted() {
    console.log(this.$route.query)
    const { id } = this.$route.query
    if (id) {
      this.product_id = id
    } else { 
      this.product_id = 0
    }
    this.getList();
  },
  methods: {
    //查看图片
    showPhoto(value) {
      this.photo = value[0].url;
      this.$refs.previewImgModalRef.initModal();
    },
    // 详情modal上传返回
    detailUploadChange(arr,type) {
      this.detailData[type] = arr.map(item => {
        return {
          name:item.name,
          url:item.url
        }
       });
    },
    initAddModal(type) {
      if (type === 'detail') {
        this.detailModalInfo.visible = true;
        this.detailModalInfo.isEdit = false;
        if (this.product_id) { 
          this.detailData.product_id = this.product_id;
        }
        this.getProductList()
      }
    },
    editDetailModal(item) {
      // this.detailData = cloneDeep(item);
      this.tableLoading = true;
      linkDetail({
        id: item.id,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const { data } = res.data;
          data.pic_url = (data.pic_url && data.pic_url != '[object Object]') ? JSON.parse(data.pic_url) :[]
          data.pic_url_en = (data.pic_url_en && data.pic_url_en != '[object Object]') ? JSON.parse(data.pic_url_en) : []
          data.link_url = (data.link_url && data.link_url != '[object Object]') ? JSON.parse(data.link_url)[0].url :''
          data.link_url_en = (data.link_url_en && data.link_url_en != '[object Object]') ? JSON.parse(data.link_url_en)[0].url:''
          this.detailData = data;
          this.detailModalInfo.visible = true;
          this.detailModalInfo.isEdit = true;
          this.getProductList()
        }
      });
    },
    hideModal(type) {
      if (type==='detail') {
        this.detailModalInfo.visible = false;
        this.detailData = cloneDeep(detailData);
      }
    },
    handleOk() {
      if (this.detailData.title == '') {
        this.$message.warning('请输入视频标题！');
        return;
      }
      if (this.detailData.title_en == '') {
        this.$detailData.warning('请输入视频英文标题！');
        return;
      }
      if (this.detailData.description == '') {
        this.$message.warning('请输入描述！');
        return;
      }
      if (this.detailData.description_en == '') {
        this.$message.warning('请输入英文描述！');
        return;
      }
      if (this.detailData.link_url == '') {
        this.$message.warning('请上传视频！');
        return;
      }
      if (this.detailData.link_url_en == '') {
        this.$message.warning('请上传英文视频！');
        return;
      }
      if (this.detailData.pic_url == '') {
        this.$message.warning('请上传封面图！');
        return;
      }
      if (this.detailData.pic_url_en == '') {
        this.$message.warning('请上传英文封面图！');
        return;
      }
      this.detailData.link_url = [{
        url:this.detailData.link_url
      }]
      this.detailData.link_url_en = [{
        url:this.detailData.link_url_en
      }]
      this.detailData.pic_url = JSON.stringify(this.detailData.pic_url) 
      this.detailData.pic_url_en = JSON.stringify(this.detailData.pic_url_en)
      this.detailData.link_url = JSON.stringify(this.detailData.link_url) 
      this.detailData.link_url_en = JSON.stringify(this.detailData.link_url_en)
      if (this.detailModalInfo.isEdit) {
        this.btnLoading = true;
        linkUpdate({
            ...this.detailData,
          }).then((res) => {
            this.btnLoading = false;
            if (res.data.code == 200) {
              this.hideModal('detail');
              this.getList()
            }
          });
      } else {
        // if (this.product_id == '') {
        //   this.$message.warning('请先完成商品录入');
        //   return;
        // }
        this.btnLoading = true;
        linkAdd({
          type:1,
          product_id:this.product_id,
          ...this.detailData,
        }).then((res) => {
          this.btnLoading = false;
          if (res.data.code == 200) {
            this.hideModal('detail');
            this.getList()
          }
        });
      }
    },
    handleDelete(id) {
      this.tableLoading = true;
      linkDel({
        id,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          this.getList();
        }
      });
    },
    getProductList() {
      productListQuery({
        page: 1,
        pageSiz:100,
      }).then((res) => {
        if (res.data.code == 200) {
          const { list } = res.data.data;
          this.productList = list;
        }
      });
    },
    getList() {
      const { current,pageSize } = this.pagination;
      // const { orderDirection, orderFieldName } = this;
      this.tableLoading = true;
      linkListQuery({
        product_id: this.product_id,
        type:1,
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
            item.pic_url = (item.pic_url && item.pic_url != '[object Object]') ? JSON.parse(item.pic_url) :[]
            item.pic_url_en = (item.pic_url_en && item.pic_url_en != '[object Object]') ? JSON.parse(item.pic_url_en) : []
            item.link_url = (item.link_url && item.link_url != '[object Object]') ? JSON.parse(item.link_url)[0].url :''
            item.link_url_en = (item.link_url_en && item.link_url_en != '[object Object]') ? JSON.parse(item.link_url_en)[0].url:''
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>
<style lang="less" scoped>
// @import url('../../../../style/layout.less');
</style>
