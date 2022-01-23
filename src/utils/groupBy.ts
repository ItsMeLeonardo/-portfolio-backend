/**
 *
 * @param array a list of objects
 * @param keyGetter a function that returns the key to group by
 * @returns {Map<K, Array<T>>}
 * @example
 * const pets = [
 *  {type:"Dog", name:"Spot"},
 *  {type:"Cat", name:"Tiger"},
 *  {type:"Dog", name:"Rover"}
 * ]
 *
 * const grouped = groupBy(pets, pet => pet.type);
 * console.log(grouped.get('Dog'));
 * // [{type:"Dog", name:"Spot"}, {type:"Dog", name:"Rover"}]
 *
 */
export const groupBy = (array: any[], keyGetter): Map<string, any[]> => {
  const map = new Map();
  array.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
};
