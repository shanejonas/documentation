import React, { useEffect, useContext } from 'react';
import { NetworkParameterContext, fetchData } from './lib/NetworkParameterStore';

const explorerUrl = {
  'TESTNET': 'https://explorer.fairground.wtf/network-parameters',
  'MAINNET': 'https://explorer.vega.xyz/network-parameters',
}

/**
 * Renders a network parameter and its value, fetching the value live
 * from the relevant network if possible, but using build time values
 * by default 

 * @param {Object} props 
 */
export default function NetworkParameter(props) {
  const vega_network = props?.frontMatter?.vega_network || 'TESTNET';
  const hideName = props.hideName ? props.hideName : false
  const suffix = props.suffix ? props.suffix : false

  if (!vega_network) {
    throw new Error("Missing vega_network");
  }

  const dataForNetwork = useContext(NetworkParameterContext)
  let type, data
  // Server side render / pre-render will use defaults (generated by build.sh)
  if(!!dataForNetwork[vega_network].latest) {
    // Used for minor styling differences for live versus buildtime
    type = 'live'
    data = dataForNetwork[vega_network].latest 
  } else {
    type = 'buildtime'
    data = dataForNetwork[vega_network].buildTime 
  }

  useEffect(async () => {
    // This is only triggered on client side render, and will be blocked
    // from fetching multiple times
    await fetchData(vega_network)
  }, [vega_network]);

  if (data) {
    const value = data[props.param]
    let displayValue

    if (suffix) {
      let suffixCorrected = suffix
      if (suffix === 'tokens' && value === '1') {
        suffixCorrected = 'token'
      }

      displayValue = <strong>{value} {suffixCorrected}</strong>
    } else {
      displayValue = <strong>{value}</strong>
    }

    return (<a href={explorerUrl[vega_network]} className={`networkparameter networkparameter--${type}`} title={`Set by network parameter: ${props.param}`}>
      <span className="networkparametericon">👀</span>
      {(hideName ? null : <span className="networkparametername">{props.param}: </span>)}
      <span className="networkparametervalue">{displayValue || `Could not find ${props.param}`}</span>
    </a>);
  } else {
    // Note this shouldn't happen, as there should be build time defaults
    return <b>Loading...</b>;
  }
}