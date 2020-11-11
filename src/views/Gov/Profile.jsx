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
    if (yam.defaultProvider) {
      fetchAccount()
    }
  }, [yam])


  if (!user) return (<div />);
  return (
    <Container>
      <EditableProfile nickname={user.nickname} picture={user.picture} color={user.pictureColor} />
    </Container>

  )
}

const Nickname = styled.div`
font-family: Alegreya;
font-size: 30px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const ProfilePicContainer = styled.div`
width: 82px;
height: 82px;
background-color: #002450;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 20px;
`

const ProfilePic = styled.img`
width: 50px;
height: 50px;

`

const CheckButton = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 20px;
font-size: 22px;
display: flex;
align-items: center;
justify-content: center;
color: white;
cursor: pointer;
transition: all .1s linear;
&:hover {
  font-size: 24px;
}`

const XButton = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 20px;
font-size: 18px;
display: flex;
align-items: center;
justify-content: center;
color: white;
cursor: pointer;
transition: all .1s linear;
&:hover {
  font-size: 20px;
}`

const EditingButtons = styled.div`
width: 46px;
height: 16px;
display: flex;
justify-content: space-between;
position: absolute;
right: 20px;
top: 20px;
`

const EditButton = styled.img`
position: absolute;
right: 20px;
top: 20px;
width: 16px;
height: 16px;
cursor: pointer;
transition: all .1s linear;
&:hover {
  width: 18px;
  height: 18px;
}`

const Container = styled.div`
position: relative;
width: calc(39% - 40px);
padding: 20px;
border-radius: 8px;
border: solid 2px rgba(255,183,0,0.3);
background-color: rgba(256,256,256,0.08);
display: flex;
flex-direction: column;
align-items: center;
`
export default Profile