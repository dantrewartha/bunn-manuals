<template>
  <div class="container px-6 max-w-7xl mx-auto">
    <div class="w-full">
      <logo />
      <h1 class="font-sans-light text-lg-3 my-8">Product Manuals</h1>
      <div class="flex p-6 bg-gray-100 border ">
        <div class="relative w-full w-auto">
          <input type="text" class="w-full py-3 px-4 border border-gray-200 rounded text-gray-700" placeholder="Search by material number or product description and press enter ⏎" v-model.lazy="search" />
          <button class="absolute p-3 px-4 right-0 top-0 bottom-0 text-gray-400" @click="clearSearch()" v-if="search.length">
            <i class="fas fa-times-circle"></i>
          </button>
        </div>
        <div class="w-full max-w-xs px-3">
          <div class="relative" v-on:click="inside" v-click-outside="outside">
            <button class="bg-white border border-gray-200 rounded text-left w-full p-3 pr-8 text-gray-700 appearance-none focus:outline-none truncate">
              <span v-for="(item, index) in type" v-bind:key="index">{{item}}<span v-if="index != type.length -1">, </span></span>
              <span v-if="type.length == 0">Select a manual type</span>
            </button>
            <ul class="bg-white p-4 text-left absolute w-full rounded border border-gray-200 text-gray-700" v-if="isOpen">
              <li class="bg-gray-100 px-3 py-2 border-b border-r border-l border-gray-200 flex items-center leading-none text-sm-1" v-for="(doc, index) in manualTypes" v-bind:key="index" v-bind:class="{ 'border-t': index === 0 }">
                <label class="cursor-pointer"><input type="checkbox" v-bind:value="doc" class="mr-2" v-model="type" @change="findDocs(search, type, lang)" />{{doc}}</label>
              </li>
            </ul>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" v-bind:class="{ 'rotate': isOpen }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div class="w-full md:w-84">
          <div class="relative">
            <select class="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded focus:outline-none" id="language" v-model="lang"  @change="findDocs(search, type, lang)">
              <option value="AR">Arabic</option>
              <option value="ZH">Chinese</option>
              <option value="ZF">Chinese Traditional</option>
              <option value="CS">Czech</option>
              <option value="DA">Danish</option>
              <option value="DE">German</option>
              <option value="EN" selected>English</option>
              <option value="FN">Finnish</option>
              <option value="FC">French (canadian)</option>
              <option value="FR">French (eu)</option>
              <option value="IT">Italian</option>
              <option value="JA">Japanese</option>
              <option value="KO">Korean</option>
              <option value="NL">Dutch</option>
              <option value="PB">Portuguese (brazil)</option>
              <option value="PT">Portuguese (eu)</option>
              <option value="PL">Polish</option>
              <option value="RU">Russian</option>
              <option value="ES">Spanish</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div>
          <button class="p-3 px-4 bg-brand-primary text-white ml-3 rounded appearance-none focus:outline-none" v-on:click="findDocs(search, type, lang)">Go</button>
        </div>
      </div>
      <div v-if="docs.length">
        <dl class="flex text-sm-1 font-sans-regular" v-for="(doc, index) in docs" v-bind:key="index" :class="{'bg-gray-100': index % 2, 'bg-white': !(index % 2)}">
          <dd class="py-3 px-4 w-1/6">{{ doc.productNumber }}</dd> 
          <dd class="py-3 px-4 w-2/5 text-left">{{ doc.description }}</dd> 
          <dd class="py-3 px-4 w-1/4">
              <a v-bind:href="doc.pdfUrl" class="text-brand-primary hover:underline" target="_blank">{{ doc.manualType }}</a>
            </dd> 
          <dd class="py-3 px-4 flex-grow">{{ doc.language }}</dd> 
        </dl>
      </div>
      <div v-else class="py-12">No results found</div>
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
      lang: 'EN',
      type: ['Installation and Operating'],
      manualTypes: ['Cleaning Card','Illustrated Parts','Insert/Supplement','Installation and Operating','Instruction','Programming','Service and Repair','Use and Care'],
      docs: [],
      isOpen: false,
      clickOutside: 0,
      clickInside: 0,
    }
  },
  watch: {
    search: function (newValue, oldValue) {
      var vm = this;
      if (newValue !== oldValue && newValue.length) {
        this.findDocs(newValue, vm.type, vm.lang);
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
    findDocs: function(query, type, lang) {
      var vm = this;
      if (query.length) {
        axios.post(process.env.apiUrl + '/docs', {
          query: query,
          manualType: type, 
          language: lang,
        })
        .then(function(response){
          if (response.data) {
            vm.docs = response.data;
          }
        })
      }
    },
    clearSearch: function() {
      this.search = '';
    },
    outside: function(e) {
      this.isOpen = false;
    },
    inside: function(e) {
      this.isOpen = true;
    }
  },
  mounted: function () {
    this.getDocs();
  },
  directives: {
    'click-outside': {
      bind: function(el, binding, vNode) {
        if (typeof binding.value !== 'function') {
        	const compName = vNode.context.name
          let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
          if (compName) { warn += `Found in component '${compName}'` }
          
          console.warn(warn)
        }
        const bubble = binding.modifiers.bubble
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
          	binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler
        document.addEventListener('click', handler)
			},
      
      unbind: function(el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null

      }
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.rotate {
  transform: rotate(180deg);
}
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
