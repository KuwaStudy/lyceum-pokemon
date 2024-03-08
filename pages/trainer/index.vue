<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const { data: trainersJson } = await useTrainers();
const pokemons = {};
for (const item in trainersJson.value) {
    const { data: result } = await useTrainer(trainersJson.value[item].Key);
    console.log(result.value);
    pokemons[trainersJson.value[item].Key] = result.value.pokemons.length;
}
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
        <th>取得したポケモンの数</th>
        <th>更新日</th>
        <th>さよならする</th>
        <th>捕まえる</th>
      </tr>
      <tr v-for="trainer in trainersJson" :key="trainer">
        <td>
          <NuxtLink :to="`/trainer/${trainer.Key}`">{{ trainer.Key.replace(/\.json$/,"")}}</NuxtLink> 
        </td>
        <td>
          {{ pokemons[trainer.Key] }}
        </td>
        <td>
          {{ new Date(trainer.LastModified).toLocaleString() }}
        </td>
        <td>
          <GamifyButton type="button" @click="onDelete(trainer.Key)">さよなら</GamifyButton>
        </td>
        <td>
          <CatchButton :to="`/trainer/${trainer.Key}/catch`">ポケモンをつかまえる</CatchButton>
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