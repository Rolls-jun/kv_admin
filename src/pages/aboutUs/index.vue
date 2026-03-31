<template>
  <div>
    <a-card v-if="isEdit" :style="{ minHeight: `${minHeight}px` }" :bordered="false">
      <a-row type="flex" justify="start" class="mt20">
        <a-col :md="24" :sm="24" :xs="24" :span="24" >
          <a-form-item
            v-bind="{
              labelCol: {
                span: 2,
              },
              wrapperCol: {
                span: 22,
              },
            }"
           label="banner图">
            <imgUpload v-if="visible" multiple :maxCount="1" :urls="editData.banner_url" @uploadImgChange="uploadImgChange($event,'banner_url')" />
          </a-form-item>
        </a-col>
      </a-row>
      <template v-if="visible">
        <a-card v-for="(level,levelIndex) in editData.levelList" :key="level.level_url[0].url" type="inner" :title="`序列组${levelIndex}`">
          <a  slot="extra" href="#">
            <a-button class="add" type="danger" @click="delLevel(levelIndex)">删除</a-button>
            <a-button v-if="levelIndex == 0" type="primary" style="margin-left:20px" @click="addLevel">添加</a-button>
          </a>
          <a-form
            v-bind="{
              labelCol: {
                span: 4,
              },
              wrapperCol: {
                span: 20,
              },
            }"
          >
            <a-row type="flex" justify="start" class="mt20">
              <a-col :md="12" :sm="12" :xs="12" :span="12" >
                <a-form-item label="二维码图">
                  <imgUpload  multiple :maxCount="1" :urls="level.code_url" @uploadImgChange="uploadLevelChange($event,levelIndex,'code_url')" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="12" :xs="12" :span="12" >
                <a-form-item label="序列图">
                  <imgUpload  multiple :maxCount="1" :urls="level.level_url" @uploadImgChange="uploadLevelChange($event,levelIndex,'level_url')" />
                </a-form-item>
              </a-col>
              <a-col  :md="24" :sm="24" :xs="24" :span="24" >
                <a-form-item
                  v-bind="{
                    labelCol: {
                      span: 2,
                    },
                    wrapperCol: {
                      span: 22,
                    },
                  }"
                  label="内容">
                  <a-textarea :row="4" v-model="level.contents" />
                </a-form-item>
              </a-col>
              <a-col  :md="24" :sm="24" :xs="24" :span="24" >
                <a-form-item
                  v-bind="{
                    labelCol: {
                      span: 2,
                    },
                    wrapperCol: {
                      span: 22,
                    },
                  }"
                  label="英文内容">
                  <a-textarea :row="4" v-model="level.contents_en" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </template>
      
      <a-row type="flex" justify="center" style="margin-top:20px">
        <a-col :md="5" :sm="5" :xs="5" :span="5" >
          <a-button @click="isEdit = false" block>取消</a-button>
        </a-col>
        <a-col :md="5" :sm="5" :xs="5" :span="5" offset="2">
          <a-button type="primary" :disabled="btnLoading" @click="save" block>保存</a-button>
        </a-col>
      </a-row>        
    </a-card>
    <a-card v-else :style="{ minHeight: `${minHeight}px` }" :bordered="false">
      <a slot="extra" href="#">
        <a-button type="primary" block @click="isEdit = true">编辑</a-button>
      </a>
      <a-descriptions title="banner图" bordered style="margin-top:20px">
        <a-descriptions-item v-if="detailData.banner_url.length > 0" label="banner图" span="3">
          <img style="width:200px" :src="detailData.banner_url[0].url" />
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions v-for="(level,index) in detailData.levelList" :key="index"  :title="`序列_${index+1}`" bordered style="margin-top:20px">
        <a-descriptions-item label="二维码图" span="2">
          <img style="width:80px;height:80px" v-for="(code,urlIndex) in level.code_url" :key="urlIndex" :src="code.url" />
        </a-descriptions-item>
        <a-descriptions-item label="序列图" span="2">
          <img style="width:80px;height:80px" v-for="(level,urlIndex) in level.level_url" :key="urlIndex" :src="level.url" />
        </a-descriptions-item>
        <a-descriptions-item label="介绍" span="2">
          {{ level.contents }}
        </a-descriptions-item>
        <a-descriptions-item label="英文介绍" span="2">
          {{ level.contents_en }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <previewImgModal ref="previewImgModalRef" :imgUrl="photo" />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash-es';
import imgUpload from '@/components/my/imgUpload.vue';
import previewImgModal from '@/components/my/previewImgModal.vue';
import { isJSONString} from '@/utils/util.js'
import {
  webConfigAbout,
  getWebConfigAbout
} from '../api';
const  editData = {
  banner_url: [], //	banner
  levelList: [{
    code_url: [],
    level_url: [],
    contents:'',
    contents_en:''
  }]
}


export default {
  components: { imgUpload,previewImgModal },
  data() {
    return {
      minHeight: window.innerHeight - 124,
      taHeight: window.innerHeight - 416,
      isEdit: false,
      btnLoading:false,
      photo: '',
      visible:false,
      editData: cloneDeep(editData),
      detailData: cloneDeep(editData),
    };
  },
  mounted() {
    this.initPage()
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
    uploadLevelChange(arr, index , type) {
      this.editData.levelList[index][type] = arr.map(item => {
        return {
          name:item.name,
          url:item.url
        }
       });
    },
    addLevel() { 
      this.editData.levelList.push({
        code_url: [],
        level_url: [],
        contents:'',
        contents_en:''
      })
    },
    delLevel(index) { 
      this.$confirm({
        title: '确认删除',
        content: '确定要删除这个吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.editData.levelList.splice(index, 1)
          this.visible = false;
          this.$nextTick(() => { 
            this.visible = true
          })
        }
      })
    },
    initPage() {
      getWebConfigAbout().then((res) => {
        if (res.data.code == 200) {
          const { data } = res.data;
          const detail = isJSONString(data) ? JSON.parse(data) : {}
          this.editData = cloneDeep(detail)
          this.detailData = cloneDeep(detail)
          this.visible = true;
          this.isEdit = false;
        }
      });
    },
    hideModal() {
      this.visible = false;
      this.editData = cloneDeep(editData);
    },
    save() {
      if (this.editData.banner_url && this.editData.banner_url.length === 0) {
        this.$message.warning('请上传banner图！');
        return;
      }
      if (this.editData.levelList && this.editData.levelList.length === 0) {
        this.$message.warning('请上传信息');
        return;
      }
      this.btnLoading = true;
      webConfigAbout(
        {about_us:JSON.stringify(this.editData)}
      ).then((res) => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message.success('保存成功');
          this.isEdit = false
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
// @import url('../../../../style/layout.less');
.add{
  font-size:14px;
  color:#666;
}
/deep/ .ant-descriptions-item-label{
  width:120px;
  text-align:center;
}
</style>
