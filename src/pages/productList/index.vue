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
      <template slot="lunbo_pic" slot-scope="record" v-if="record">
        <a href="javascript:void(0)">
          <img :src="record" alt="" style="width: 50px; height: 34px; margin-right: 10px" @click="showPhoto(record)" />
        </a>
      </template>
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
      <template slot="action" slot-scope="record" v-if="record">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a class="mr8" @click="editDetailModal(record)"> <a-icon type="edit" style="margin-right: 5px;" />编辑 </a>
            </a-menu-item>
            <a-menu-item key="2">
              <a-popconfirm title="是否要删除?" ok-text="删除" cancel-text="取消" @confirm="handleDelete(record.id)">
                <a class="mr8" href="#"><a-icon type="delete" style="margin-right: 5px;" />删除 </a>
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item key="3">
              <a class="mr8" @click="toPage(record,'/fileDown/list')"> <a-icon type="file" style="margin-right: 5px;" />文件 </a>
            </a-menu-item>
            <a-menu-item key="4">
              <a class="mr8" @click="toPage(record,'/studyVideo/list')"> <a-icon type="play-square" style="margin-right: 5px;" />视频 </a>
            </a-menu-item>
          </a-menu>
          <a>
            操作<a-icon type="down" />
          </a>
        </a-dropdown> 
      </template>
      </a-table>
    </a-card>
    <!-- 详情modal -->
    <a-modal width="80%" :visible="detailModalInfo.visible" :title="detailModalInfo.isEdit ? '编辑产品' : '添加产品'" @cancel="hideModal('detail');" @ok="handleDetailOk" centered>
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
        <a-col :md="12" :sm="12" :xs="12" :span="12">
          <a-form-item v-bind="{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 21,
            },
          }" 
            label="首页轮播图">
            <imgUpload v-if="detailModalInfo.visible" :maxSize="3" :urls="editData.lunbo_pic" @uploadImgChange="detailUploadChange($event,'lunbo_pic')" />
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
          <a-form-item label="售价">
            <a-input-number style="width:150px" v-model="editData.price" :min="1" :max="10000" placeholder="请输入售价" />
          </a-form-item>
        </a-col>
        <!-- <a-col :md="11" :sm="11" :xs="11" :span="11">
          <a-form-item label="原价">
            <a-input-number style="width:150px" v-model="editData.price_old" :min="1" :max="10000" placeholder="请输入原价" />
        </a-form-item>
        </a-col> -->
        <a-col :md="11" :sm="11" :xs="11" :span="11" offset="1">
          <a-form-item label="最多玩家人数">
            <a-input-number style="width:150px" v-model="editData.specifications.max_person" :min="1" :max="10000" placeholder="请输入玩家数量" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="1244" :xs="24" :span="24">
          <a-form-item v-bind="{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 21,
            },
          }" 
        label="封面图">
            <imgUpload v-if="detailModalInfo.visible" multiple :maxCount="5" :urls="editData.pic_url" @uploadImgChange="detailUploadChange($event,'pic_url')" />
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
           label="英文封面图">
            <imgUpload v-if="detailModalInfo.visible" multiple :maxCount="5" :urls="editData.pic_url_en" @uploadImgChange="detailUploadChange($event,'pic_url_en')" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" :xs="24" :span="24">
          <a-form-item v-bind="{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 21,
            },
            }" 
          label="组合名">
          <sku-component v-if="detailModalInfo.visible" :list="editData.specifications.skuList" @updateSkuList="skuListChange($event,'specifications','skuList')" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" :xs="24" :span="24">
          <a-form-item v-bind="{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 21,
            },
            }" 
          label="英文组合名">
            <sku-component v-if="detailModalInfo.visible" :list="editData.specifications_en.skuList" @updateSkuList="skuListChange($event,'specifications_en','skuList')" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" :xs="24" :span="24">
          <a-form-item v-bind="{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 21,
            },
            }" 
          label="参数信息">
          <info-component v-if="detailModalInfo.visible" :list="editData.specifications.infoList" @updateSkuList="skuListChange($event,'specifications','infoList')" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24" :xs="24" :span="24">
          <a-form-item v-bind="{
            labelCol: {
              span: 3,
            },
            wrapperCol: {
              span: 21,
            },
            }" 
          label="英文参数信息">
            <info-component v-if="detailModalInfo.visible" :list="editData.specifications_en.infoList" @updateSkuList="skuListChange($event,'specifications_en','infoList')" />
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
          <editorBar v-if="detailModalInfo.visible" v-model="editData.contents" height="800px"></editorBar>
        </a-form-item>
        <a-form-item label="英文内容" v-bind="{
          labelCol: {
            span: 2,
          },
          wrapperCol: {
            span: 22,
          },
        }">
          <editorBar v-if="detailModalInfo.visible" v-model="editData.contents_en" height="800px"></editorBar>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="hideModal('detail')">取消</a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="handleDetailOk">保存</a-button>
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
import skuComponent from '@/components/my/skuComponent'
import infoComponent from '@/components/my/infoComponent'
import { isJSONString} from '@/utils/util.js'
import {
  productListQuery,
  productDetail,
  productAdd,
  productUpdate,
  productDel,
} from '../api';
const  editData = {
  title: '', //	标题
  lunbo_pic: '', //轮播图 
  pic_url: '', //缩略图
  description:'',//描述
  contents: '', //内容
  title_en: '', //英文标题
  pic_url_en: '', //英文缩略图
  description_en:'',//英文描述
  contents_en: '', //英文内容
  price_old: 0,//原价
  price: '',//优惠价
  specifications: {// 中文
    skuList: [],//规格组合
    infoList: [],//参考信息
    max_person:'',//最大玩家人数
  },
  specifications_en: {// 英文
    skuList: [],//规格组合
    infoList: [],//参考信息
    max_person:'',//最大玩家人数
  },
  index_top:0 //是否首页置顶
}


export default {
  components: { imgUpload, editorBar,previewImgModal,skuComponent,infoComponent },
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
          title: '轮播图',
          dataIndex: 'lunbo_pic',
          scopedSlots: {
            customRender: 'lunbo_pic',
          },
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
        // {
        //   title: '最大玩家人数',
        //   dataIndex: 'max_person',
        //   align: 'center',
        //   width: 80,
        // },
        {
          title: '优惠价',
          dataIndex: 'price',
          align: 'center',
          width: 80,
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
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
      detailModalInfo: {
        visible: false,
        isEdit: false,
      },
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
      if (value.length == 0) return
      if(typeof value == 'string'){
        this.photo = value      
      }else if(typeof value == 'object' && value[0].url){
        this.photo = value[0].url;
      }
      this.$refs.previewImgModalRef.initModal();
    },
    skuListChange(arr, type,name) { 
      this.editData[type][name] = arr;
      console.log('editData---', this.editData)
    },
    // 详情modal上传返回
    detailUploadChange(arr,type) {
      if (type === 'lunbo_pic') {
        this.editData[type] = arr.map(item => {
          return item.url
        })
      } else {
        this.editData[type] = arr.map(item => {
          return {
            name:item.name,
            url:item.url
          }
        });
      }
   
    },
    initAddModal(type) {
      if (type === 'detail') {
        this.detailModalInfo.visible = true;
        this.detailModalInfo.isEdit = false;
      }
    },
    toPage(item,pageName) {
      this.$router.push({
        path: pageName,
        query: {
          id:item.id
        }
      })
     },
    editDetailModal(item) {
      // this.editData = cloneDeep(item);
      this.tableLoading = true;
      productDetail({
        id: item.id,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const { data } = res.data;
          data.pic_url = isJSONString(data.pic_url) ? JSON.parse(data.pic_url) :[]
          data.pic_url_en = isJSONString(data.pic_url_en) ? JSON.parse(data.pic_url_en) : []
          data.specifications = isJSONString(data.specifications) ? JSON.parse(data.specifications) : {}
          data.specifications_en = isJSONString(data.specifications_en) ? JSON.parse(data.specifications_en) : {}
          this.editData = data;
          // console.log('editData===',this.editData)
          this.detailModalInfo.visible = true;
          this.detailModalInfo.isEdit = true;
        }
      });
    },
    hideModal(type) {
      if (type==='detail') {
        this.detailModalInfo.visible = false;
        this.editData = cloneDeep(editData);
      }
    },
    handleDetailOk() {
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
      if (this.editData.description == '') {
        this.$message.warning('请输入描述！');
        return;
      }
      if (this.editData.description_en == '') {
        this.$message.warning('请输入英文描述！');
        return;
      }
      // if (this.editData.price == '') {
      //   this.$message.warning('请输入优惠价！');
      //   return;
      // }
      if (this.editData.lunbo_pic == '') {
        this.$message.warning('请上传轮播图！');
        return;
      }
      if (this.editData.pic_url == '') {
        this.$message.warning('请上传缩略图！'); 
        return;
      }
      if (this.editData.pic_url_en == '') {
        this.$message.warning('请上传英文缩略图！');
        return;
      }
      if (this.editData.specifications.max_person == '') {
        this.$message.warning('请输入最大玩家人数！');
        return;
      }
      if (this.editData.specifications.skuList.length === 0) {
        this.$message.warning('请输入组合信息！');
        return;
      }
      if (this.editData.specifications_en.skuList.length === 0) {
        this.$message.warning('请输入英文组合信息！');
        return;
      }
      if (this.editData.specifications.infoList.length === 0) {
        this.$message.warning('请输入产品参数信息！');
        return;
      }
      if (this.editData.specifications_en.infoList.length === 0) {
        this.$message.warning('请输入产品英文参数信息！');
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
      this.editData.specifications_en.max_person = this.editData.specifications.max_person //复制一份
      this.editData.pic_url = JSON.stringify(this.editData.pic_url) 
      this.editData.pic_url_en = JSON.stringify(this.editData.pic_url_en)
      this.editData.specifications = JSON.stringify(this.editData.specifications)
      this.editData.specifications_en = JSON.stringify(this.editData.specifications_en)
      // console.log('this.editData.specifications===',this.editData.specifications)
      // console.log('this.editData.specifications_en===',this.editData.specifications_en)
      if (this.detailModalInfo.isEdit) {
        this.btnLoading = true;
        productUpdate({
            ...this.editData,
          }).then((res) => {
            this.btnLoading = false;
            if (res.data.code == 200) {
              this.hideModal('detail');
              this.getList();
            }
          });
      } else {
        this.btnLoading = true;
        productAdd({
          ...this.editData,
        }).then((res) => {
          this.btnLoading = false;
          if (res.data.code == 200) {
            this.hideModal('detail');
            this.getList();
          }
        });
      }
    },
    handleDelete(id) {
      this.tableLoading = true;
      productDel({
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
      productListQuery({
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
