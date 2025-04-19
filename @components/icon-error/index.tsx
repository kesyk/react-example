import cn from 'classnames'
import React from 'react'
import theme from './theme.css'

// tslint:disable-next-line:variable-name
export const IconError = ({ className }: { className?: string }) => (
  <div className={cn(theme.icon, className)} />
)
