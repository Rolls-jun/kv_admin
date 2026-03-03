<template>
  <a-modal :visible="visible" width="1000px" title="企业介绍" @cancel="hideModal" centered>
    <div class="modal-content" :style="modalContentStyle">
        <a-descriptions bordered :column="6" title="" size="small">
          <a-descriptions-item label="经度" :span="3">{{ form.eventLocationLongitude }}</a-descriptions-item>
          <a-descriptions-item label="纬度" :span="3">{{ form.eventLocationLatitude }}</a-descriptions-item>
        </a-descriptions>
      <!-- <div id="container" class="mt20" /> -->
      <iframe id="mapPage" width="100%" height="100%" frameborder=0
        src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=ORUBZ-JCKKQ-OBA5W-G4PNC-4Z3YT-INBA6&referer=myapp">
      </iframe>
    </div>
    <template #footer>
      <a-button @click="hideModal">关闭</a-button>
      <a-button type="primary" @click="handleOk">确认</a-button>
    </template>
  </a-modal>
</template>

<script>

const mapInfo = { 
    map: null,
    center: new TMap.LatLng(31.384961, 121.012904),
    markerLayer: null,
    geocoder: null,
}
import { cloneDeep } from 'lodash-es';
import {getWindowHeight} from '@/utils/util.js'
export default {
  data() {
    return {
      visible: false,
      form:{
        eventLocationLongitude: '', //地点经度
        eventLocationLatitude: '', //地点纬度
      },
      mapInfo:cloneDeep(mapInfo)
    };
  },
  created() {
    this.winH = getWindowHeight()
    window.addEventListener('message', (event)=>{
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      var loc = event.data;
      if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        // console.log('location', loc);
        this.form.eventLocationLongitude = loc.latlng.lng;
        this.form.eventLocationLatitude = loc.latlng.lat;
      }
  }, false);
  },
  computed:{
    modalContentStyle(){
      return {
        height:`${this.winH - 200}px`
      }
    }
  },
  beforeDestroy(){

  },
  methods: {
    initModal(){
      this.visible = true
      // this.$nextTick(()=>{
      //   this.initMap()
      // })
    },
    //初始化地图
    // initMap() {
    //   this.mapInfo.map = new TMap.Map('container', {
    //     center: this.mapInfo.center,
    //     zoom: 15,
    //   });
    //   //初始化marker图层
    //   if (this.mapInfo.markerLayer == null) {
    //     this.mapInfo.markerLayer = new TMap.MultiMarker({
    //       id: 'marker-layer',
    //       map: this.mapInfo.map,
    //       geometries: [
    //         {
    //           position: new TMap.LatLng(this.form.eventLocationLatitude, this.form.eventLocationLongitude),
    //           id: 'marker',
    //         },
    //       ],
    //     });
    //   }
    //   //监听点击事件添加marker
    //   this.mapInfo.geocoder = new TMap.service.Geocoder();
    //   this.mapInfo.map.on('click', (evt) => {
    //     this.form.eventLocationLatitude = evt.latLng.lat;
    //     this.form.eventLocationLongitude = evt.latLng.lng;
    //     let data = this.mapInfo.markerLayer.getGeometryById('marker');
    //     Object.assign(data, {
    //       position: new TMap.LatLng(this.form.eventLocationLatitude, this.form.eventLocationLongitude),
    //     });
    //     this.mapInfo.markerLayer.updateGeometries([data]);
    //   });
    // },
    hideModal() {
      // if (this.mapInfo.map) {
      //   this.mapInfo.map.destroy();
      //   this.mapInfo = cloneDeep(mapInfo)
      // }
      this.form = {
        eventLocationLongitude: '', //地点经度
        eventLocationLatitude: '', //地点纬度
      },
      this.visible = false;
    },
    handleOk() {
      if(!this.form.eventLocationLongitude || !this.form.eventLocationLongitude){
        this.$message.warning('请选择地图位置后再提交')
        return
      }
      this.$emit('change',this.form)
      this.hideModal();
    },
  },
};
</script>
<style lang="less" scoped>
.modal-content{
  max-height: 700px;
  overflow:auto;
}
#mapPage {
  width: 100%;
  height: calc(100% - 50px);
  margin-top:20px;
}
</style>