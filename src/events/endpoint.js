import { retrieve } from "../utilities/shared-repository.js";

/**
 * @param {import("koa").Context} ctx
 */
export const get = async (ctx) => {
  const { id } = ctx.params;
  if (id) {
    ctx.response.body = { id };
    return;
  }
  const { option } = ctx.request.query || "";
  if (option === "default") {
    const take = parseInt(ctx.request.query["take"]?.toString() || "10");
    const skip =
      (parseInt(ctx.request.query["page"]?.toString() || "1") - 1) * take;
    const equal = (ctx.request.query["equal"]?.toString() || "[]").split(",");
    const objectContain = (
      ctx.request.query["object-contain"]?.toString() || "[]"
    ).split(",");
    const arrayContain = (
      ctx.request.query["array-contain"]?.toString() || "[]"
    ).split(",");
    const like = (ctx.request.query["like"]?.toString() || "[]").split(",");
    const objectLike = (
      ctx.request.query["object-like"]?.toString() || "[]"
    ).split(",");
    const inList = (ctx.request.query["in"]?.toString() || "[]").split(",");
    const lesser = (ctx.request.query["lesser"]?.toString() || "[]").split(",");
    const greater = (ctx.request.query["greater"]?.toString() || "[]").split(
      ",",
    );
    const result = await retrieve("event", skip, take, {
      equal,
      objectContain,
      arrayContain,
      like,
      objectLike,
      inList,
      lesser,
      greater,
    });
    result.forEach((it) => {
      it.tags = JSON.stringify(it.tags);
      it.detail = JSON.stringify(it.detail);
      it._id = it["id"].toString();
      it._relationId = it["relation_id"].toString();
      it._referenceId = it["reference_id"].toString();
    });
    ctx.response.body = result;
    return;
  }
  ctx.response.status = 406;
  return;
};
