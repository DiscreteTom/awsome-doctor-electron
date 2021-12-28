<template>
  <div>
    <v-alert type="success" v-model="saved" dismissible> Saved </v-alert>
    <v-switch v-model="useProfile" label="Use Profile (Recommended)" />
    <v-text-field
      label="AWS Profile Name"
      v-model="profile"
      placeholder="default"
      v-if="useProfile"
    />
    <div v-else>
      <v-text-field
        v-model="tempAk"
        label="Access Key Id"
        messages="This is only available during the current session."
      />
      <v-text-field
        v-model="tempSk"
        label="Secret Access Key"
        type="password"
        messages="This is only available during the current session."
      />
    </div>
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
      useProfile: true,
      profile: "default",
      region: "us-east-1",
      saved: false,
      tempAk: "",
      tempSk: "",
    };
  },
  methods: {
    resetForm() {
      this.profile = this.$store.state.profile;
      this.region = this.$store.state.region;
      this.saved = false;
      this.tempAk = this.$store.state.tempAk;
      this.tempSk = this.$store.state.tempSk;
      this.useProfile = this.$store.state.useProfile;
    },
    save() {
      this.$store.commit("updateConfig", {
        profile: this.profile,
        region: this.region,
        useProfile: this.useProfile,
        tempAk: this.tempAk,
        tempSk: this.tempSk,
      });
      if (this.useProfile) {
        this.$ipc.send("get-aws-credentials", {
          profile: this.$store.state.profile,
          region: this.$store.state.region,
        });
      } else {
        this.$ipc.send("get-aws-credentials", {
          tempAk: this.tempAk,
          tempSk: this.tempSk,
        });
      }

      this.saved = true;
    },
  },
  mounted() {
    this.resetForm();
  },
};
</script>
