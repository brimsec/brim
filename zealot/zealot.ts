import {createFetcher} from "./fetcher/fetcher"
import {spaces, logs, pcaps, search, archive, subspaces} from "./api/mod"
import {getHost} from "./util/host"
import {getDefaultSearchArgs} from "./config/search-args"
import {
  SearchArgs,
  SpaceArgs,
  PcapsPostArgs,
  PcapsGetArgs,
  LogsPostArgs,
  ZealotArgs,
  SubspaceCreateArgs,
  LogsPostPathsArgs
} from "./types"
import {IndexSearchArgs} from "./api/archive"

export function createZealot(
  hostUrl: string,
  args: ZealotArgs = {fetcher: createFetcher}
) {
  const host = getHost(hostUrl)
  const {promise, stream, upload} = args.fetcher(host)

  let searchArgs: SearchArgs = getDefaultSearchArgs()

  return {
    setSearchOptions: (args: Partial<SearchArgs>) => {
      searchArgs = {...searchArgs, ...args}
    },
    status: () => {
      return promise({method: "GET", path: "/status"})
    },
    version: () => {
      return promise({method: "GET", path: "/version"})
    },
    authMethod: () => {
      return promise({method: "GET", path: "/auth/method"})
    },
    authIdentity: () => {
      return promise({method: "GET", path: "/auth/identity"})
    },
    search: (zql: string, args?: Partial<SearchArgs>) => {
      return stream(search(zql, {...searchArgs, ...args}))
    },
    archive: {
      search: (args: IndexSearchArgs) => {
        return stream({
          ...archive.search(args),
          enhancers: searchArgs.enhancers
        })
      }
    },
    spaces: {
      list: () => {
        return promise(spaces.list())
      },
      get: (id: string) => {
        return promise(spaces.get(id))
      },
      stat: (id: string, args?: Partial<SearchArgs>) => {
        return stream(spaces.stat(id, {...searchArgs, ...args}))
      },
      create: (args: SpaceArgs) => {
        return promise(spaces.create(args))
      },
      delete: (id: string) => {
        return promise(spaces.delete(id))
      },
      update: (id: string, args: Partial<SpaceArgs>) => {
        return promise(spaces.update(id, args))
      }
    },
    subspaces: {
      create: (args: SubspaceCreateArgs) => {
        return promise(subspaces.create(args))
      }
    },
    pcaps: {
      post: (args: PcapsPostArgs) => {
        return stream(pcaps.post(args))
      },
      get: (args: PcapsGetArgs): Promise<Response> => {
        return promise(pcaps.get(args))
      }
    },
    logs: {
      post: (args: LogsPostArgs) => {
        return upload(logs.post(args))
      },
      postPaths: (args: LogsPostPathsArgs) => {
        return stream(logs.postPaths(args))
      }
    },
    inspect: {
      search: (zql: string, args?: Partial<SearchArgs>) => {
        return search(zql, {...searchArgs, ...args})
      }
    }
  }
}
