export const get = async (ctx) => {
  const { id } = ctx.params;
  if (id) {
    ctx.response.body = { id };
    return;
  }
  const { option } = ctx.request.query || "";
  if (option === "") {
    ctx.response.body = [];
    return;
  }
  ctx.response.status = 406;
  return;
};
