<template>
  <div class="relative" v-on:click="inside" v-click-outside="outside">
    <button class="bg-white border border-gray-200 rounded text-left w-full p-3 pr-8 text-gray-700 appearance-none focus:outline-none truncate leading-tight set-height">
      <span>{{selected.label}}</span>
    </button>
    <div class="bg-white p-4 absolute w-full rounded border border-gray-200 z-shell" v-if="isOpen">
      <ul class="text-left w-full text-gray-700 border-t border-b border-gray-200 mb-0">
        <li class="bg-gray-100 border-b border-r border-l border-gray-200 flex items-center leading-none text-sm-1 hover:bg-gray-200" v-for="(item, index) in listData" v-bind:key="index">
          <input type="radio" v-bind:id="item.value" v-bind:value="item" class="hidden" v-model="selected" @change="select" />
          <label v-bind:for="item.value" class="cursor-pointer px-3 py-2 w-full input-wrap">{{item.label}}</label>
        </li>
      </ul>
    </div>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg class="fill-current h-4 w-4" v-bind:class="{ 'rotate': isOpen }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
</template>
<script>

export default {
  data: function() {
    return {
      isOpen: false,
      selected: this.default
    }
  },
  props:{
    listData:{ type:Array, required:true },
    default: { type:Object, required:true }
  },
  methods: {
    outside: function(e) {
      this.isOpen = false;
    },
    inside: function(e) {
      this.isOpen = true;
    },
    select: function() {
      this.$emit('select', this.selected);
      setTimeout(function () { document.body.click() }, 50)
    }
  },
}
</script>
<style scoped>
  ul {
    max-height:200px;
    overflow-y:scroll;
    position:relative;
  }
  ul li:last-child {
    border-bottom:none;
  }
  input[type="radio"]:checked + label { 
    @apply bg-gray-200;
  }
</style>