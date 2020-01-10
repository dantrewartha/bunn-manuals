<template>
  <div class="container px-6 max-w-7xl mx-auto">
    <div class="w-full">
      <logo />
      <h1 class="font-sans-light text-lg-3 my-8">Product Manuals</h1>
      <div class="flex p-6 pt-3 bg-gray-100 border">
        <div class="w-full w-auto">
          <label class="form-label">Search query</label>
          <div class="relative">
            <input type="text" id="searchInput" class="w-full py-3 px-4 border border-gray-200 rounded text-gray-700 set-height" placeholder="Search by material number or product description" v-model.trim="search" />
            <button class="absolute p-3 px-4 right-0 top-0 bottom-0 text-gray-400" @click="clearSearch()" v-if="search.length">
              <i class="fas fa-times-circle"></i>
            </button>
          </div>
        </div>
        <div class="w-full max-w-xs px-3">
          <label class="form-label">Manual Type(s)</label>
          <multi-select 
            v-bind:list-data="manualTypes" 
            v-bind:button-text="'Select a manual type'" 
            @select="updateTypes">
          </multi-select>
        </div>
        <div class="w-full md:w-84">
          <label class="form-label">Language</label>
          <radio-select 
            v-bind:list-data="languages"
            v-bind:default="defaultLanguage"
            @select="updateLang">
          </radio-select>
        </div>
      </div>
      <div v-if="docs.length" class="fade-in">
        <dl class="flex text-sm-1 font-sans-regular" v-for="(doc, index) in docs" v-bind:key="index" :class="{'bg-gray-100': index % 2, 'bg-white': !(index % 2)}">
          <dd class="py-3 px-4 w-1/6">{{ doc.productNumber }}</dd> 
          <dd class="py-3 px-4 w-2/5 text-left">{{ doc.description }}</dd> 
          <dd class="py-3 px-4 w-1/4">
            <a v-bind:href="doc.pdfUrl" class="text-brand-primary hover:underline" target="_blank">{{ doc.manualType }}</a>
          </dd> 
          <dd class="py-3 px-4 flex-grow">{{ doc.language }}</dd> 
        </dl>
      </div>
      <div v-if="zeroResults" class="py-12 fade-in">No results found</div>
      <div v-if="noManualTypeSelected" class="py-12 fade-in">Please select a manual type</div>
      <div v-if="showSpinner" class="py-12 fade-in flex items-center justify-center text-gray-400">
        <svg class="spinner stroke-current" width="28px" height="28px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
           <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import MultiSelect from '~/components/MultiSelect.vue';
import RadioSelect from '~/components/RadioSelect.vue';
import axios from 'axios';

export default {
  components: { Logo, MultiSelect, RadioSelect },
  data: function() {
    return {
      name: 'Home',
      search: '',
      lang: 'EN',
      type: ['Illustrated Parts'],
      manualTypes: ['Cleaning Card','Illustrated Parts','Insert/Supplement','Installation and Operating','Instruction','Programming','Service and Repair','Use and Care'],
      languages: [
        {'label':'Arabic','value':'AR'},
        {'label':'Chinese','value':'ZH'},
        {'label':'Chinese Traditional','value':'ZF'},
        {'label':'Czech','value':'CS'},
        {'label':'Danish','value':'DA'},
        {'label':'German','value':'DE'},
        {'label':'English','value':'EN'},
        {'label':'Finnish','value':'FN'},
        {'label':'French (canadian)','value':'FC'},
        {'label':'French (eu)','value':'FR'},
        {'label':'Italian','value':'IT'},
        {'label':'Japanese','value':'JA' },
        {'label':'Korean','value':'KO'},
        {'label':'Dutch','value':'NL'},
        {'label':'Portuguese (brazil)','value':'PB'},
        {'label':'Portuguese (eu)','value':'PT'},
        {'label':'Polish','value':'PL'},
        {'label':'Russian','value':'RU'},
        {'label':'Spanish','value':'ES'}
      ],
      defaultLanguage: {'label':'English','value':'EN'},
      docs: [],
      noResults: null,
      searching: false
    }
  },
  computed: {
    showSpinner: function () {
      var vm = this;
      return vm.searching && vm.search.length;
    },
    zeroResults: function() {
      var vm = this;
      return vm.noResults && vm.type.length;
    },
    noManualTypeSelected: function() {
      var vm = this;
      return vm.noResults && !vm.type.length;
    }
  },
  watch: {
    search: function (newValue, oldValue) {
      var vm = this;
      if (newValue !== oldValue && newValue.length) {
        this.findDocs(newValue, vm.type, vm.lang);
      } else if (!newValue.length < 3) {
        this.docs = [];
        this.searching = false;
      }
    },
  },
  methods: {
    findDocs: function(query, type, lang) {
      var vm = this;
      vm.searching = true;
      vm.noResults = false;
      if (query.length > 2) {
        axios.post(process.env.apiUrl + '/docs', {
          query: query,
          manualType: type, 
          language: lang,
        })
        .then(function(response) {
          vm.searching = false;
          if (response.data) {
            vm.docs = response.data;
            (vm.docs.length) ? vm.noResults = false : vm.noResults = true;
          }
        })
      }
    },
    updateTypes: function(e) {
      var vm = this;
      vm.type = e;
      vm.findDocs(vm.search, vm.type, vm.lang)
    },
    updateLang: function(e) {
      var vm = this;
      vm.lang = e.value;
      vm.findDocs(vm.search, vm.type, vm.lang)
    },
    clearSearch: function() {
      var vm = this;
      vm.search = '';
    },
  },
  mounted: function () {
    document.getElementById("searchInput").focus();
  }
}
</script>

<style>
body {
  background: white;
  @apply text-base;
}
.set-height {
  height: 46px;
}
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
.form-label {
  @apply block font-sans-demi uppercase text-gray-500 text-sm-2 tracking-wide p-1 pt-3 text-left;
}
.fade-in {
	-webkit-animation: fadein .5s linear;
  animation: fadein .5s linear;
}
</style>
