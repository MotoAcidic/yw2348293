import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import axios from "axios";
import useYam from '../../hooks/useYam'
import Button from "../../components/Button";
import swal from "sweetalert2";
import useStakedBalance from '../../hooks/useStakedBalance'
import useFarm from '../../hooks/useFarm'
import { getDisplayBalance } from '../../utils/formatBalance'
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import useModal from '../../hooks/useModal'
import RulesModal from "./RulesModal";

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Community = ({ fetchSuggestions, suggestions }) => {
  const [exploitPrevent, setExploitPrevent] = useState(false);
  const [oldAccount, setOldAccount] = useState(null);
  const { account, connect } = useWallet()
  const yam = useYam()
  const {
    contract,
    depositToken,
    depositTokenAddress,
    earnToken,
    name,
    icon,
  } = useFarm('BATTLEPOOL') || {
    contract: null,
    depositToken: '',
    depositTokenAddress: '',
    earnToken: '',
    name: '',
    icon: ''
  }
  const stakedBalance = useStakedBalance(contract)
  console.log("whaddoihave", suggestions);

  const newStyledSuggestions = suggestions.map((suggestion, index) => {
    let votesColor = "white";
    let votesSymbol = "";
    if (suggestion.totalVotes > 0) {
      votesColor = "#38ff00";
      votesSymbol = "+";
    } else if (suggestion.totalVotes < 0) {
      votesColor = "#ff4343";
    }

    const castVote = async (voteAmount) => {
      if (exploitPrevent) {
        swal.fire({
          icon: 'error',
          title: `Error`,
          text: `Wait to vote sdfjil.`
        })
        return;
      }
      if (getDisplayBalance(stakedBalance) <= 0) {
        swal.fire({
          icon: 'error',
          title: `Error`,
          text: `You must have WAR staked in order to participate in governance. Please stake war in the $WARchest on the battle page.`
        })
        return;
      }
      const sig = await yam.web3.eth.personal.sign(JSON.stringify({
        address: account,
        suggestionId: suggestion._id,
        voteAmount
      }), account).catch(err => console.log(err))
      axios.post(`${getServerURI()}/gov/vote`,
        { address: account, voteAmount, suggestionId: suggestion._id, sig }).then(res => {
          console.log("user", res.data);
          fetchSuggestions();
        }).catch(err => {
          console.log(err);
        })
    }
    const upDoot = () => {
      if (suggestion.upDooted) return;
      castVote(getDisplayBalance(stakedBalance));
    }
    const downDoot = () => {
      if (suggestion.downDooted) return;
      castVote(getDisplayBalance(stakedBalance) * -1);
    }
    console.log("suggest", suggestion)
    return (
      <SingleSuggestion>
        <VoteButtons>
          <UpVote onClick={() => upDoot()} style={suggestion.upDooted ? { fill: "#38ff00" } : {}} viewBox="0 0 400 400">
            <path stroke-width="3" d="M 100 100 L 300 100 L 200 300 z" />
          </UpVote>
          <DownVote onClick={() => downDoot()} style={suggestion.downDooted ? { fill: "#ff4343" } : {}} viewBox="0 0 400 400">
            <path stroke-width="3" d="M 100 100 L 300 100 L 200 300 z" />
          </DownVote>
        </VoteButtons>
        <SuggestionBody>
          <SingleTop>
            <SuggestionVotes>
              <SuggestedUserInfo>
                <StyledCardIcon style={{ backgroundColor: suggestion.pictureColor }}>{suggestion.picture}</StyledCardIcon>
                {suggestion.nickname ? suggestion.nickname : suggestion.address.substring(0, 6) + '...' + suggestion.address.substring(account.length - 4)}

              </SuggestedUserInfo>
              <ColorVotes style={{ color: votesColor }}>
                {votesSymbol}{suggestion.totalVotes.toLocaleString()}
              </ColorVotes>
            </SuggestionVotes>
            <SuggestionVotes>
              {moment(suggestion.timestamp).fromNow()}
            </SuggestionVotes>
          </SingleTop>
          <SuggestionText>
            {suggestion.message}
          </SuggestionText>
        </SuggestionBody>
      </SingleSuggestion>
    )
  })
  return (newStyledSuggestions);
}

const SuggestedUserInfo = styled.div`
display: flex;
align-items: center;
`

const StyledCardIcon = styled.div`
  font-size: 16px;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  border: solid 2px rgba(256,256,256,0.3);
  margin-right: 5px;
`;

const SingleTop = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
margin-bottom: 8px;`

const Pagination = styled.div`
display:flex;
justify-content: flex-end;`

const ColorVotes = styled.div`
font-family: GilroyMedium;
font-size: 12px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
display: flex;
margin-left: 10px;
align-items: center;`

const SuggestionVotes = styled.div`
font-family: GilroyMedium;
font-size: 12px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
display: flex;
color: white;
align-items: center;`

const SuggestionText = styled.div`
font-family: "Gilroy";
font-size: 20px;
font-weight: bold;
font-stretch: normal;
text-align: left;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: white;
word-break: break-word;
`

const SuggestionBody = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: flex-start;
`

const Space = styled.div`
height: 20px;`

const UpVote = styled.svg`
width: 20px;
height: 20px;
stroke: grey;
fill: grey;
cursor: pointer;
transition: all 0.2s linear;
transform: scaleY(-1);
&:hover {
  fill: white;
  stroke: rgb(255,204,74);
}
`
const DownVote = styled.svg`
width: 20px;
height: 20px;
stroke: grey;
fill: grey;
cursor: pointer;
transition: all 0.2s linear;
&:hover {
  fill: white;
  stroke: rgb(255,204,74);
}
`


const VoteButtons = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`


const SingleSuggestion = styled.div`
width: calc(100% - 40px);
padding: 10px 20px;
border-radius: 8px;
border: solid 2px rgba(255,183,0,0.3);
background-color: rgba(256,256,256,0.08);
display: flex;
flex-direction: row;
margin-bottom: 20px;
`

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
margin-right: 16px;
&:hover {
  opacity: 1;
}
`

const TitleSide = styled.div`
display: flex;`

const CharLimit = styled.div`
color: white;
font-family: GilroyMedium;
font-size: 14px;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
display: flex;
align-items: center;
margin-right: 20px;
`

const FormBottom = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;`

const Input = styled.textarea`
width: calc(100% - 20px);
  height: 40px;
  margin: 20px 0 20px;
  padding: 10px;
  border-radius: 8px;
  color: white;
  font-family: GilroyMedium;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(255, 183, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.2);
  resize: vertical;
  margin-bottom: 10px;
  ::placeholder {
    color: rgba(256,256,256,0.6);
  }
  `

const Form = styled.form``

const SuggestionTitle = styled.div`
font-family: Gilroy;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #ffffff;
  text-align: left;
`

const SuggestionBox = styled.div`
position: relative;
width: calc(100% - 80px);
padding: 20px 40px 20px 40px;
border-radius: 8px;
border: solid 2px rgba(255,183,0,0.3);
background-color: rgba(256,256,256,0.08);
display: flex;
flex-direction: column;
`

const VotingSection = styled.div`
width: 100%;`

const Icon = styled.svg`
width: 20px;
height: 20px;
stroke: white;
cursor: pointer;
transition: all 0.2s linear;
margin-left: 10px;
&:hover {
  stroke: rgb(255,204,74);
}
`

const Title = styled.div`
display: flex;
width: 100%;
display: flex;
font-family: Alegreya;
  font-size: 25px;
  // height: 30px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const Side = styled.div`
width: 59%;
display: flex;
flex-direction: column;
position: relative;
`

export default Community