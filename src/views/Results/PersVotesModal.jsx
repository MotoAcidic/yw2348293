import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WinnerChalice from "../../assets/img/win@2x.png";
import logo from '../../assets/img/logo.png'
import Label from '../../components/Label'
import { Modallg, ModalProps } from '../../components/Modal'
import ModalTitle from '../../components/ModalTitle'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true
  }
  else {
    return false
  }
}

function getServerURI() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000'
  }
  return 'https://yieldwars-api.herokuapp.com'
}

const VotesModal  = ({ battleId, pool1, pool2, winner }) => {
  const [pool1Votes, setPool1Votes] = useState([]);
  const [pool2Votes, setPool2Votes] = useState([]);
  const [pool1Total, setPool1Total] = useState("");
  const [pool2Total, setPool2Total] = useState("");
  // const [usesPercentChange, setUsesPercentChange] = useState([]);

  console.log("jfwi", pool1, pool2)

  useEffect(() => {
    axios.post(`${getServerURI()}/api/pers-battle-votes`, { battleId }).then(res => {
      console.log("gotit", res.data);

      const pool1Rows = res.data.pool1.votes.map((vote) => <TR>
        <Address>
          {vote.address}
        </Address>
        <Votes>
          {vote.amount.toPrecision(7)}
        </Votes>
      </TR>)
      const pool2Rows = res.data.pool2.votes.map((vote) => <TR>
        <Address>
          {vote.address}
        </Address>
        <Votes>
          {vote.amount.toPrecision(7)}
        </Votes>
      </TR>)

      setPool1Total("Votes: " + res.data.pool1.totalVotes.toLocaleString('en-US', { maximumFractionDigits: 4 }));
      setPool2Total("Votes: " + res.data.pool2.totalVotes.toLocaleString('en-US', { maximumFractionDigits: 4 }));
      setPool1Votes(pool1Rows);
      setPool2Votes(pool2Rows);
      // setUsesPercentChange(res.data.usesPercentChange);
    });
  }, [])

  return (
    <Modallg>
      <Space/>
      <ModalTitle text="Recorded Votes" />
      <Label />
      <ModalContent>
        <Side>
        {winner === 1 ? <Top>
               <>
               <Empty/>
               <WinningCardIcon src={pool1.picture} />
               </>
               <Chalice />
               </Top>
             : <Top>
               <StyledCardIcon src={pool1.picture} />
               </Top>}
          <StyledTitle>{pool1.name}</StyledTitle>
          <TotalVotes>
            {pool1Total}
          </TotalVotes>
          <TableContainer>
            <Table>
              {pool1Votes}
            </Table>
          </TableContainer>
        </Side>
        <Side>
          {winner === 2 ? <Top>
               <>
               <Empty/>
               <WinningCardIcon src={pool2.picture} />
               <Chalice />
               </>
               </Top>
             : <Top>
               <StyledCardIcon src={pool2.picture} />
               </Top>}
          <StyledTitle>{pool2.name}</StyledTitle>
          <TotalVotes>
            {pool2Total}
          </TotalVotes>
          <TableContainer>
            <Table>
              {pool2Votes}
            </Table>
          </TableContainer>
        </Side>
      </ModalContent>
    </Modallg>
  )
}

const Empty = styled.div`
width: 30px;`

const Top = styled.div`
width: 100%;
display: flex;
justify-content: center;
align-items: center;`

const Space = styled.div`
height: 20px;`

const TotalVotes = styled.h4`
font-family: "Gilroy";
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #003677;
margin: 0 auto 20px auto;
`

const Table = styled.table`
font-size: 12px;
`

const TableContainer = !isMobile() ? styled.div`
overflow-y: scroll;
width: 80%;` : styled.div`
overflow-y: scroll;
width: 100%;`

const TR = styled.tr``

const Address = styled.th`
text-align: left;`

const Votes = styled.th`
text-align: left;
padding-left: 20px;`

const StyledTitle = styled.h4`
font-family: "Gilroy";
font-size: 30px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #003677;
margin: 20px auto 20px auto;`

const StyledCardIcon = styled.img`
font-size: 50px;
height: 80px;
width: 80px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
box-shadow: rgba(1, 27, 59, 0.3) 4px 4px 8px inset, rgba(1, 27, 59, 0.3) -6px -6px 12px inset;
margin: 2px;
`

const WinningCardIcon = styled.img`
font-size: 50px;
height: 80px;

width: 80px;
border-radius: 40px;
align-items: center;
display: flex;
justify-content: center;
box-shadow: rgba(1, 27, 59, 0.3) 4px 4px 8px inset, rgba(1, 27, 59, 0.3) -6px -6px 12px inset;
border: solid 2px rgba(255, 213, 0, 0.7);
margin: 2px 10px 2px 10px;

`

const Side = !isMobile () ? styled.div`
  display: flex;
  flex-direction: column;
  height: 75vh;
  align-items: center;
  width: 45%;
` : styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 95%;
`
const Chalice = styled.div`
background-repeat: no-repeat;
background-size: cover;
height: 40px;
width: 30px;
background-image: url(${WinnerChalice});
`

const ModalContent = !isMobile() ? styled.div`
font-family: Gilroy;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.5;
letter-spacing: normal;
color: #003677;
margin: 10px;
display: flex;
justify-content: space-evenly;
` :styled.div`
font-family: Gilroy;
font-size: 18px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1.5;
letter-spacing: normal;
color: #003677;
margin: 10px 0 10px 0;
display: flex;
flex-direction: column;
max-height: 70vh;
overflow-y: scroll;
`


export default VotesModal;