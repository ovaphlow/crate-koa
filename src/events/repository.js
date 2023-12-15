import {
  inBuilder,
  arrayContainBuilder,
  equalBuilder,
  likeBuilder,
  objectContainBuilder,
  objectLikeBuilder,
  lesserBuilder,
  greaterBuilder,
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
 * @param {string[]} option.objectLike
 * @param {string[]} option.inList
 * @param {string[]} option.lesser
 * @param {string[]} option.greater
 */
export async function defaultFilter(
  { skip, take },
  {
    equal,
    objectContain,
    arrayContain,
    like,
    objectLike,
    inList,
    lesser,
    greater,
  },
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
  if (objectLike.length > 0 && objectLike.length % 3 === 0) {
    objectLikeBuilder(objectLike, conditions, params);
  }
  if (inList.length > 1) {
    inBuilder(inList, conditions, params);
  }
  if (lesser.length > 0 && lesser.length % 2 === 0) {
    lesserBuilder(lesser, conditions, params);
  }
  if (greater.length > 0 && greater.length % 2 === 0) {
    greaterBuilder(greater, conditions, params);
  }
  if (conditions.length > 0) {
    q = `${q} where ${conditions.join(" and ")}`;
  }
  q = `${q} order by id desc limit ${skip}, ${take}`;
  console.info(q);
  const client = pool.promise();
  const [result] = await client.execute(q, params);
  return result;
}
