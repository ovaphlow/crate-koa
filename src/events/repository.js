import {
  arrayContainBuilder,
  equalBuilder,
  likeBuilder,
  objectContainBuilder,
} from "../utilities/condition-builder.js";
import { pool } from "../utilities/database-mysql.js";

const columns = ["id", "relation_id", "reference_id", "tags", "detail", "time"];

/**
 * @param {object} pagination
 * @param {number} pagination.skip
 * @param {number} pagination.take
 * @param {object} option
 * @param {string[]} option.equal
 * @param {string[]} option.objectContain
 * @param {string[]} option.arrayContain
 * @param {string[]} option.like
 */
export async function defaultFilter(
  { skip, take },
  { equal, objectContain, arrayContain, like },
) {
  let q = `select cast(id as char) _id, ${columns.join(",")} from events`;
  /** @type {string[]} */
  const conditions = [];
  /** @type {string[]} */
  const params = [];
  if (equal.length > 0 && equal.length % 2 === 0) {
    equalBuilder(equal, conditions, params);
  }
  if (objectContain.length > 0 && objectContain.length % 3 === 0) {
    objectContainBuilder(objectContain, conditions, params);
  }
  if (arrayContain.length > 0 && arrayContain.length % 2 === 0) {
    arrayContainBuilder(arrayContain, conditions, params);
  }
  if (like.length > 0 && like.length % 2 === 0) {
    likeBuilder(like, conditions, params);
  }
  if (conditions.length > 0) {
    q = `${q} where ${conditions.join(" and ")}`;
  }
  q = `${q} order by id desc limit ${skip}, ${take}`;
  console.info(q);
  const client = pool.promise();
  const [result] = await client.query(q, params);
  return result;
}
