import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import generateWeb3ReduxApi from './generateWeb3ReduxApi';
import generateNetworkApi from './generateNetworkApi';

// TODO should we scope this? this the right place to put it?
let updatedState;

function getState() { return updatedState; }

function getWeb3Api(state, dispatch) {
  updatedState = state;
  return {
    ...generateWeb3ReduxApi(dispatch),
    networks: Object.keys(state.networks).reduce((o, networkId) => {
      return { ...o, [networkId]: generateNetworkApi({ networkId, getState, dispatch }) };
    }, {}),
  };
}

export default function web3Connect(passedMapStateToProps, passedActions) {
  // allow user to map custom map
  function mapStateToProps(state) {
    return { ...passedMapStateToProps(state), web3Redux: state.web3Redux };
  }

  function mapDispatchToProps(dispatch) {
    return { dispatch, ...bindActionCreators(passedActions, dispatch) };
  }
  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { dispatch, ...customActions } = dispatchProps;
    return {
      ...stateProps,
      ...ownProps,
      ...customActions,
      web3Redux: getWeb3Api(stateProps.web3Redux, dispatch),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps, mergeProps);
}
