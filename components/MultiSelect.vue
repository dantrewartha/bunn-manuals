<template>
  <div class="relative" v-on:click="inside" v-click-outside="outside">
    <button class="bg-white border border-gray-200 rounded text-left w-full p-3 pr-8 text-gray-700 appearance-none focus:outline-none truncate">
      <span v-for="(item, index) in selected" v-bind:key="index">{{item}}<span v-if="index != selected.length -1">, </span></span>
      <span v-if="selected.length == 0">{{ buttonText }}</span>
    </button>
    <ul class="bg-white p-4 text-left absolute w-full rounded border border-gray-200 text-gray-700" v-if="isOpen">
      <li class="bg-gray-100 px-3 py-2 border-b border-r border-l border-gray-200 flex items-center leading-none text-sm-1" v-for="(doc, index) in listData" v-bind:key="index" v-bind:class="{ 'border-t': index === 0 }">
        <label class="cursor-pointer"><input type="checkbox" v-bind:value="doc" class="mr-2" v-model="selected" @change="select" />{{doc}}</label>
      </li>
    </ul>
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
      this.isOpen = true;
    },
    select: function() {
      this.$emit('select', this.selected);
    }
  },
}
</script>
<style scoped>

</style>