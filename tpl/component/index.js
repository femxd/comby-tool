import React from 'react';
import classnames from 'classnames';

class {__name__} extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var { children, className } = this.props;
    const classes = [
      'cb-{__className__}',
      className
    ]

    return (
      <div className={ classnames(classes) }>
        { children }
      </div>
    );
  }
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