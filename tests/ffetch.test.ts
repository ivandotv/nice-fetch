import ffetch from '../src/index'

describe('Proper response objects are returned', () => {
  let withMockResponse: (mockResponse: any) => jest.Mock
  let mockRequestInfo: RequestInfo
  let mockRequestInit: RequestInit

  beforeAll(() => {
    withMockResponse = (mockResponse: any) => {
      return jest.fn((_reqInfo: RequestInfo, _reqInit: RequestInit) =>
        Promise.resolve(mockResponse)
      )
    }
  })
  beforeEach(() => {
    mockRequestInfo = {} as RequestInfo
    mockRequestInit = {} as RequestInit
  })

  test('Properly pass request and request init to fetch function', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve()
    }

    const mockFetch = withMockResponse(mockResponse)
    global.fetch = mockFetch

    await ffetch(mockRequestInfo, mockRequestInit)

    expect(mockFetch.mock.calls[0][0]).toBe(mockRequestInfo)
    expect(mockFetch.mock.calls[0][1]).toBe(mockRequestInit)
  })
  test('When response is ok it returns data and the response', async () => {
    const mockData = {}
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockData)
    }

    global.fetch = withMockResponse(mockResponse)

    const [data, response] = await ffetch(mockRequestInfo, mockRequestInit)

    expect(data).toBe(mockData)
    expect(response).toBe(mockResponse)
  })
  describe('Call proper body parse methods ', () => {
    test('Default parse method for the response is json', async () => {
      const jsonMock = jest.fn(() => Promise.resolve())
      const mockResponse = {
        ok: true,
        json: jsonMock
      }

      global.fetch = withMockResponse(mockResponse)

      await ffetch(mockRequestInfo, mockRequestInit)

      expect(jsonMock).toBeCalled()
    })
    test('When parse method is json, response "json" is called', async () => {
      const jsonMock = jest.fn(() => Promise.resolve())
      const mockResponse = {
        ok: true,
        json: jsonMock
      }

      global.fetch = withMockResponse(mockResponse)
      await ffetch(mockRequestInfo, mockRequestInit, 'json')

      expect(jsonMock).toBeCalled()
    })

    test('When parse method is blob, response "blob" is called', async () => {
      const blobMock = jest.fn(() => Promise.resolve())
      const mockResponse = {
        ok: true,
        blob: blobMock
      }

      global.fetch = withMockResponse(mockResponse)

      await ffetch(mockRequestInfo, mockRequestInit, 'blob')

      expect(blobMock).toBeCalled()
    })
    test('When parse method is formData, response "formData" is called', async () => {
      const formDataMock = jest.fn(() => Promise.resolve())
      const mockResponse = {
        ok: true,
        formData: formDataMock
      }

      global.fetch = withMockResponse(mockResponse)

      await ffetch(mockRequestInfo, mockRequestInit, 'formData')

      expect(formDataMock).toBeCalled()
    })
    test('When parse method is text, response "text" is called', async () => {
      const textDataMock = jest.fn(() => Promise.resolve())
      const mockResponse = {
        ok: true,
        text: textDataMock
      }

      global.fetch = withMockResponse(mockResponse)

      await ffetch(mockRequestInfo, mockRequestInit, 'text')

      expect(textDataMock).toBeCalled()
    })
    test('When parse method is arrayBuffer, response "arrayBuffer" is called', async () => {
      const arrayBufferMock = jest.fn(() => Promise.resolve())
      const mockResponse = {
        ok: true,
        arrayBuffer: arrayBufferMock
      }

      global.fetch = withMockResponse(mockResponse)

      await ffetch(mockRequestInfo, mockRequestInit, 'arrayBuffer')

      expect(arrayBufferMock).toBeCalled()
    })
  })
  describe('Error handling', () => {
    test('When response is not OK, throw with the original response', async () => {
      const mockResponse = {
        ok: false,
        json: Promise.resolve()
      }

      global.fetch = withMockResponse(mockResponse)

      expect.assertions(1)
      try {
        await ffetch(mockRequestInfo, mockRequestInit)
      } catch (e) {
        expect(e).toBe(mockResponse)
      }
    })

    test('If response  is ok but response body parse throws, rethrow', async () => {
      const parseError = new Error()
      const mockResponse = {
        ok: true,
        json: () => Promise.reject(parseError)
      }

      global.fetch = withMockResponse(mockResponse)

      expect.assertions(1)
      try {
        await ffetch(mockRequestInfo, mockRequestInit)
      } catch (e) {
        expect(e).toBe(parseError)
      }
    })

    test('If fetch throws, rethrow', async () => {
      const mockFetchError = new Error()

      global.fetch = (((_reqInfo: RequestInfo, _reqInit: RequestInit) => {
        throw mockFetchError
      }) as unknown) as typeof fetch

      expect.assertions(1)
      try {
        await ffetch(mockRequestInfo, mockRequestInit)
      } catch (e) {
        expect(e).toBe(mockFetchError)
      }
    })
  })
})
