type KeyToBodyResponse = {
  blob: Blob
  formData: FormData
  arrayBuffer: ArrayBuffer
  text: string
  json: any
}

export default function ffetch<
  TExpectedData extends keyof KeyToBodyResponse = keyof KeyToBodyResponse
>(
  reqInfo: RequestInfo,
  reqInit?: RequestInit,
  // @ts-expect-error - suppress "different subtype constraint" error  because we can't have default value for a generic type
  content: TExpectedData = 'json'
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
