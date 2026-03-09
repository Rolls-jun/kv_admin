<template>
  <div class="sku-test-page">
    <page-header title="SKU组件测试" />
    <div class="content">
      <h3>SKU组件测试</h3>
      <sku-component />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/page/header/PageHeader'
import SkuComponent from './SkuComponent'

export default {
  name: 'SkuTestPage',
  components: {
    PageHeader,
    SkuComponent
  }
}
</script>

<style scoped>
.sku-test-page {
  padding: 24px;
}

.content {
  margin-top: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
}

h3 {
  margin-bottom: 24px;
  color: #1890ff;
}
</style>