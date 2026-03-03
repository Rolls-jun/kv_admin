<template>
   <div class="editor-bar" style="border: 1px solid #ccc;">
      <Toolbar style="border-bottom: 1px solid #ccc;" :editor="editorInfo.editor" :defaultConfig="editorInfo.toolbarConfig" :mode="editorInfo.mode" />
      <Editor style="overflow-y:hidden;" :style="{'height':height}" v-model="content" :defaultConfig="editorInfo.config" :mode="editorInfo.mode" @onCreated="onCreated"/>
      <a-divider dashed style="margin-bottom: 10px;" />
    </div>
</template>
<script>
import { Editor, Toolbar  } from '@wangeditor/editor-for-vue';
import {uploadPhoto} from '@/api'
export default {
  components: { Editor, Toolbar },
  props:{
    value:{
      type:String,
      default:''
    },
    height:{
      type:String,
      default:'400px'
    }
  },
  data() {
      let that = this;
      return {
        content:this.value,
        editorInfo:{
          editor: null,
          config:{
            placeholder: '请输入内容...',
            MENU_CONF: {
              color: {
                colors: ['#000', '#333', '#666'],
              },
              uploadImage:{
                async customUpload(file , insertFn){
                  try {
                    // const sizeAble = await that.beforeImgUpload(file)
                    // if(!sizeAble){
                    //   return
                    // }
                    const imgUrl = await that.uploadImg(file)
                    insertFn(imgUrl, '', imgUrl);
                  } catch (error) {
                    console.log(error);   
                    that.$message.error('图片上传失败');  
                  }
                }
              },
            uploadVideo:{
              async customUpload(file , insertFn){
                console.log('file',file)
                try{
                    const sizeAble = await that.beforeVideoUpload(file)
                    if(!sizeAble){
                      return
                    }
                    const videoUrl = await that.uploadImg(file)
                    insertFn(videoUrl, '', videoUrl);
                  } catch (error) {
                    console.log(error);   
                    that.$message.error('视频上传失败');  
                  }
              }
            }}
          },
          toolbarConfig: {
            // toolbarKeys: [
            //   'headerSelect',
            //   'blockquote',
            //   '|',
            //   'bold',
            //   'italic',
            //   'through',
            //   'clearStyle',
            //   '|',
            //   'color',
            //   'bgColor',
            //   '|',
            //   'fontSize',
            //   'fontFamily',
            //   'lineHeight',
            //   '|',
            //   'bulletedList',
            //   'numberedList',
            //   '|',
            //   'emotion',
            //   'insertLink',
            //   'insertTable',
            // ],//显示菜单
            // excludeKeys: ['code', 'todo', 'group-video', 'codeBlock','fullScreen'], //排除菜单,调试选中 dom 节点可查看相应菜单 Key
            excludeKeys: ['group-video'], //排除菜单,调试选中 dom 节点可查看相应菜单 Key
            // excludeKeys:['fullScreen']
          },
          mode: 'default', // 'default' or 'simple'  
        },
        showModal:false, //预览图
      };
  },
  mounted(){
  },
  watch:{
    value:{
      handler(val){
        if(val != this.content){
          this.content = val
        }
      }
    },
    content:{
      handler(val){
        this.$emit('input',val)
      }
    }
  },
  beforeDestroy() {
    const editor = this.editorInfo.editor;
    if (!editor) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods:{
    beforeImgUpload (file) {
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
    beforeVideoUpload (file) {
      return new Promise((resolve, reject) => {
        const isJpgOrPng = file.type === 'video/mp4';
        if (!isJpgOrPng) {
          this.$message.error('请上传正确的视屏格式!');
          return reject(false);
        }
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
          this.$message.error('图片大小必须小于50MB!');
          return reject(false);
        }
        return resolve(true);
      });
    },
    uploadImg(file) {
      console.log('file===',file)
      return new Promise((resolve, reject) => {
        uploadPhoto(file,'textEdit').then((res) => {
          console.log('res===',res)
          if (res.data.code == 200) {
            resolve(res.data.data.url)
          } else { 
            reject()
          }
        });
      })
    },
    onCreated(editor) {
      this.editorInfo.editor = Object.seal(editor);
    },
}}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
