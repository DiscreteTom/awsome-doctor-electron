<template>
  <v-app>
    <v-app-bar app>
      <!-- site title -->
      <v-toolbar-title> Awsome Doctor 👩‍⚕️ 👨‍⚕️ </v-toolbar-title>

      <v-spacer />

      <!-- home button -->
      <tt-btn bottom to="/" tt="Home" icon="mdi-home-outline" />
      <!-- settings button -->
      <tt-btn bottom to="/settings" icon="mdi-cog-outline" tt="Settings" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TtBtn from "../components/TtBtn.vue";
import { ipcRenderer } from "electron";

export default {
  components: { TtBtn },
  created() {
    ipcRenderer.on("load-config", (event, arg) => {
      this.$store.commit("loadConfig", arg);
      ipcRenderer.send("get-aws-credentials", {
        profile: this.$store.state.profile,
        region: this.$store.state.region,
      });
    });
    ipcRenderer.on("get-aws-credentials", (event, arg) => {
      this.$aws.configure({ ...arg, region: this.$store.state.region });
    });

    ipcRenderer.send("load-config");
  },
};
</script>

<style>
body {
  margin: 0 !important;
}
</style>
