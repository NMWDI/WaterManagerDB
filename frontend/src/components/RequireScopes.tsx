import React from 'react'
import { useAuthUser } from 'react-auth-kit'
import { SecurityScope } from '../interfaces.js'

import { Navigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'

interface RequireScopesProps {
  requiredScopes: string[],
  children: any
}

export default function RequireScopes({children, requiredScopes}: RequireScopesProps) {
    const authUser = useAuthUser()
    const userScopes = authUser()?.user_role.security_scopes.map((scope: SecurityScope) => scope.scope_string)

    if (requiredScopes.every(reqScope => userScopes.includes(reqScope))) {
        return children
    }
    else {
        enqueueSnackbar("You do not have permission to view that page. Please contact an administrator if you believe this is an error.", {variant: 'error'})
        return (
            <Navigate to="/home" replace/>
        )
    }
}
