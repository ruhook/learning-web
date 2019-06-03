<template>
  <div class="home">
    <debounce :time="500" events="click">
      <button class="btn" @click="event($event, 2)">组件包裹</button>
    </debounce>

    <button class="btn" v-debounce="[($event) => { event($event, 4) }, 500, 'click']">指令处理</button>
  </div>
</template>

<script>
import Debounce from '../components/debounce'
export default {
  methods: {
    event (a, b) {
      console.log(a, b)
    }
  },
  components: { Debounce }
}
</script>

<style>
.btn{
  padding:10px 20px;
  border:1px solid #dedede;
  margin: 20px auto;
}
</style>

