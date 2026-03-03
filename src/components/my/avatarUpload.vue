<template>
  <div class="avatar-upload">
    <a-upload :action="action" name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
      :before-upload="beforeUpload" @change="imageUpload">
      <img v-if="previewImg" :src="previewImg" alt="avatar" />
      <div v-else>
        <a-icon :type="'plus'" />
      </div>
    </a-upload>
  </div>
</template>

<script>
import {uploadPhoto} from '@/api'
export default {
  props:{
    url:{
      type:String,
      default:''
    }
  },
  data() {
      return {
        action: '',
        previewImg:this.url, //预览图
        uploadImg:''
      };
  },
  watch:{
    url: {
      handler(newVal) {
        if(newVal != this.previewImg){
          this.previewImg = newVal;
        }
      },
    },
  },
  methods:{
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
          this.$message.error('请上传正确的图片格式!');
          return reject(false);
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$message.error('图片大小必须小于5MB!');
          return reject(false);
        }
        return resolve(true);
      });
    },
    // 图片上传
  async imageUpload(info) {
    // console.log('info====',info.file.status)
    if(info.file.status != 'done') return
    try{
      uploadPhoto(info.file).then((res) => {
        if (res.data.code == this.$rayCode.rayframework_http_success_code) {
          this.uploadImg = res.data.result.imgRayId;
          this.previewImg = this.uploadImg; 
          //用网络图代替base64本地图，避免图片上传失败无法发现
          this.$emit('uploaImgChange',this.uploadImg)
        }
      });
    }catch(error){
      this.$message.error('图片上传失败！')
    }
  }
}}
</script>

<style lang="less" scoped>
/deep/.avatar-uploader .ant-upload.ant-upload-select {
  display: table;
  float: left;
  width: 104px;
  height: 120px;
  margin-left: 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  img {
    width: 100%;
  }
  div {
    line-height: 120px;
  }
}
</style>