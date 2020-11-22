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
import Suggestions from "./Suggestions";

function isMobile() {
  if (window.innerWidth < window.innerHeight) return true
  else return false
}

function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

const Community = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [newSuggestion, setNewSuggestion] = useState("")
  const [sort, setSort] = useState("top");
  const [userAlreadySuggested, setUserAlreadySuggested] = useState(false);
  const [presentRulesModal] = useModal(<RulesModal />);
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

  const fetchSuggestions = () => {
    axios.post(`${getServerURI()}/gov/get-suggestions`,
      { address: account, page, sort }).then(res => {
        console.log("suggestions", res.data);
        setSuggestions(res.data.suggestions);
        setUserAlreadySuggested(res.data.userAlreadySuggested);
        setTotalPages(res.data.totalPages);
      }).catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    if (yam && account && !yam.defaultProvider) {
      fetchSuggestions()
    }
  }, [page, sort, yam, account])


  const handleChange = (e) => {
    if (e.target.value.length > 400) return;
    setNewSuggestion(e.target.value);
  }

  const submitSuggestion = async (e) => {
    e.preventDefault();
    console.log("megastank", suggestions);
    if (!newSuggestion) return;
    const signature = await yam.web3.eth.personal.sign(JSON.stringify({
      address: account,
      suggestion: newSuggestion,
    }), account).catch(err => console.log(err))
    axios.post(`${getServerURI()}/gov/suggestion`,
      {
        address: account,
        sig: signature,
        suggestion: newSuggestion,
      }).then(res => {
        setSort("new");
        setNewSuggestion("");
        fetchSuggestions()
      }).catch(err => {
        console.log(err.response);
        swal.fire({
          icon: 'error',
          title: `Error: ${err.response ? err.response.status : 404}`,
          text: `${err.response ? err.response.data : "server error"}`
        })
      })
  }

  const toggleSort = (newSort) => {
    setSort(newSort);
    setPage(0);
  }

  return (
    <Side>
      <TopTitle>
        <Left>
          Community Governance <Icon onClick={presentRulesModal} viewBox="0 0 180 180">
            <path fill="none" stroke-width="11" d="M9,89a81,81 0 1,1 0,2zm51-14c0-13 1-19 8-26c7-9 18-10 28-8c10,2 22,12 22,26c0,14-11,19-15,22c-3,3-5,6-5,9v22m0,12v16" />
          </Icon>
        </Left>
        <Right>
          <Option style={{ color: sort === "top" ? "white" : "#ffbe1a", textDecoration: sort === "top" ? "underline" : "none" }} onClick={() => toggleSort("top")}>
            top
          </Option>
          <Option style={{ color: sort === "new" ? "white" : "#ffbe1a", textDecoration: sort === "new" ? "underline" : "none" }} onClick={() => toggleSort("new")}>
            new
          </Option>

        </Right>
      </TopTitle>
      {suggestions.length > 0 && <Suggestions fetchSuggestions={() => fetchSuggestions()} suggestions={suggestions} />}
      <Pagination>
        <ReactPaginate
          previousLabel={'◄'}
          nextLabel={'►'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={(data) => setPage(data.selected)}
          forcePage={page}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </Pagination>
      <Space />
      <Title>Suggestion Box</Title>
      <SuggestionBox>
        <SuggestionTitle>
          What would you like to see on YieldWars? Let the community decide!
        </SuggestionTitle>
        <Form>
          <Input maxlength="400" placeholder="We should..." value={newSuggestion} onChange={(e) => handleChange(e)} />
          <FormBottom>
            {newSuggestion &&
              <CharLimit
                disabled={userAlreadySuggested ? true : false}
                style={{ color: newSuggestion.length >= 400 ? "red" : "white" }}
              >
                {newSuggestion.length}/400
              </CharLimit>}
            <Button
              disabled={userAlreadySuggested ? true : false}
              type="submit"
              onClick={(e) => submitSuggestion(e)}
              size="lg"
              text="Submit"
            />
          </FormBottom>
        </Form>
      </SuggestionBox>
    </Side>
  )
}

const Pagination = styled.div`
display:flex;
justify-content: flex-end;`

const Space = styled.div`
height: 20px;`


const Option = !isMobile () ? styled.div`
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
` : styled.div`
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
margin-left: 20vw;
`

const Left= !isMobile() ? styled.div`
display: flex;` : styled.div`
width: 70%;
display: flex;
font-size: 18px;`

const Right = !isMobile() ? styled.div`
display: flex;` : styled.div`
width: 30%;
display: flex;
font-size: 16px;`

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

const TopTitle = !isMobile() ? styled.div`
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
` : styled.div`
width: 100%;
display: flex;
font-family: Alegreya;
  font-size: 25px;
  // height: 30px;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
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

const Side = !isMobile() ? styled.div`
width: 59%;
display: flex;
flex-direction: column;
position: relative;
` : styled.div`
width: 95vw;
display: flex;
flex-direction: column;
position: relative;
`

export default Community