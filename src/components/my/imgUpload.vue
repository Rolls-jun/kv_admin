<template>
  <div class="avatar-upload-wrap">
    <div class="img_content">
      <draggable 
        item-key="name"
        class="img_list"
        ghost-class="ghost"
        drag-class="dragging"
        v-model="previewImgs" 
        @end="onDragEnd"
      >
        <div v-for="(item,index) in previewImgs" :key="index" class="img-item">
          <img class="img" :src="item.url"  alt="avatar" />
          <div class="mask">
            <a-icon class="mask-icon" type="arrows-alt" @click="viewImg(index)" />
          </div>
          <a-icon class="img-icon" type="close-circle" @click="delImg(index)" />
        </div>
      </draggable>
    </div>
    <div v-if="!multiple || (multiple && previewImgs.length <= maxCount)">
      <a-upload :action="action" name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
        :before-upload="beforeUpload" @change="imageUpload($event)">
        <div>
          <a-icon :type="'plus'" />
        </div>
      </a-upload>
    </div>
    
    <previewImgModal ref="previewImgRef" :imgUrl='imgUrl' />
  </div>
</template>

<script>
import {uploadPhoto} from '@/api'
import previewImgModal from './previewImgModal.vue'
import Compressor from 'compressorjs';
import draggable from "vuedraggable";
export default {
  components:{
    previewImgModal,
    draggable,
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
    },
    maxSize: {
      type:Number,
      default:1
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_API_BASE_URL}/webApi/admin/user/uploadFile`,
      previewImgs:[], //预览图
      imgUrl:''
      };
  },
  mounted() { 
    if (typeof this.urls == 'object' && this.urls.length == 0) return
    // console.log('info===',this.urls)
    if(typeof this.urls == 'object'){
      this.previewImgs = this.urls
    }else if(this.urls && typeof this.urls == 'string'){
      this.previewImgs = [{
        url:this.urls
      }]
    }
  },
  watch:{
  },
  methods: {
    // 图片上传
    async imageUpload(info) {
        console.log('info===',info.file)
      if(info.file.status != 'done') return
        try {
        uploadPhoto(info.file.originFileObj).then((res) => {
          console.log('res===',res)
          if (res.data.code == 200) {
            if (this.multiple) {
              this.previewImgs.push({
                name: info.file.originFileObj.name,
                url:res.data.data.url
              });
            } else { 
              this.previewImgs = [{
                name: info.file.originFileObj.name,
                url:res.data.data.url
              }];
            }
            console.log('previewImgs===',this.previewImgs)
            //用网络图代替base64本地图，避免图片上传失败无法发现
            this.$emit('uploadImgChange',this.previewImgs)
          }
        });
      }catch(error){
        this.$message.error('图片上传失败！')
      }
    },
    // beforeUpload(file) {
    //   return new Promise((resolve, reject) => {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg';
    //     if (!isJpgOrPng) {
    //       this.$message.error('请上传正确的图片格式!');
    //       return reject(false);
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 5;
    //     if (!isLt2M) {
    //       this.$message.error('图片大小必须小于5MB!');
    //       return reject(false);
    //     }
    //     return resolve(true);
    //   });
    // },
    onDragEnd() { 
      this.$emit('uploadImgChange',this.previewImgs)
    },
    delImg(index){
      this.previewImgs.splice(index,1)
      this.$emit('uploadImgChange',this.previewImgs)
    },
    viewImg(index){
      this.imgUrl = this.previewImgs[index].url;
      this.$refs.previewImgRef.initModal()
    },
    beforeUpload(file) {
      const cb = (_file) => {
        return new Promise((resolve) => {
          //  js 默认开启 checkOrientation 选项
          // 会将图片修正为正确方向
          console.log('_file.size===',_file.size)
          let limit = this.maxSize * 1024 * 1024;
          // if (_file.size > limit) Toast({ message: `当前图片偏大，建议压缩至1M以内`, duration: 2000 });
          let quality = _file.size < limit ? 1 : 1 / (_file.size / limit);
          console.log('quality===',quality)
          return new Compressor(_file, {
            quality, //压缩比例
            success: resolve,
            error(err) {
              console.log(err.message);
            },
          });
        });
      };

      if (Array.isArray(file)) {
        return file.map((item) => {
          return cb(item);
        });
      } else {
        return cb(file);
      }

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
      // return false;
    },
}}
</script>

<style lang="less" scoped>
.image-cropper-container {
  width: 100%;
  text-align: center;
}
.cropper-wrapper {
  width: 100%;
  height: 400px;
  background: #f0f0f0;
  margin-bottom: 20px;
}
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.preview-img {
  position: relative;
}
.avatar-upload-wrap{
  display: flex;
  .img_list{
    display: flex;
    .img-item{
      position: relative;
      width:104px;
      height: 138px;
      margin-left:10px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      &:first-child{
        margin-left:0;
      }
      .mask{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 20px;
        opacity: 0;
        transition: 0.3s all;
      }
      :hover{
        cursor: pointer;
        // border: 1px dashed #d6d6d6;
        opacity: 1;
      }
      .img{
        width: 100%;
        height: 100%;
      }
      .img-icon{
        position: absolute;
        right: 3px;
        top: 3px;
        padding:5px;
        color:#fff;
        :hover{
          // cursor: pointer;
          transform: scale(1.05);
          color:#ccc;
        }
      }
    }
  }
  /deep/.avatar-uploader {
    width: auto;
    .ant-upload.ant-upload-select {
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
  }
}

</style>