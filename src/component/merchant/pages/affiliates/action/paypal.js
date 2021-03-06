import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import { PayPalButton } from "react-paypal-button-v2"
import axios from 'axios'
export default function PaypalCheckout(props) {
  let style = {
      size: 'small',
      color: 'gold',
      shape: 'rect',
  }
	return (
      <PayPalButton
        amount="0.01"
        onSuccess={(details, data) => {
          alert("Transaction completed by " + details.payer.name.given_name);
        }}
        style={style}
        options={{
          clientId: props.clientid,
        }}
      />
	)
}
