<template>
  <div>
    <a-card :style="{ minHeight: `${minHeight}px` }" :bordered="false">
      <span slot="title">
        <a-space direction="vertical">
          <a-form layout="inline" class="title-form">
            <a-form-item label="标题">
              <a-input v-model.trim="searchData.title" placeholder="输入标题" allowClear />
            </a-form-item>
            <!-- <a-form-item label="英文标题">
              <a-input v-model.trim="searchData.title_en" placeholder="输入英文标题" allowClear />
            </a-form-item> -->
            <a-form-item>
              <a-button type="primary" @click="handleSearch">查询</a-button>
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
      <template slot="status" slot-scope="record" v-if="record">
        <a-tag v-if="record===4" color="yellow">
          已读
        </a-tag>
        <a-tag v-if="record===1">
          未读
        </a-tag>
      </template>
        <span slot="action" slot-scope="record">
          <a class="mr8" @click="initEditModal(record)"> <a-icon type="view" style="margin-right: 5px;" />查看 </a>
          <a-popconfirm v-if="record.status !== 4" title="确定设为已读?" ok-text="确定" cancel-text="取消" @confirm="handleReaded(record.id)">
            <a class="mr8" href="#"><a-icon type="redo" style="margin-right: 5px;" />设为已读 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <a-modal width="80%" :visible="visible" title="查看详情" @cancel="hideModal" @ok="handleOk" centered>
      <a-descriptions title="问题详情" bordered>
        <a-descriptions-item label="问题" span="2">
          {{ editData.title }}
        </a-descriptions-item>
        <a-descriptions-item label="电话" span="2">
          {{ editData.phone }}
        </a-descriptions-item>
        <a-descriptions-item label="email" span="1">
          {{ editData.email }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="1">
          {{ editData.create_time }}
        </a-descriptions-item>
        <a-descriptions-item label="是否已读" span="1">
          <a-tag v-if="editData.status===4" color="yellow">
          已读
        </a-tag>
        <a-tag v-if="editData.status===1">
          未读
        </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="详细内容" span="3">
          {{ editData.contents }}
        </a-descriptions-item>
      </a-descriptions>
      <a-form
        style="margin-top: 20px;"
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
        <a-form-item label="备注" v-bind="{
          labelCol: {
            span: 2,
          },
          wrapperCol: {
            span: 22,
          },
        }">
          <a-textarea :row="4" v-model="editData.remark" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="hideModal">取消</a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="handleOk">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash-es';
import { BASE_PAGINATION } from '@/rayframework/common-pagination';
import {
  suggestListQuery,
  suggestReaded,
} from '../api';
const  editData = {
  title: '', //	标题
  contents: '', //
  email:'',//
  phone: '', //
  remark:'' //
}


export default {
  components: { },
  data() {
    return {
      minHeight: window.innerHeight - 124,
      taHeight: window.innerHeight - 416,
      pagination: cloneDeep(BASE_PAGINATION),
      orderFieldName: 'typeId',
      orderDirection: 'descend',  //排序 ascend descend
      tableData: [],
      tableLoading: false,
      columns: [
        {
          title: '问题',
          dataIndex: 'title',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '电话',
          dataIndex: 'phone',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '是否已读',
          dataIndex: 'status',
          scopedSlots: {
            customRender: 'status',
          },
          align: 'center',
          width: 100,
          ellipsis: true,
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          align: 'center',
          width: 100,
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
      editData: cloneDeep(editData),
      btnLoading: false,
      searchData: {
        title: '',
        // title_en: '',
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    initEditModal(item) {
      this.editData = cloneDeep(item);
      // this.tableLoading = true;
      this.visible = true;
      // infomationDetail({
      //   id: item.id,
      // }).then((res) => {
      //   this.tableLoading = false;
      //   if (res.data.code == 200) {
      //     const { data } = res.data;
      //     data.pic_url = isJSONString(data.pic_url) ? JSON.parse(data.pic_url) :[]
      //     data.pic_url_en = isJSONString(data.pic_url_en) ? JSON.parse(data.pic_url_en) : []
      //     this.editData = data;
      //     this.visible = true;
      //     this.isEdit = true;
      //   }
      // });
    },
    hideModal() {
      this.visible = false;
      this.editData = cloneDeep(editData);
    },
    handleOk() {
      if (this.editData.remark == '') {
        this.$message.warning('请输入备注！');
        return;
      }
      suggestReaded({
        ...this.editData,
      }).then((res) => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.hideModal();
          this.getList();
        }
      });
    },
    handleReaded(id) {
      this.tableLoading = true;
      suggestReaded({
        id,
        status: 4,
        remark:''
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
      suggestListQuery({
        page: current,
        pageSize,
        // orderDirection,
        // orderFieldName,
        ...this.searchData,
      }).then((res) => {
        this.tableLoading = false;
        if (res.data.code == 200) {
          const { list, count } = res.data.data;
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
</style>
