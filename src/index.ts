type KeyToBodyResponse = {
  blob: Blob
  formData: FormData
  arrayBuffer: ArrayBuffer
  text: string
  json: any
}

export type Content = keyof KeyToBodyResponse

export function fetchJson<T = any>(
  reqInfo: RequestInfo,
  reqInit?: RequestInit
): Promise<[T, Response]> {
  return niceFetch(reqInfo, reqInit, 'json') as Promise<[T, Response]>
}

export default function niceFetch<T extends Content = Content>(
  reqInfo: RequestInfo,
  reqInit?: RequestInit,
  // @ts-expect-error - suppress "different subtype constraint" error  because we can't have default value for a generic type
  content: T = 'json'
): Promise<[KeyToBodyResponse[typeof content], Response]> {
  return new Promise((resolve, reject) => {
    return fetch(reqInfo, reqInit)
      .then((res) => {
        if (res.ok) {
          res[content]()
            .then((data) => {
              resolve([data, res])
            })
            .catch(reject)
        } else {
          reject(res)
        }
      })
      .catch(reject)
  })
}
