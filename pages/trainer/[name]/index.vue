<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { data: trainersJson, refresh } = await useFetch(
  () => `/api/trainer/${route.params.name.replace(/\.json$/,"")}`,
  {
    default: () => [],
    server: false,
    baseUrl: config.public.backendOrigin,
    method: "GET",
  },
);
const onDelete = async (pokemonId) => {
  console.log(`onDelete(${pokemonId})`);
  console.log(`/api/trainer/${route.params.name}/pokemon/${pokemonId}`);
  const response = await fetch(
    `/api/trainer/${route.params.name}/pokemon/${pokemonId}`,
    {
      default: () => [],
      server: false,
      baseURL: config.public.backendOrigin,
      method: "DELETE",
    },
  ).catch((e) => e);
  if (response instanceof Error) return;
  await refresh();
};
</script>
<template>
  <GamifyButton type="button" @click="router.push('/trainer')">トレーナー一覧に戻る</GamifyButton>
  <h1>トレーナ情報</h1>
   <div class="trainer-info">
    <img src="/avatar.png" />
    <h2>{{ trainersJson.name }}</h2>
   </div>
   <h2>てもちポケモン</h2>
   <table>
      <tr>
        <th>名前</th>
        <th>ポケモン</th>
        <th>さよならする</th>
      </tr>
      <tr v-for="pokemon in trainersJson.pokemons" :key="pokemon.id">
        <td>
          <h2>{{ pokemon.name }}</h2>
        </td>
        <td>
          <img :src="pokemon.sprites.front_default" :width="150"/>
        </td>
        <td>
          <GamifyButton type="button" @click="onDelete(pokemon.id)">さよなら</GamifyButton>
        </td>
      </tr>
    </table>
    <br/>
    <div>
      <CatchButton :to="`/trainer/${route.params.name}/catch`">ポケモンをつかまえる</CatchButton>
    </div>
</template>

<style scoped>
th,td {
  border: solid 1px;
  padding: 5px 10px;
}

td {
  min-width:180px;
  text-align: center; 
}

table {
  border-collapse:  collapse;
}
</style>