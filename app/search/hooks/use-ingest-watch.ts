import {
  decodeSearchParams,
  encodeSearchParams
} from "app/search/utils/search-params"
import {useCallback, useEffect, useRef} from "react"
import {useSelector} from "react-redux"
import {useHistory} from "react-router"
import Current from "src/js/state/Current"
import Ingest from "src/js/state/Ingest"
import {createPath} from "history"
import {throttle} from "lodash"
import usePrevious from "src/js/components/hooks/use-previous"

function useThrottledCallback(cb: Function, delay: number) {
  const options = {leading: true, trailing: true}
  const ref = useRef(cb)
  useEffect(() => {
    ref.current = cb
  }, [cb])
  return useCallback(
    throttle((...args) => ref.current(...args), delay, options),
    [delay]
  )
}

export default function useIngestWatch() {
  const snapshot = useSelector(Ingest.getSnapshot)
  const space = useSelector(Current.mustGetSpace)
  const history = useHistory()
  const replace = () => {
    const params = decodeSearchParams(history.location.search)
    const search = encodeSearchParams({...params, keep: true})
    const path = createPath({...history.location, search})
    history.replace(path)
  }
  const throttled = useThrottledCallback(replace, 5000)
  const nowIngesting = space.ingesting()
  const wasIngesting = usePrevious(nowIngesting, [nowIngesting])

  useEffect(() => {
    if (wasIngesting && !nowIngesting) {
      throttled.cancel()
      replace()
    }
    if (!nowIngesting) return
    /**
     * During ingest we show the default span which is everything.
     * Each time more data comes in (snapshot increments), reload
     * the current location which will cause the tiles to update.
     */
    throttled()
  }, [
    snapshot,
    wasIngesting,
    nowIngesting,
    JSON.stringify(space.everythingSpan())
  ])
}
