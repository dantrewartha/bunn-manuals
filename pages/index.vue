<template>
  <div class="container px-6 max-w-7xl mx-auto">
    <div class="w-full">
      <logo />
      <h1 class="font-sans-light text-lg-3 my-8">Product Manuals</h1>
      <div class="p-6 bg-gray-100">
        <input type="text" class="w-full py-3 px-4 border border-gray-200 rounded text-gray-700" placeholder="Search by material number or product description and press enter ⏎" v-model.lazy="search" />
        <div class="flex">
        </div>
      </div>
      <dl class="flex text-sm-1 font-sans-regular" v-for="(doc, index) in docs" v-bind:key="index" :class="{'bg-gray-100': index % 2, 'bg-white': !(index % 2)}">
         <dd class="py-3 px-4 w-1/6">{{ doc.productNumber }}</dd> 
         <dd class="py-3 px-4 w-1/3 text-left">{{ doc.description }}</dd> 
         <dd class="py-3 px-4 w-1/3">{{ doc.manualType }}</dd> 
         <dd class="py-3 px-4 w-12">{{ doc.language }}</dd> 
         <dd class="py-3 px-4 w-1/6">
          <a v-bind:href="doc.pdfUrl" class="text-brand-primary hover:underline" target="_blank">
            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="external-link" class="svg-inline--fa fa-external-link fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.6,0,334.4.17A14.4,14.4,0,0,0,320,14.57V47.88a14.4,14.4,0,0,0,14.69,14.4l73.63-2.72,2.06,2.06L131.52,340.49a12,12,0,0,0,0,17l23,23a12,12,0,0,0,17,0L450.38,101.62l2.06,2.06-2.72,73.63A14.4,14.4,0,0,0,464.12,192h33.31a14.4,14.4,0,0,0,14.4-14.4L512,14.4A14.4,14.4,0,0,0,497.6,0ZM432,288H416a16,16,0,0,0-16,16V458a6,6,0,0,1-6,6H54a6,6,0,0,1-6-6V118a6,6,0,0,1,6-6H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V304A16,16,0,0,0,432,288Z"></path></svg>
          </a>
        </dd> 
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
      }
    },
  },
  methods: {
    getDocs: function() {
      var vm = this;
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
  align-items: center;
  text-align: center;
  @apply py-24;
}

</style>
