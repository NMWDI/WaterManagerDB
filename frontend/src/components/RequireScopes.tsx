import React from 'react'
import { useEffect, useState } from 'react'
import { RequireAuth, useAuthUser } from 'react-auth-kit'
import { SecurityScope } from '../interfaces.js'

import InsufficientPermView from "../views/InsufficientPermView";
import Topbar from "./Topbar";
import Sidebar from "../sidebar";
import { useLocation } from 'react-router-dom'

interface RequireScopesProps {
  requiredScopes: string[],
  children: any
}

// Wraps components. Will show them if the user has correct scopes (or no scopes are defined), will show InsufficientPermView if they dont, will redirect to login if not authenticated
// Note: The backend will often be checking scopes also, and will not return the page if the user's JWT does not have the correct ones
export default function RequireScopes({children, requiredScopes}: RequireScopesProps) {

    const authUser = useAuthUser()
    const userScopes = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string)
    const [userHasScopes, setUserHasScopes] = useState<boolean>(false)
    const location = useLocation()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const hasAllScopes = requiredScopes.every(reqScope => userScopes.includes(reqScope))
        setUserHasScopes(hasAllScopes)
    }, [requiredScopes, location.pathname])

    return (
        <RequireAuth loginPath={"/"}>
            <>
                {userHasScopes ? children :
                    <>
                        <Topbar />
                        <div className="container">
                            <Sidebar /><InsufficientPermView />
                        </div>
                    </>
                }
            </>
        </RequireAuth>
    )
}
