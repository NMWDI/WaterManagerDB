import { useEffect, useRef } from 'react'

export function useDidMountEffect(func: Function, dependencies: any) {
    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) func()
        else didMount.current = true
    }, dependencies)
}

