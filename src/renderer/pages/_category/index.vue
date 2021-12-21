<template>
  <div>
    <h2 class="mx-3">Available workflows:</h2>
    <v-list nav dense>
      <v-list-item
        v-for="(workflow, workflowName) in content"
        :key="workflowName"
        :to="`/${category}/${workflowName}`"
      >
        <v-list-item-icon>
          <v-icon> mdi-link </v-icon>
        </v-list-item-icon>
        <v-list-item-title> {{ workflow.title }} </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  async asyncData({ params }) {
    const category = params.category;
    return { category };
  },
  computed: {
    content() {
      return this.$workflow[this.category];
    },
  },
};
</script>
