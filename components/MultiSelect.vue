<template>
  <div class="relative" v-on:click="inside" v-click-outside="outside">
    <button class="bg-white border border-gray-200 rounded text-left w-full p-3 pr-8 text-gray-700 appearance-none truncate leading-tight set-height">
      <span v-for="(item, index) in selected" v-bind:key="index">{{item}}<span v-if="index != selected.length -1">, </span></span>
      <span v-if="selected.length == 0" class="block">{{ buttonText }}</span>
    </button>
    <div class="bg-white p-4 absolute w-full rounded border border-gray-200 z-shell" v-if="isOpen">
      <ul class="text-left w-full text-gray-700 border-t border-b border-gray-200 mb-0">
        <li class="bg-gray-100 px-3 py-2 border-b border-r border-l border-gray-200 flex items-center leading-none text-sm-1" v-for="(item, index) in listData" v-bind:key="index">
          <label class="cursor-pointer"><input type="checkbox" v-bind:value="item" class="mr-2" v-model="selected" @change="select" />{{item}}</label>
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
      selected: ['Illustrated Parts']
    }
  },
  props:{
    listData:{ type:Array, required:true },
    buttonText: { type:String, required: true }
  },
  methods: {
    outside: function(e) {
      this.isOpen = false;
    },
    inside: function(e) {
      if ((e.target.tagName.toLowerCase() == 'span' || e.target.tagName.toLowerCase() == 'button') && this.isOpen) {
        setTimeout(function () { document.body.click() }, 50)
      }
      this.isOpen = true;
    },
    select: function() {
      this.$emit('select', this.selected);
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
</style>