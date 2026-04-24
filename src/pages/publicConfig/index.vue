<template>
  <div>
    <a-card
      v-if="isEdit"
      :style="{ minHeight: `${minHeight}px` }"
      :bordered="false"
    >
      <template>
        <a-card type="inner" title="配置信息">
          <a-form
            v-bind="{
              labelCol: {
                span: 4,
              },
              wrapperCol: {
                span: 20,
              },
            }"
          >
            <a-row type="flex" justify="start" class="mt20">
              <a-col :md="12" :sm="12" :xs="12" :span="12">
                <a-form-item
                  v-bind="{
                    labelCol: {
                      span: 4,
                    },
                    wrapperCol: {
                      span: 20,
                    },
                  }"
                  label="热门商品短语"
                >
                  <a-textarea :row="4" v-model="editData.hot_product_title" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="12" :xs="12" :span="12">
                <a-form-item
                  v-bind="{
                    labelCol: {
                      span: 4,
                    },
                    wrapperCol: {
                      span: 20,
                    },
                  }"
                  label="热门商品短语(英文)"
                >
                  <a-textarea
                    :row="4"
                    v-model="editData.hot_product_title_en"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </template>

      <a-row type="flex" justify="center" style="margin-top: 20px">
        <a-col :md="5" :sm="5" :xs="5" :span="5">
          <a-button @click="isEdit = false" block>取消</a-button>
        </a-col>
        <a-col :md="5" :sm="5" :xs="5" :span="5" offset="2">
          <a-button type="primary" :disabled="btnLoading" @click="save" block
            >保存</a-button
          >
        </a-col>
      </a-row>
    </a-card>
    <a-card v-else :style="{ minHeight: `${minHeight}px` }" :bordered="false">
      <a slot="extra">
        <a-button type="primary" block @click="isEdit = true">编辑</a-button>
      </a>
      <a-descriptions title="" bordered style="margin-top: 20px">
        <a-descriptions-item label="热门商品短语" span="2">
          {{ detailData.hot_product_title }}
        </a-descriptions-item>
        <a-descriptions-item label="热门商品英文短语" span="2">
          {{ detailData.hot_product_title_en }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>
<script>
import { cloneDeep } from "lodash-es";
import { isJSONString } from "@/utils/util.js";
import { webConfig, getWebConfig } from "../api";
const editData = {
  hot_product_title: "",
  hot_product_title_en: "",
};

export default {
  components: {},
  data() {
    return {
      minHeight: window.innerHeight - 124,
      taHeight: window.innerHeight - 416,
      isEdit: false,
      btnLoading: false,
      visible: false,
      editData: cloneDeep(editData),
      detailData: cloneDeep(editData),
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      getWebConfig({ config_key: "hot_product_title" }).then((res) => {
        if (res.data.code == 200) {
          const { data } = res.data;
          this.visible = true;
          if (data) {
            const detail = isJSONString(data) ? JSON.parse(data) : {};
            detail.hot_product_title = detail.cn || "";
            detail.hot_product_title_en = detail.en || "";
            this.editData = cloneDeep(detail);
            this.detailData = cloneDeep(detail);
          }
          this.isEdit = false;
        }
      });
    },
    hideModal() {
      this.visible = false;
      this.editData = cloneDeep(editData);
    },
    save() {
      if (
        this.editData.hot_product_title &&
        this.editData.hot_product_title.length === 0
      ) {
        this.$message.warning("请上传热门商品短语");
        return;
      }
      if (
        this.editData.hot_product_title_en &&
        this.editData.hot_product_title_en.length === 0
      ) {
        this.$message.warning("请上传热门商品英文短语");
        return;
      }
      this.btnLoading = true;
      const data = {
        config_key: "hot_product_title",
        config_value: {
          cn: this.editData.hot_product_title,
          en: this.editData.hot_product_title_en,
        },
      };
      data.config_value = JSON.stringify(data.config_value);
      webConfig(data).then((res) => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message.success("保存成功");
          this.initPage();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.add {
  font-size: 14px;
  color: #666;
}
/deep/ .ant-descriptions-item-label {
  width: 120px;
  text-align: center;
}
</style>
