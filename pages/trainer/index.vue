<script setup>
const config = useRuntimeConfig();
const { data: trainersJson } = await useTrainers();
const onDelete = async (key) => {
  const response = await $fetch(`/api/trainer/${key.replace(/\.json$/,"")}`, {
    baseURL: config.public.backendOrigin,
    method: "DELETE",
  }).catch((e) => e);
  location.reload();
}
</script>

<template>
  <div>
    <h1>トレーナー</h1>
    <table>
      <tr>
        <th>名前</th>
        <th>更新日</th>
        <th>さよならする</th>
      </tr>
      <tr v-for="trainer in trainersJson" :key="trainer">
        <td>
          <NuxtLink :to="`/trainer/${trainer.Key}`">{{ trainer.Key.replace(/\.json$/,"")}}</NuxtLink> 
        </td>
        <td>
          {{ new Date(trainer.LastModified).toLocaleString() }}
        </td>
        <td>
          <GamifyButton type="button" @click="onDelete(trainer.Key)">さよなら</GamifyButton>
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