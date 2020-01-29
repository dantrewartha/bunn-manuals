<template>
  <div class="container px-4 md:px-6 max-w-7xl mx-auto py-12 md:py-16 lg:py-24">
    <div class="w-full">
      <logo />
      <h1 class="font-sans-light text-lg-2 md:text-lg-3 my-4 md:my-8">Product Manuals</h1>
      <!-- Search -->
      <div class="flex flex-col lg:flex-row p-4 pt-2 md:p-6 md:pt-3 bg-gray-100 border">
        <div class="flex flex-col md:flex-row flex-wrap w-full">
          <div class="w-full w-auto lg:w-1/2 lg:pr-2">
            <div id="searchFilters" class="flex">
              <label class="form-label cursor-pointer mr-3"><input type="radio" class="mr-1 lg:mr-2" v-bind:value="allModels" @change="updateDiscontintued" v-model="status" /> All models</label>
              <label class="form-label cursor-pointer mr-3"><input type="radio" class="mr-1 lg:mr-2" v-bind:value="currentModels" @change="updateDiscontintued" v-model="status" /> Current<span class="hidden md:inline ml-1"> models only</span></label>
              <label class="form-label cursor-pointer"><input type="radio" class="mr-1 lg:mr-2" v-bind:value="discontinuedModels" @change="updateDiscontintued" v-model="status" /> Discontinued<span class="hidden md:inline ml-1"> models only</span></label>
            </div>
            <div class="relative">
              <input type="text" id="searchInput" class="w-full py-3 px-4 border border-gray-200 rounded text-gray-700 set-height outline-none focus:shadow-outline" placeholder="Search by material number or product description" v-model.trim="search" />
              <button class="absolute p-3 px-4 right-0 top-0 bottom-0 text-gray-400" @click="clearSearch()" v-if="search.length">
                <i class="fas fa-times-circle"></i>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/2 md:pr-2 lg:w-1/4 lg:pl-2">
            <label class="form-label">Manual Type(s)</label>
            <multi-select 
              id="manualTypes" 
              v-bind:list-data="manualTypes" 
              v-bind:button-text="'Select a manual type'" 
              @select="updateTypes">
            </multi-select>
          </div>
          <div class="w-full md:w-1/2 md:pl-2 lg:w-1/4">
            <label class="form-label">Language</label>
            <radio-select 
              id="languageTypes"
              v-bind:list-data="languages"
              v-bind:default="defaultLanguage"
              @select="updateLang">
            </radio-select>
          </div>
        </div>
      </div>
      <!-- Results -->
      <div v-if="docs.length" class="fade-in">
        <dl class="flex flex-col lg:items-center lg:flex-row text-sm-1 font-sans-regular text-left lg:text-center p-3 px-4 relative lg:py-0" v-for="(doc, index) in docs" v-bind:key="index" :class="{'bg-gray-100': index % 2, 'bg-white': !(index % 2)}">
          <dd class="lg:w-2/12">{{ doc.productNumber }}</dd> 
          <dd class="lg:w-5/12 text-left font-sans-medium lg:font-sans-regular lg:h-12 lg:flex lg:items-center">
            <span class="block md:inline">{{ doc.description }}</span>
            <span class="inline-block text-sm-3 font-sans-demi uppercase bg-avert-light text-avert py-1 px-2 rounded-full -mx-1 my-1 md:my-0 md:mx-2" v-if="doc.status == 'OB' || doc.status == 'OC'">Discontinued</span>
          </dd> 
          <dd class="lg:w-2/12">{{ doc.manualType }}</dd> 
          <dd class="lg:w-1/12">{{ doc.language }}</dd> 
          <dd class="lg:w-2/12">
            <a v-bind:href="doc.pdfUrl" class="" target="_blank" title="Open Manual">
              View manual
              <i class="far fa-external-link hidden"></i>
            </a>
          </dd>
        </dl>
      </div>
      <div v-if="zeroResults" class="py-20 fade-in text-lg-1 text-gray-600 max-w-lg mx-auto">Sorry, we couldn't find anything for "{{search}}"</div>
      <div v-if="initialView" class="py-20 fade-in text-lg-1 text-gray-600 max-w-lg mx-auto">Welcome! Use the search box above to find current model and/or discontinued product manauls.</div>
      <div v-if="noManualTypeSelected" class="py-20 fade-in text-lg-1 text-gray-600 max-w-md mx-auto">Please select a manual type</div>
      <div v-if="showSpinner" class="py-20 fade-in flex items-center justify-center text-gray-400 z-page">
        <svg class="spinner stroke-current" width="28px" height="28px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
           <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
      </div>
    </div>
    <v-tour name="myTour" :steps="steps" :callbacks="tourCallbacks" :options="{ highlight: true }"></v-tour>
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
        {'label':'English','value':'EN'},
        {'label':'Arabic','value':'AR'},
        {'label':'Chinese','value':'ZH'},
        {'label':'Chinese Traditional','value':'ZF'},
        {'label':'Czech','value':'CS'},
        {'label':'Danish','value':'DA'},
        {'label':'German','value':'DE'},
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
      searching: false,
      status: [],
      allModels: ['RL','RC','OB','OC'],
      currentModels: ['RL','RC'],
      discontinuedModels: ['OB','OC'],
      status: ['RL','RC','OB','OC'],
      tourStep: 0,
      tourCallbacks: {
        onStop: this.tourComplete,
        onNextStep: this.tourNext,
        onPreviousStep: this.tourPrev
      },
      steps: [
          {
            target: '#searchInput',
            content: 'Search for manuals by <strong class="font-sans-demi">material number</strong> or <strong class="font-sans-demi">product description</strong>.'
          },
          {
            target: '#searchInput',
            content: 'For customer specific models, try searching on <strong class="font-sans-demi">the first 5 digits</strong> of the material number for better results.'
          },
          {
            target: '#searchFilters',
            content: 'Filter search results by <strong class="font-sans-demi">current</strong>, <strong class="font-sans-demi">discontinued</strong>, or <strong class="font-sans-demi">all models</strong>. Your selection is saved until you change it.'
          },
          {
            target: '#manualTypes',
            content: '<strong class="font-sans-demi">Illustrated Parts</strong> is the default type. However, you can include additional manual types here.'
          },
          {
            target: '#languageTypes',
            content: '<strong class="font-sans-demi">English</strong> is the default language. However, you can choose from other language types here.'
          }
        ]
    }
  },
  computed: {
    showSpinner: function () {
      var vm = this;
      return vm.searching && vm.search.length && !vm.docs.length;
    },
    zeroResults: function() {
      var vm = this;
      return vm.noResults && vm.type.length;
    },
    initialView: function() {
      var vm = this;
      return !vm.docs.length && !vm.noManualTypeSelected && !vm.zeroResults && !vm.showSpinner;
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
    findDocs: function() {
      var vm = this;
      vm.searching = true;
      vm.noResults = false;
      if (vm.search.length > 1) {
        axios.post(process.env.apiUrl + '/docs', {
          query: vm.search,
          manualType: vm.type, 
          language: vm.lang,
          status: vm.status,
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
      vm.findDocs();
    },
    updateLang: function(e) {
      var vm = this;
      vm.lang = e.value;
      vm.findDocs();
    },
    updateDiscontintued: function(e) {
      var vm = this;
      vm.setCookie('searchPreferences', e.target.value, 2);
      vm.findDocs();
    },
    clearSearch: function() {
      var vm = this;
      vm.search = '';
    },
    setCookie: function (cookieName, cookieValue, days) {
      let date = new Date()
      date.setTime(date.getTime() + (days*24*60*60*1000))
      let expires = 'expires=' + date.toUTCString()
      document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/'
    },
    readCookie: function(a) {
      let b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    },
    tourComplete: function() {
      var vm = this;
      vm.tourStep++;
      (vm.tourStep === vm.steps.length) ? vm.setCookie('tourComplete', 'true', 365) : vm.setCookie('tourComplete', 'false', 365);
      document.getElementById("searchInput").focus();
    },
    tourNext: function() {
      var vm = this;
      vm.tourStep++;
    },
    tourPrev: function() {
      var vm = this;
      vm.tourStep--;
    }
  },
  mounted: function () {
    let searchPref = this.readCookie('searchPreferences');
    let array = searchPref.split(',');
    if (!searchPref) {
      this.setCookie('searchPreferences', 'RL,RC,OB,OC', 2)
    } else {
      this.status = array;
    }
    let tourComplete = this.readCookie('tourComplete');
    if (tourComplete === 'true') { 
      document.getElementById("searchInput").focus();
      this.setCookie('tourComplete', 'true', 365)
    } else {
      this.$tours['myTour'].start() 
    }
  },
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items:flex-start;
  text-align: center;
}
.form-label {
  @apply flex items-center font-sans-demi uppercase text-gray-500 text-sm-2 tracking-wide p-1 py-2 text-left;
}
.fade-in {
	-webkit-animation: fadein .5s linear;
  animation: fadein .5s linear;
}
.v-tour__target--highlighted {
  box-shadow: 0 0 0 99999px rgba(0,0,0,.6);
  border-radius: .25rem;
}
.v-step { 
  background: rgba(0,0,0,.6) !important; 
  font-size:.9375rem !important; 
  -webkit-filter: none !important;
  filter: none !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.v-step__content {
  margin: 0 0 1rem 0 !important;
}
.v-tour__target--relative {
  position: relative !important;
}
.v-step .v-step__arrow {
  border-color: rgba(0,0,0,.6) !important; 
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important; 
}
.v-step__button { 
  padding: 6px 12px !important; 
  border-radius: .25rem !important;
}
.v-step__button:hover {
  background-color: white !important; 
  color: #000000 !important;
}
</style>
