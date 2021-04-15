import React, {useState} from "react"
import styled from "styled-components"
import BrimTextLogo from "../../src/js/components/brim-text-logo"
import electronIsDev from "../../src/js/electron/is-dev"
import TabImport from "./import"
import TabCreateSpace from "./new"

const Nav = styled.nav`
  margin-top: auto;
  margin-bottom: 24px;
  ${(p) => p.theme.typography.labelSmall}
  text-align: center;
  user-select: none;
  a,
  b {
    padding: 0 6px;
  }
  b {
    font-weight: 500;
  }
`

const Link = ({active, onClick, children}) => {
  if (active) return <b>{children}</b>
  else return <a onClick={onClick}>{children}</a>
}

export default function LakeHome() {
  const [page, setPage] = useState("import")

  function content() {
    if (page === "import") return <TabImport />
    if (page === "create") return <TabCreateSpace />
    return null
  }

  return (
    <div className="tab-welcome">
      <section>
        <BrimTextLogo />
      </section>
      <section>{content()}</section>
      {electronIsDev && (
        <Nav>
          <Link active={page === "import"} onClick={() => setPage("import")}>
            Import Files
          </Link>{" "}
          |
          <Link active={page == "create"} onClick={() => setPage("create")}>
            Create Empty Space
          </Link>
        </Nav>
      )}
    </div>
  )
}
