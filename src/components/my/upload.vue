<template>
  <a-upload :action="action" list-type="picture" class="avatar-uploader" :file-list="fileList" @change="imageUpload">
    <a-button><a-icon :type="loading ? 'loading' : 'plus'" /> 上传图片 </a-button>
  </a-upload>
</template>

<script>
import { getBase64 } from '@/rayframework/base64.js';
import { uploadPhoto } from './api';
export default {
  props: {
    recordData: {
      type: Object,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
      loading: false,
      action: '',
    };
  },
  mounted() {
    this.action = '';
  },
  methods: {
    async getupload(data) {
      if (data == undefined) return;
      if (data.status == 'removed') return data.url;
      const imageUrl = await getBase64(data.originFileObj);
      const res = await uploadPhoto({ imageBase64: imageUrl });
      return res.data.result.imgRayId;
    },
    async imageUpload({ fileList }) {
      this.fileList = fileList;
      this.loading = true;
      Promise.all(
        this.fileList.map(async (item) => {
          item.status = 'done';
          return await this.getupload(item);
        }),
      ).then((result) => {
        this.loading = false;
        this.$emit('afterUpload', { recordData: this.recordData, images: result.join(',') });
      });
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped></style>
