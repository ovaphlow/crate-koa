import { defaultFilter } from "./repository.js";

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
    const skip = parseInt(ctx.request.query["take"]?.toString() || "0");
    const equal = (ctx.request.query["equal"]?.toString() || "[]").split(",");
    const objectContain = (
      ctx.request.query["object-contain"]?.toString() || "[]"
    ).split(",");
    const arrayContain = (
      ctx.request.query["array-contain"]?.toString() || "[]"
    ).split(",");
    const like = (ctx.request.query["like"]?.toString() || "[]").split(",");
    ctx.response.body = await defaultFilter(
      { skip, take },
      { equal, objectContain, arrayContain, like },
    );
    return;
  }
  ctx.response.status = 406;
  return;
};
