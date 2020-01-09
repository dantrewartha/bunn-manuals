<template>
  <div class="container px-6 max-w-7xl mx-auto">
    <div class="w-full">
      <logo />
      <h1 class="font-sans-light text-lg-3 my-8">Product Manuals</h1>
      <div class="flex p-6 pt-3 bg-gray-100 border">


        <div class="relative w-full w-auto">
          <label class="form-label">Search query</label>
          <div>
            <input type="text" id="searchInput" class="w-full py-3 px-4 border border-gray-200 rounded text-gray-700" placeholder="Search by material number or product description and press enter ⏎" v-model="search" />
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
      <div v-if="noResults" class="py-12">No results found</div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import MultiSelect from '~/components/MultiSelect.vue';
import axios from 'axios';

export default {
  components: { Logo, MultiSelect },
  data: function() {
    return {
      name: 'Home',
      search: '',
      lang: 'EN',
      type: ['Illustrated Parts'],
      manualTypes: ['Cleaning Card','Illustrated Parts','Insert/Supplement','Installation and Operating','Instruction','Programming','Service and Repair','Use and Care'],
      docs: [],
      noResults: null,
    }
  },
  watch: {
    search: function (newValue, oldValue) {
      var vm = this;
      if (newValue !== oldValue && newValue.length) {
        this.findDocs(newValue, vm.type, vm.lang);
      } else if (!newValue.length < 3) {
        this.docs = [];
      }
    },
  },
  methods: {
    findDocs: function(query, type, lang) {
      var vm = this;
      if (query.length > 2) {
        axios.post(process.env.apiUrl + '/docs', {
          query: query.trim(),
          manualType: type, 
          language: lang,
        })
        .then(function(response) {
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
    clearSearch: function() {
      var vm = this;
      this.search = '';
    },
  },
  mounted: function () {
    // this.getDocs();
    document.getElementById("searchInput").focus();
  }
}
</script>

<style>
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
  @apply uppercase tracking-wider text-left text-gray-500 font-sans-demi text-sm-2 p-1 block;
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
