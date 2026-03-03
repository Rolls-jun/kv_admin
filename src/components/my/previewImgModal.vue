<template>
  <div class="previewImg_modal">
    <a-modal v-model="showModal" title="查看照片" @ok="showModal = false" :width="width">
      <img :src="imgUrl" alt style="width: 100%; max-width: 100%; height: 100%; margin: 0 auto" />
      <template #footer>
        <a-button @click="showModal = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '730px',
    },
  },
  data() {
    return {
      showModal: false, //预览图
    };
  },
  watch: {},
  methods: {
    initModal() {
      this.showModal = true;
    },
  },
};
</script>

<style lang="less" scoped>
.previewImg_modal {
}
</style>