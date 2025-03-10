import React from 'react'
import { RedirectPageClient } from './client-component'

// This Server Component handles parameter unwrapping
export default function RedirectPage({ params }: { params: { alias: string } }) {
  const unwrappedParams = React.use(params)
  
  return <RedirectPageClient alias={unwrappedParams.alias} />
}