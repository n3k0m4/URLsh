const app = new Vue({
  el: "#app",
  data: {
    url: "",
    alias: "",
    created: null,
  },
  methods: {
    createUrl() {
      console.log(this.url, this.alias);
    },
  },
});
