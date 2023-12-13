/**
 * @param {string[]} equal
 * @param {string[]} conditions
 * @param {string[]} params
 */
export function equalBuilder(equal, conditions, params) {
  for (let i = 0; i < equal.length; i += 2) {
    conditions.push(`${equal[i]} = ?`);
    params.push(equal[i + 1]);
  }
}

/**
 * @param {string[]} objectContain
 * @param {string[]} conditions
 * @param {string[]} params
 */
export function objectContainBuilder(objectContain, conditions, params) {
  for (let i = 0; i < objectContain.length; i += 3) {
    conditions.push(
      `json_contains(${objectContain[i]}, json_object('${objectContain[i + 1]
      }', ?))`,
    );
    params.push(objectContain[i + 2]);
  }
}

/**
 * @param {string[]} arrayContain
 * @param {string[]} conditions
 * @param {string[]} params
 */
export function arrayContainBuilder(arrayContain, conditions, params) {
  for (let i = 0; i < arrayContain.length; i += 2) {
    conditions.push(`json_contains(${arrayContain[i]}, json_array(?))`);
    params.push(arrayContain[i + 1]);
  }
}

/**
 * @param {string[]} like
 * @param {string[]} conditions
 * @param {string[]} params
 */
export function likeBuilder(like, conditions, params) {
  for (let i = 0; i < like.length; i += 2) {
    conditions.push(`position(? in ${like[i]})`);
    params.push(like[i + 1]);
  }
}
