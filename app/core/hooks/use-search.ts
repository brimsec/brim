import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {search} from "src/js/flows/search/mod"
import {AppDispatch} from "src/js/state/types"
import {zng} from "zealot"

type R = [zng.Record[], boolean]

export default function useSearch(query: string, deps?: any[]): R {
  const dispatch = useDispatch<AppDispatch>()
  const [records, setRecords] = useState<zng.Record[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)

  useEffect(() => {
    setIsFetching(true)
    const {response, abort} = dispatch(search({query}))
    response.chan(0, (records) => setRecords(records))
    response.status((status) => setIsFetching(status === "FETCHING"))
    return abort
  }, deps)

  return [records, isFetching]
}
