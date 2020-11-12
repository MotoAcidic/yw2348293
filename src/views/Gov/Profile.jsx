import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import axios from "axios";
import useYam from '../../hooks/useYam'
import editIcon from "../../assets/img/edit@2x.png"
import EditableProfile from "./EditableProfile";

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Profile = () => {
  const { account, connect } = useWallet()
  const yam = useYam()
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchAccount = () => {
    axios.post(`${getServerURI()}/gov/get-account`,
      { address: account, }).then(res => {
        console.log("user", res.data);
        setUser(res.data);
      }).catch(err => {
        console.log(err);
      })
  }


  useEffect(() => {
    console.log("here", yam)
    if (!yam.defaultProvider) {
      fetchAccount()
    }
  }, [yam, account])


  if (!user) return (<div />);
  return (

    <Side>
      <Title>Profile</Title>
      <Container>
        <EditableProfile user={user} fetchAccount={() => fetchAccount()} />
        <PercentWin>
          {user.battleWinPercent + user.betWinPercent / 2}% win
      </PercentWin>
      </Container>
    </Side>
  )
}

const Title = styled.div`
display: flex;
justify-content: space-between;
font-family: Alegreya;
  font-size: 25px;
  height: 30px;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const PercentWin = styled.div`
margin-top: 10px;
font-family: Gilroy;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const Side = styled.div`
position: relative;
width: 39%;
display: flex;
flex-direction: column;
`

const Container = styled.div`
position: relative;
width: calc(100% - 40px);
padding: 20px;
border-radius: 8px;
border: solid 2px rgba(255,183,0,0.3);
background-color: rgba(256,256,256,0.08);
display: flex;
flex-direction: column;
align-items: center;
`
export default Profile