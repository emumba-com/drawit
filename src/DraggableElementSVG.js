import React from 'react'

export default ({children, ...rest}) => <svg style={{overflow: 'visible'}} {...rest}>{children}</svg>