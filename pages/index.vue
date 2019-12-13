<template>
  <div class="container px-6 max-w-7xl mx-auto">
    <div class="w-full">
      <logo />
      <h1 class="font-sans-light text-lg-3 my-8">Product Manuals</h1>
      <div class="p-6 bg-gray-100 border ">
        <div class="relative">
          <input type="text" class="w-full py-3 px-4 border border-gray-200 rounded text-gray-700" placeholder="Search by material number or product description and press enter ⏎" v-model.lazy="search" />
          <button class="absolute p-3 px-4 right-0 top-0 bottom-0 text-gray-400" v-on:click="getDocs()" v-if="search.length">
            <i class="fas fa-times-circle"></i>
          </button>
        </div>
      </div>
      <dl class="flex text-sm-1 font-sans-regular" v-for="(doc, index) in docs" v-bind:key="index" :class="{'bg-gray-100': index % 2, 'bg-white': !(index % 2)}">
         <dd class="py-3 px-4 w-1/6">{{ doc.productNumber }}</dd> 
         <dd class="py-3 px-4 w-1/3 text-left">{{ doc.description }}</dd> 
         <dd class="py-3 px-4 w-1/3">
            <a v-bind:href="doc.pdfUrl" class="text-brand-primary hover:underline" target="_blank">{{ doc.manualType }}</a>
          </dd> 
         <dd class="py-3 px-4 w-12">{{ doc.language }}</dd> 
      </dl>

    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import axios from 'axios';

export default {
  components: { Logo },
  data: function() {
    return {
      name: 'Home',
      search: '',
      docs: [],
    }
  },
  watch: {
    search: function (newValue, oldValue) {
      if (newValue !== oldValue && newValue.length) {
        this.findDocs(newValue);
      } else if (!newValue.length) {
        this.getDocs();
      }
    },
  },
  methods: {
    getDocs: function() {
      var vm = this;
      vm.search = '';
      axios.get(process.env.apiUrl + '/docs').then(function(response) {
        vm.docs = response.data;
      })
    },
    findDocs: function(query) {
      var vm = this;
      axios.get(process.env.apiUrl + '/docs/find/' + query).then(function(response){
        if (response.data) {
          vm.docs = response.data;
        }
      })
    },
  },
  mounted: function () {
    this.getDocs();
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items:flex-start;
  text-align: center;
  @apply py-24;
}
.scroll-box::after {
  content:'';
  position:absolute;
  background: lime;
  bottom:0;
  left:0;
  width:100%;
  height:40px;
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(247,247,247,1) 100%);
}

</style>
