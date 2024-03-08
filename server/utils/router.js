import { Router } from "express";
import { findTrainers, getTrainer, upsertTrainer, deleteTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    res.send(trainers);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    if (!req.body.name) {
      res.status(400).send(null);
    } else {
      console.log(req.body.name);
    }
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
router.get("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const trainer = await getTrainer(trainerName);
    res.send(trainer);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const trainer = await getTrainer(trainerName);
    if (!trainer || trainer.name) {
      res.status(404).send(trainer);
    } else {
      const result = await upsertTrainer(trainerName, req.body);
      res.status(result["$metadata"].httpStatusCode).send(result);
    }
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
router.delete("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const result = await deleteTrainer(trainerName);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const trainer = await getTrainer(trainerName);
    if (!("name" in req.body && req.body.name.length > 0))
       return res.status("400").send();
    console.log(req.body.name);
    const pokemon = await findPokemon(req.body.name);
    const {
      order,
      name,
      sprites: { front_default },
    } = pokemon;
    trainer.pokemons.push({
      id: (trainer.pokemons[trainer.pokemons.length - 1]?.id ?? 0) + 1,
      nickname: "",
      order,
      name,
      sprites: { front_default },
    });
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/** ポケモンの削除 */
router.delete(
  "/trainer/:trainerName/pokemon/:pokemonId",
  async (req, res, next) => {
    try {
      const { trainerName, pokemonId } = req.params;
      const trainer = await findTrainer(trainerName);
      const index = trainer.pokemons.findIndex(
        (pokemon) => String(pokemon.id) === pokemonId,
      );
      trainer.pokemons.splice(index, 1);
      const result = await upsertTrainer(trainerName, trainer);
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      next(err);
    }
  },
);


/** ポケモンの追加 */
// router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
//   try {
//     const { trainerName } = req.params;
//     // TODO: リクエストボディにポケモン名が含まれていなければ400を返す
//     const pokemon = await findPokemon(req.body.name);
//     // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
//     const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
//     res.status(result["$metadata"].httpStatusCode).send(result);
//   } catch (err) {
//     next(err);
//   }
// });

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装

export default router;
