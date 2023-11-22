import { pool } from "../utilities/database-mysql.js";

const columns = ["id", "relation_id", "reference_id", "tags", "detail", "time"];

export const filter = async ({
  relationId,
  referenceId,
  tags,
  detail,
  timeRange,
  skip,
  take,
}) => {
  let q = `
  select cast(id as char) _id, ${columns.join(",")}
  from events
  `;
  const conditions = [];
  const params = [];
  if (relationId > 0) {
    conditions.push("relation_id = ?");
    params.push(relationId);
  }
  if (referenceId > 0) {
    conditions.push("reference_id = ?");
    params.push(referenceId);
  }
  tags.forEach((it) => {
    conditions.push("json_contains(tags, json_array(?))");
    params.push(it);
  });
  Object.keys(detail).forEach((key) => {
    conditions.push("json_contains(detail, json_object(?, ?))");
    params.push(key, detail[key]);
  });
  if (timeRange.length === 2) {
    conditions.push("time >= ?", "time <= ?");
    params.push(timeRange[0], timeRange[1]);
  }
  if (conditions.length > 0) {
    q = `
    ${q}
    where ${conditions.join(" and ")}
    `;
  }
  q = `
  ${q}
  order by id desc
  limit ${skip}, ${take}
  `;
  console.info(q);
  const client = pool.promise();
  const [result] = await client.query(q, params);
  return result;
};
