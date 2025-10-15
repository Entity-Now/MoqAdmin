interface Options {
    [propName: string]: {
        api: PromiseFun
        params?: Record<string, any>
        transformData?(data: any): any
        is_init?: boolean
    }
}

export function useDictOptions<T = any>(options: Options): any {
    const optionsData: any = reactive({})
    const optionsKey: string[] = Object.keys(options)

    const apiLists = optionsKey.map((key: string) => {
        const value: any = options[key]
        optionsData[key] = []

        return (params?: Record<string, any>) => {
            let mergedParams = params
            if (params == null && typeof params == 'object') {
                mergedParams = { ...toRaw(value.params || {}), ...mergedParams || {} }
            }
            return value.api(mergedParams)
        }
    })

    const refresh = async (params?: Record<string, any>): Promise<void> => {
        const res: PromiseSettledResult<any>[] = await Promise.allSettled<Promise<any>>(apiLists.filter((item: any) => item.is_init !== false).map((api) => api(params)))
        res.forEach((item: PromiseSettledResult<any>, index: number): void => {
            const key: string = optionsKey[index]

            if (item.status === 'fulfilled') {
                const { transformData } = options[key]
                optionsData[key] = transformData ? transformData(item.value) : item.value
            }
        })
    }

    // 刷新指定的选项
    const refreshOptions = async (keys: string[], params?: Record<string, any>): Promise<void> => {
        const keysSet = new Set(keys)
        const filteredKeys = optionsKey.filter((key: string) => keysSet.has(key))
        const filteredApiLists = filteredKeys.map((key: string) => apiLists[optionsKey.indexOf(key)])
        const res: PromiseSettledResult<any>[] = await Promise.allSettled<Promise<any>>(filteredApiLists.map((api) => api(params)))
        res.forEach((item: PromiseSettledResult<any>, index: number): void => {
            const key: string = filteredKeys[index]
            if (item.status === 'fulfilled') {
                const { transformData } = options[key]
                optionsData[key] = transformData ? transformData(item.value) : item.value
            }
        })
    }

    refresh().then((): void => { })

    return {
        optionsData: optionsData as T,
        refresh,
        refreshOptions
    }
}
