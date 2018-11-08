import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import Connect from "../components/Connect"
import * as actions from "../actions/boomd"
import {getCredentials} from "../reducers/boomdCredentials"
import {getBoomdError, getBoomdIsConnected} from "../reducers/boomdConnection"

const stateToProps = state => ({
  credentials: getCredentials(state),
  error: getBoomdError(state),
  isConnected: getBoomdIsConnected(state)
})

const dispatchToProps = dispatch => ({
  ...bindActionCreators(actions, dispatch),
  dispatch
})

export default connect(
  stateToProps,
  dispatchToProps
)(Connect)
