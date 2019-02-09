import React, {Component} from "react"
import Logo from "components/_ui/Logo";
import Link from "components/_ui/Link";

require('./Header.scss')

const Header = () => (
  <div className="Header">
    <Link to="/" className="Header__link">
      <Logo size="small" />
      <div className="Header__link__title">
        Wattenberger
      </div>
    </Link>
  </div>
)

export default Header
