<template>
  <div class="avatar-upload-wrap">
    <a-upload v-if="!multiple || (multiple && fileList.length <= maxCount)" :action="action" name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
      :before-upload="beforeUpload" @change="fileUpload($event)">
      <div>
        <a-icon :type="'plus'" />
      </div>
    </a-upload>
    <div class="file-list">
      <div class="file-item" v-for="(file,index) in fileList" :key="index">
        <div class="file-item_name">{{ file.name }}</div>
        <a-icon class="file-item_icon" type="close-circle" @click="delFile(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import {uploadPhoto} from '@/api'
// import Compressor from 'compressorjs';
export default {
  components:{
  },
  props:{
    urls:{
      type:[Array,String],
      default:()=>{
        return []
      }
    },
    multiple:{
      type:Boolean,
      default:false
    },
    maxCount: {
      type:Number,
      default:5
    }
  },
  data() {
      return {
        action: `${process.env.VUE_APP_API_BASE_URL}/webApi/admin/user/uploadFile`,
        fileList:[], //预览图
        imgUrl:''
      };
  },
  mounted() { 
    if (this.urls.length == 0) return
    console.log('info===',this.urls)
    if(typeof this.urls == 'object'){
      this.fileList = this.urls
    }else if(typeof this.urls == 'string'){
      this.fileList = [this.urls]
    }
  },
  watch:{
  },
  methods:{
    // 文件上传
    async fileUpload(info) {
      console.log('info===',info.file)
    // if(info.file.status != 'done') return
      try {
      uploadPhoto(info.file,'productFile').then((res) => {
        console.log('res===',res)
        if (res.data.code == 200) {
          if (this.multiple) {
            this.fileList.push({
              name: info.file.name,
              url:res.data.data.url
            });
          } else { 
            this.fileList = [{
              name: info.file.name,
              url:res.data.data.url
            }];
          }
          console.log('fileList===',this.fileList)
          //用网络图代替base64本地图，避免图片上传失败无法发现
          this.$emit('uploadFileChange',this.fileList)
        }
      });
    }catch(error){
      this.$message.error('图片上传失败！')
    }
  },
  delFile(index){
    this.fileList.splice(index,1)
    this.$emit('uploadFileChange',this.fileList)
  },
  beforeUpload(file) {
    // const cb = (_file) => {
    //   return new Promise((resolve) => {
    //     //  js 默认开启 checkOrientation 选项
    //     // 会将图片修正为正确方向
    //     // console.log('_file.size===',_file.size)
    //     let limit = 1 * 1024 * 1024;
    //     // if (_file.size > limit) Toast({ message: `当前图片偏大，建议压缩至1M以内`, duration: 2000 });
    //     let quality = _file.size < limit ? 0.9 : 1 / (_file.size / limit);
    //     // console.log('quality===',quality)
    //     return new Compressor(_file, {
    //       quality, //压缩比例
    //       success: resolve,
    //       error(err) {
    //         console.log(err.message);
    //       },
    //     });
    //   });
    // };

    // if (Array.isArray(file)) {
    //   return file.map((item) => {
    //     return cb(item);
    //   });
    // } else {
    //   return cb(file);
    // }

    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg';
    // if (!isJpgOrPng) {
    //   this.$message.error('请上传正确的图片格式!');
    //   return false;
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('图片大小必须小于2MB!');
    //   return false;
    // }
    // if (this.fileList.length >= 3) {
    //   this.$message.error('可上传的长度为3，如若修改，请删除要更换的图片!');
    //   return false;
    // }
    console.log('file===',file)
    return false;
    },
}}
</script>

<style lang="less" scoped>

.avatar-upload-wrap{
  display: flex;
  flex-direction:column;
  .file-list{
    display: flex;
    .file-item{
      position: relative;
      display: flex;
      justify-content: space-between;
      border: 1px solid #ccc;
      padding: 3px;
      margin-left:10px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      &_name{
        flex: 0 0 120px;
        line-height:20px;
      }
      &:first-child{
        margin-left:0;
      }
      &_icon{
        position: absolute;
        right: 3px;
        top: 3px;
        padding:5px;
        color:#ccc;
        transition: all 1s;
        &:hover{
          cursor: pointer;
          transform: scale(1.2);
        }
      }
    }
  }
  /deep/.avatar-uploader {
    width: auto;
    .ant-upload.ant-upload-select {
      display: block;
      float: left;
      width: 120px;
      height: 40px;
      margin-left: 8px;
      text-align: center;
      // vertical-align: top;
      background-color: #fafafa;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      transition: border-color 0.3s ease;
      .ant-upload{
        display:block;
      }
      div {
        line-height: 22px;
      }
    }
  }
}

</style>