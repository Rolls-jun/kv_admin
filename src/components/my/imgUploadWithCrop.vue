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
      <a-upload v-if="!option.img" :action="action" name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
        :before-upload="beforeUpload" @change="imageUpload($event)">
        <div>
          <a-icon :type="'plus'" />
        </div>
      </a-upload>
        <!-- 3. 实时预览和操作按钮 -->
      <div v-if="option.img" class="actions">
        <div class="preview-box" :style="previewStyle">
          <div :style="previews.div" class="preview-img">
            <img :src="previews.url" :style="previews.img" alt="预览">
          </div>
        </div>
        <div class="btn-group">
          <button @click="rotateLeft">向左旋转</button>
          <button @click="rotateRight">向右旋转</button>
          <button @click="finishCrop">确定裁剪</button>
          <button @click="clearImg">清除图片</button>
        </div>
      </div>
      <div v-else class="cropper-wrapper">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :centerBox="option.centerBox"
          :high="option.high"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
        />
      </div>
    </div>
    
    <previewImgModal ref="previewImgRef" :imgUrl='imgUrl' />
  </div>
</template>

<script>
import {uploadPhoto} from '@/api'
import previewImgModal from './previewImgModal.vue'
import Compressor from 'compressorjs';
import draggable from "vuedraggable";
import VueCropper from 'vue-cropper'
import 'vue-cropper/next/dist/index.css' // 引入样式文件
export default {
  components:{
    previewImgModal,
    draggable,
    VueCropper
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
      // 裁剪组件配置
      option: {
        img: '', // 裁剪图片的地址 (base64 或 blob)
        size: 1, // 裁剪生成图片的质量 (0-1)
        outputType: 'png', // 裁剪生成图片的格式 (jpg, png, webp)
        full: false, // 是否输出原图比例的截图
        canMove: true, // 裁剪框是否可以拖动
        canMoveBox: true, // 裁剪框拖动时截图框是否可以跟随
        centerBox: true, // 截图框是否被限制在图片里面
        high: true, // 是否根据截图框实际大小生成图片
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false // 固定截图框大小，不允许改变
      },
      // 实时预览数据
      previews: {},
      previewStyle: {},
      action: `${process.env.VUE_APP_API_BASE_URL}/webApi/admin/user/uploadFile`,
      previewImgs:[], //预览图
      imgUrl:''
      };
  },
  mounted() { 
    if (this.urls.length == 0) return
    // console.log('info===',this.urls)
    if(typeof this.urls == 'object'){
      this.previewImgs = this.urls
    }else if(typeof this.urls == 'string'){
      this.previewImgs = [this.urls]
    }
  },
  watch:{
  },
  methods: {
     // 旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 确定裁剪
    finishCrop() {
      // 获取裁剪后的图片信息
      this.$refs.cropper.getCropData((data) => {
        console.log('vue-cropper===',data)
        // data 是 base64 格式的图片
        // 这里可以触发一个事件，将图片数据传递给父组件
      });
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
      // 根据预览图大小动态调整容器
      const w = data.w;
      const h = data.h;
      this.previewStyle = {
        width: w + 'px',
        height: h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: 0.5 // 缩放预览图，使其更小巧
      }
    },
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
    // 选择图片
    selectImg(e) {
      const file = e.target.files[0];
      if (!file) return;

      // 使用 FileReader 将图片转换为 base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.option.img = e.target.result;
      };
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
          // console.log('_file.size===',_file.size)
          let limit = 1 * 1024 * 1024;
          // if (_file.size > limit) Toast({ message: `当前图片偏大，建议压缩至1M以内`, duration: 2000 });
          let quality = _file.size < limit ? 0.9 : 1 / (_file.size / limit);
          // console.log('quality===',quality)
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