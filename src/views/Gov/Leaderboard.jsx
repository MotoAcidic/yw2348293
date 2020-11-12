import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import axios from "axios";
import useYam from '../../hooks/useYam'
import editIcon from "../../assets/img/edit@2x.png"
import EditableProfile from "./EditableProfile";
import loading from "../../assets/img/loading.gif";


function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

const Profile = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get(`${getServerURI()}/gov/battle-leaderboard`).then(res => {
      const leaderboardContent = res.data.map((item, index) => {
        return (
          <LeaderBoardItem key={index}>
            <StyledContent>
              <StyledCardIcon style={{ backgroundColor: item.pictureColor }}>{item.picture}</StyledCardIcon>
              <StyledTitle>{item.nickname ? item.nickname : item.address.substring(0, 10) + "..."}</StyledTitle>
              <StyledVotes>{item.battleWinPercent}%</StyledVotes>
            </StyledContent>
          </LeaderBoardItem>
        )
      })
      setLeaderboard(leaderboardContent);
    }).catch(err => {
      console.log(err);
    })
  }, []);

  return (
    <LeaderboardContainer>
      <Title>Leaderboard
        <LeaderboardType>
          <option value="battles">battles</option>
          <option value="bets">bets</option>
        </LeaderboardType>
      </Title>
      {leaderboard.length > 0 ?
        <LeaderBoard>{leaderboard}</LeaderBoard>
        :
        <Loading src={loading} />
      }
    </LeaderboardContainer>
  )
}

const StyledVotes = styled.h4`
  margin: 0;
  font-family: "Gilroy";
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 0;
`;

const StyledTitle = styled.h4`
  margin: 0;
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 0;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;

const StyledCardIcon = styled.div`
  font-size: 60px;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
`;


const LeaderBoardItem = !isMobile()
  ? styled.div`
  text-align: center;
  min-width: 120px;
  width: 17%;
  height: 200px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 20px;`
  : styled.div`
  text-align: center;
  width: 40%;
  min-width: 200px;
  height: 200px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
  font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  padding: 20px 0 20px 0;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;`;

const LeaderboardType = styled.select``


const LeaderboardContainer = styled.div`
width: 80vw;
height: 175px;
border-radius: 16px;
display: flex;
flex-direction: column;
margin-bottom: 80px;
`

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

const Loading = styled.img`
  margin: auto;
width: 100px;
	height: 100px;
`

const LeaderBoard = !isMobile() ? styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 60px;
` : styled.div`
  display: flex;
  width: 90vw;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 60px;
`;

export default Profile