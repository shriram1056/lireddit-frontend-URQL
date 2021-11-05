import { Cache, QueryInput } from '@urql/exchange-graphcache'

//the result of queries will be cached and they won't be able to react to mutations result. here me query depend on login mutation.
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query // r: mutation object      q: query object
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any) //updateQuery() can be used to update the data of a given query using an updater function.

  //data:  The updater function receives the query data as its' only argument and must return the updated version of said data.
}
