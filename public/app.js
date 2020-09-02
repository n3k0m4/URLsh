const app = new Vue({
  el: "#app",
  data: {
    url: "",
    alias: "",
    created: null,
  },
  methods: {
    async createUrl() {
      const response = await fetch("/url", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          alias: this.alias,
          url: this.url,
        }),
      });
      this.created = await response.json();
    },
  },
});
