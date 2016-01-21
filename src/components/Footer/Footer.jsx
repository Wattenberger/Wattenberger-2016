import React, {Component} from "react"
import classNames from "classnames"
import github from "./github.svg"
import linkedin from "./linkedin.svg"
import mail from "./mail.svg"
import twitter from "./twitter.svg"

require('./Footer.scss')

const links = [
  {icon: twitter, alt: "Twitter", url: "https://twitter.com/wattenberger"},
  {icon: linkedin, alt: "LinkedIn", url: "https://www.linkedin.com/in/amelia-wattenberger-4b693634"},
  {icon: github, alt: "Github", url: "https://github.com/wattenberger"},
  {icon: mail, alt: "Email", url: "mailto:wattenberger@gmail.com"},
]

class Footer extends Component {
  getClassName() {
    return classNames("Footer")
  }

  renderLink(link, idx) {
    return <a className="Footer__link" href={link.url} title={link.alt} key={idx}>
      <img src={link.icon} />
    </a>
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <div className="Footer__c">© 2016 Amelia Wattenberger - code on <a href="https://github.com/Wattenberger/Wattenberger-2016">github</a></div>
        <div className="Footer__links">
          {links.map(::this.renderLink)}
        </div>
      </div>
    )
  }
}

export default Footer
