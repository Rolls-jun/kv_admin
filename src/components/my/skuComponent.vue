<template>
  <div class="sku-component">
    <div 
      v-for="(item, index) in skuList" 
      :key="index"
      class="sku-item"
    >
      <a-input 
        v-model="item.name" 
        placeholder="请输入组合名称" 
        class="sku-input"
        @change="inputChange"
      />
      <a-input 
        v-model="item.price" 
        placeholder="请输入价格" 
        class="sku-price"
        @change="inputChange"
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
  props:{
    list:{
      type:[Array,String],
      default:()=>{
        return []
      }
    },
  },
  data() {
    return {
      skuList: [
        {
          name: '',
          price:''
        }
      ]
    }
  },
  mounted() { 
    if (this.list.length == 0) return
    console.log('info===',this.list)
    if(typeof this.list == 'object'){
      this.skuList = this.list
    }else if(typeof this.urls == 'string'){
      this.skuList = [this.list]
    }
  },
  watch: {

  },
  methods: {
    inputChange() { 
      // console.log('data---',event,index)
      // this.skuList[index].value = event.data;
      this.updateList()
    },
    updateList() { 
      this.$emit('updateSkuList',this.skuList)
    },
    addSku() {
      this.skuList.push({ value: '' })
      this.updateList()
    },
    confirmDelete(index) {
      this.$confirm({
        title: '确认删除',
        content: '确定要删除这个吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.deleteSku(index)
        }
      })
    },
    deleteSku(index) {
      this.skuList.splice(index, 1)
      this.updateList()
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
.sku-price {
  flex: 0 0 300px;
  margin-right: 10px;
}

.sku-buttons {
  display: flex;
  gap: 8px;
}
</style>