import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import axios from "axios";
import useYam from '../../hooks/useYam'
import Button from "../../components/Button";
import ReactPaginate from 'react-paginate';

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Community = () => {
  const { account, connect } = useWallet()
  const yam = useYam()
  const [suggestions, setSuggestions] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newSuggestion, setNewSuggestion] = useState("")
  const [userAlreadySuggested, setUserAlreadySuggested] = useState(false);

  const fetchAccount = () => {
    axios.get(`${getServerURI()}/gov/suggestions`,
      { address: account, }).then(res => {
        console.log("user", res.data);
        setSuggestions(res.data.suggestions);
        setTotalPages(res.data.totalPages);
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

  const handleChange = (e) => {
    if (e.target.value.length > 400) return;
    setNewSuggestion(e.target.value);
  }

  const submitSuggestion = () => {

  }


  return (
    <Side>
      <Title>Community Governance <Icon viewBox="0 0 180 180">
        <path fill="none" stroke-width="11" d="M9,89a81,81 0 1,1 0,2zm51-14c0-13 1-19 8-26c7-9 18-10 28-8c10,2 22,12 22,26c0,14-11,19-15,22c-3,3-5,6-5,9v22m0,12v16" />
      </Icon></Title>
      <VotingSection>

      </VotingSection>
      <Title>Suggestion Box</Title>
      <SuggestionBox>
        <SuggestionTitle>
          What would you like to see YieldWars impliment? Let the community decide!
        </SuggestionTitle>
        <Form>
          <Input maxlength="400" placeholder="We should..." value={newSuggestion} onChange={(e) => handleChange(e)} />
          <FormBottom>
            <Button
              type="submit"
              onClick={submitSuggestion()}
              size="lg"
              text="Submit"
              disabled={false}
            />
          </FormBottom>
        </Form>
      </SuggestionBox>
    </Side>
  )
}

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
font-family: Alegreya;
  font-size: 25px;
  // height: 30px;
  justify-content: flex-start;
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