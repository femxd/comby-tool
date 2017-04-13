import React from 'react'
import classnames from 'classnames';

const {__name__} = ({className, children}) => {
  const classes = [
    'cb-{__className__}',
    className
  ]
  return (
    <div className={ classnames(classes) }>
      { children }
    </div>
  )
}

{__name__}.defaultProps = {
}

{__name__}.propTypes = {
  //@INTRO：设置{__title__}类名
  className: React.PropTypes.string,
  // disable: React.PropTypes.oneOf([
  //   true,
  //   false
  // ])
}


export default {__name__};
