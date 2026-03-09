import { createApp } from "vue";
import { AccountGatewayHttp } from "./AccountGateway";
import App from "./App.vue";

const app = createApp(App);
app.provide("accountGateway", new AccountGatewayHttp());
app.mount("#app");
