import {ZedPrimitive} from "zealot/zed"
import zql from "../zql"

export function md5Correlation(md5: string) {
  return `md5=${md5} | count() by md5 | sort -r | head 5`
}

export function txHostsCorrelation(md5: string) {
  return `md5=${md5} | count() by tx_hosts | sort -r | head 5`
}

export function rxHostsCorrelation(md5: string) {
  return `md5=${md5} | count() by rx_hosts | sort -r | head 5`
}

export function filenameCorrelation(md5: string) {
  return `md5=${md5} | count() by filename, mime_type | sort -r | head 5`
}

export function uidFilter(uid: string | ZedPrimitive) {
  return zql`uid=${uid} or ${uid} in conn_uids or ${uid} in uids or referenced_file.uid=${uid}`
}

export function cidFilter(cid: string | ZedPrimitive) {
  return zql`community_id=${cid}`
}

export const UID_CORRELATION_LIMIT = 100
export function correlationLimit() {
  return `head ${UID_CORRELATION_LIMIT}`
}

type RelatedIds = {
  uid?: string
  cid?: string
}

export function correlationIds({uid, cid}: RelatedIds) {
  const filters = []
  if (uid) filters.push(uidFilter(uid))
  if (cid) filters.push(cidFilter(cid))
  return [filters.join(" or "), correlationLimit()].join(" | ")
}

export function uidCorrelation(uid: string | ZedPrimitive) {
  return `${uidFilter(uid)} | ${correlationLimit()}`
}

export function cidCorrelation(cid: string | ZedPrimitive) {
  return `${cidFilter(cid)} | ${correlationLimit()}`
}

export function connCorrelation(
  uid: ZedPrimitive,
  cid: ZedPrimitive,
  ts: ZedPrimitive,
  duration: ZedPrimitive
) {
  const tsDate = ts.toDate()
  const dur = duration.toFloat() + 90 // Add a 1.5 minute buffer for events that get logged late
  const endTsDate = new Date(new Date(tsDate).getTime() + dur * 1000)
  const cidFilter = zql`community_id = ${cid} and ts >= ${tsDate} and ts < ${endTsDate}`
  return `${uidFilter(uid)} or (${cidFilter}) | ${correlationLimit()}`
}
