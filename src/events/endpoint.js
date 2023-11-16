import { filter } from "./repository.js";
import { arrayToObject } from "../utilities/array-to-object.js";

export const get = async (ctx) => {
  const { id } = ctx.params;
  if (id) {
    ctx.response.body = { id };
    return;
  }
  const { option } = ctx.request.query || "";
  if (option === "") {
    const {
      relationId,
      referenceId,
      tags,
      detail,
      timeRangeBegin,
      timeRangeEnd,
      skip,
      take,
    } = ctx.request.query;
    ctx.response.body = await filter({
      relationId: relationId || 0,
      referenceId: referenceId || 0,
      tags: tags ? tags.split(",") : [],
      detail: detail ? arrayToObject(detail.split(",")) : {},
      timeRange:
        timeRangeBegin && timeRangeEnd ? [timeRangeBegin, timeRangeEnd] : [],
      skip: skip || 0,
      take: take || 10,
    });
    return;
  }
  ctx.response.status = 406;
  return;
};
