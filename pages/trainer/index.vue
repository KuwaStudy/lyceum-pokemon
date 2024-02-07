<script setup>
const { data: trainersJson } = await useFetch("api/trainers");
</script>

<template>
  <div>
    <h1>トレイナー</h1>
    <table>
      <tr>
        <th>名前</th>
        <th>更新日</th>
      </tr>
      <tr v-for="trainer in trainersJson" :key="trainer">
        <td>
          <NuxtLink :to="`/trainer/${trainer.Key}`">{{ trainer.Key.replace(/\.json$/,"")}}</NuxtLink> 
        </td>
        <td>
          {{ new Date(trainer.LastModified).toLocaleString() }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
th,td {
  border: solid 1px;
  padding: 5px 10px;
}

td {
  min-width:180px;
}

table {
  border-collapse:  collapse;
}
</style>