<template>
  <div class="sku-component">
    <div 
      v-for="(item, index) in skuList" 
      :key="index"
      class="sku-item"
    >
      <a-input 
        v-model="item.value" 
        placeholder="请输入SKU信息" 
        class="sku-input"
      />
      <div class="sku-buttons">
        <a-button 
          v-if="index > 0"
          type="danger" 
          size="small"
          @click="confirmDelete(index)"
        >
          <a-icon type="minus" />
        </a-button>
        <a-button 
          v-else
          type="default" 
          size="small"
          disabled
        >
          <a-icon type="minus" />
        </a-button>
        <a-button 
          v-if="index === skuList.length - 1"
          type="primary" 
          size="small"
          @click="addSku"
        >
          <a-icon type="plus" />
        </a-button>
        <a-button 
          v-else
          type="default" 
          size="small"
          disabled
        >
          <a-icon type="plus" />
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkuComponent',
  data() {
    return {
      skuList: [
        { value: '' }
      ]
    }
  },
  methods: {
    addSku() {
      this.skuList.push({ value: '' })
    },
    confirmDelete(index) {
      this.$confirm({
        title: '确认删除',
        content: '确定要删除这个SKU吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.deleteSku(index)
        }
      })
    },
    deleteSku(index) {
      this.skuList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.sku-component {
  width: 100%;
}

.sku-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.sku-input {
  flex: 1;
  margin-right: 10px;
}

.sku-buttons {
  display: flex;
  gap: 8px;
}
</style>