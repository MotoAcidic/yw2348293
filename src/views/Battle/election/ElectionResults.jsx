import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import './swal.css'
import ak from "../../../assets/img/stateflags/ak.jpg";
import al from "../../../assets/img/stateflags/al.jpg";
import ar from "../../../assets/img/stateflags/ar.jpg";
import az from "../../../assets/img/stateflags/az.jpg";
import ca from "../../../assets/img/stateflags/ca.jpg";
import co from "../../../assets/img/stateflags/co.jpg";
import ct from "../../../assets/img/stateflags/ct.jpg";
import de from "../../../assets/img/stateflags/de.jpg";
import fl from "../../../assets/img/stateflags/fl.jpg";
import ga from "../../../assets/img/stateflags/ga.jpg";
import hi from "../../../assets/img/stateflags/hi.jpg";
import ia from "../../../assets/img/stateflags/ia.jpg";
import id from "../../../assets/img/stateflags/id.jpg";
import il from "../../../assets/img/stateflags/il.jpg";
import indiana from "../../../assets/img/stateflags/in.jpg";
import ks from "../../../assets/img/stateflags/ks.jpg";
import ky from "../../../assets/img/stateflags/ak.jpg";
import la from "../../../assets/img/stateflags/la.jpg";
import ma from "../../../assets/img/stateflags/ma.jpg";
import md from "../../../assets/img/stateflags/md.jpg";
import me from "../../../assets/img/stateflags/me.jpg";
import mi from "../../../assets/img/stateflags/mi.jpg";
import mn from "../../../assets/img/stateflags/mn.jpg";
import mo from "../../../assets/img/stateflags/mo.jpg";
import ms from "../../../assets/img/stateflags/ms.jpg";
import mt from "../../../assets/img/stateflags/mt.jpg";
import nc from "../../../assets/img/stateflags/nc.jpg";
import nd from "../../../assets/img/stateflags/nd.jpg";
import ne from "../../../assets/img/stateflags/ne.jpg";
import nh from "../../../assets/img/stateflags/nh.jpg";
import nj from "../../../assets/img/stateflags/nj.jpg";
import nm from "../../../assets/img/stateflags/nm.jpg";
import nv from "../../../assets/img/stateflags/nv.jpg";
import ny from "../../../assets/img/stateflags/ny.jpg";
import oh from "../../../assets/img/stateflags/oh.jpg";
import ok from "../../../assets/img/stateflags/ok.jpg";
import or from "../../../assets/img/stateflags/or.jpg";
import pa from "../../../assets/img/stateflags/pa.jpg";
import ri from "../../../assets/img/stateflags/ri.jpg";
import sc from "../../../assets/img/stateflags/sc.jpg";
import sd from "../../../assets/img/stateflags/sd.jpg";
import tn from "../../../assets/img/stateflags/tn.jpg";
import tx from "../../../assets/img/stateflags/tx.jpg";
import ut from "../../../assets/img/stateflags/ut.jpg";
import va from "../../../assets/img/stateflags/va.jpg";
import vt from "../../../assets/img/stateflags/vt.jpg";
import wa from "../../../assets/img/stateflags/wa.jpg";
import wi from "../../../assets/img/stateflags/wi.jpg";
import wv from "../../../assets/img/stateflags/wv.jpg";
import wy from "../../../assets/img/stateflags/wy.jpg";
// import us from "../../../assets/img/american-flag.jpg";

function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const ElectionStatusDisplay = () => {
	return (
		<VersusContainer>
			<Column>
				<BigTitle>Trump</BigTitle>
			</Column>
			<Divider />
			<Column>
				<BigTitle>Undecided</BigTitle>
			</Column>
			<Divider />
			<Column>
				<BigTitle>Biden</BigTitle>
			</Column>
		</VersusContainer>
	)
}

const BigTitle = styled.div`
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: rgb(255, 204, 74);
  max-width: 80vw;
  margin: -30px auto 40px;
`

const Column = styled.div`
display: flex;
width: 200px;
flex-direction: column;
align-items: center;`

const Divider = styled.div`
height: 80%;
width: 1px;
margin: auto 0 auto 0;
`

const VersusContainer = !isMobile() ? styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-around;
font-size: 30px;
font-family: "Gilroy";
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
border-radius: 8px;
border: solid 2px rgba(255, 183, 0, 0.3);
background-color: rgba(4,2,43,1);
padding: 20px;
height: 470px;
min-width: 300px;
` : styled.div`
margin: 0 0 40px 0;
width: 90vw;
display: flex;
flex-direction: column;
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
	padding: 20px;
	border-radius: 8px;
	border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);`


export default ElectionStatusDisplay;