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
  const [selectVal, setSelectVal] = useState("battles");

  useEffect(() => {
    setLeaderboard([]);
    axios.get(`${getServerURI()}/gov/${selectVal}-leaderboard`).then(res => {
      const leaderboardContent = res.data.map((item, index) => {
        return (
          <LeaderBoardItem key={index}>
            <StyledContent>
              <StyledCardIcon style={{ backgroundColor: item.pictureColor }}>{item.picture}</StyledCardIcon>
              <LeaderboardText>

                <StyledTitle>{item.nickname ? item.nickname : item.address.substring(0, 10) + "..."}</StyledTitle>
                {selectVal === "battles" ?
                  <StyledVotes>{item.battleWinPercent}%</StyledVotes>
                  :
                  <StyledVotes style={{ color: "#38ff00" }}>+${item.betAmountWon.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</StyledVotes>
                }
              </LeaderboardText>
            </StyledContent>
          </LeaderBoardItem>
        )
      })
      setLeaderboard(leaderboardContent);
    }).catch(err => {
      console.log(err);
    })
  }, [selectVal]);


  return (
    <LeaderboardContainer>
      <Title>Leaderboard
        <Leaderboards>
          <Option style={{ color: selectVal === "battles" ? "#ffbe1a" : "white" }} onClick={() => setSelectVal("battles")}>
            battles
          </Option>
          <Option style={{ color: selectVal === "bets" ? "#ffbe1a" : "white" }} onClick={() => setSelectVal("bets")}>
            bets
          </Option>
        </Leaderboards>
      </Title>
      {leaderboard.length > 0 ?
        <LeaderBoard>{leaderboard}</LeaderBoard>
        :
        <Loading src={loading} />
      }
    </LeaderboardContainer>
  )
}

const Option = styled.div`
font-family: "Gilroy";
font-size: 16px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
opacity: 0.9;
cursor: pointer;
&:hover {
  opacity: 1;
}
`

const Leaderboards = styled.div`
display: flex;
width: 100px;
justify-content: space-between;`

const LeaderboardText = styled.div``

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
  margin-bottom: 10px;
`;

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;

const StyledCardIcon = styled.div`
  font-size: 65px;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  border: solid 2px rgba(256,256,256,0.3);
`;


const LeaderBoardItem = !isMobile()
  ? styled.div`
  text-align: center;
  min-width: 120px;
  width: 18%;
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
  `
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

const LeaderboardContainer = styled.div`
width: 80vw;
max-width: 1200px;
border-radius: 16px;
display: flex;
flex-direction: column;
margin-bottom: 40px;
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
  width: 100%;
` : styled.div`
  display: flex;
  width: 90vw;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

export default Profile