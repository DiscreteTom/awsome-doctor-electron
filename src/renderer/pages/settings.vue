<template>
  <div>
    <v-text-field
      label="AWS Profile Name"
      v-model="profile"
      placeholder="default"
    />
    <v-text-field
      label="Region Code"
      v-model="region"
      placeholder="us-east-1"
    />

    <v-btn @click="save" color="primary">Save</v-btn>
    <v-btn @click="resetForm">Reset</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: "default",
      region: "us-east-1",
    };
  },
  methods: {
    resetForm() {
      this.profile = this.$store.state.profile;
      this.region = this.$store.state.region;
    },
    save() {
      this.$store.commit("updateConfig", {
        profile: this.profile,
        region: this.region,
      });
      ipcRenderer.send("get-aws-credentials", {
        profile: this.$store.state.profile,
        region: this.$store.state.region,
      });
    },
  },
  mounted() {
    this.resetForm();
  },
};
</script>
