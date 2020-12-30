import {Caption} from "app/detail/Spacing"
import React, {memo, useCallback} from "react"
import {useDispatch} from "react-redux"
import Link from "src/js/components/common/Link"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import {UID_CORRELATION_LIMIT} from "src/js/searches/programs"
import SearchBar from "src/js/state/SearchBar"

type Props = {
  count: number
  query: string
}

export default memo<Props>(function EventLimit({query, count}) {
  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(query))
    dispatch(submitSearch())
  }, [query])

  if (count < UID_CORRELATION_LIMIT) return null
  return (
    <Caption>
      Limited to {UID_CORRELATION_LIMIT} events.
      <Link onClick={onClick}>Query for All</Link>
    </Caption>
  )
})